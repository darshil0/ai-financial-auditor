
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialReport, MarketInsight } from "./types";

/**
 * Initialize Gemini API with process.env.API_KEY.
 * Using gemini-3-pro-preview for high-stakes financial data extraction and reasoning.
 */
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    companyName: { type: Type.STRING },
    ticker: { type: Type.STRING },
    reportPeriod: { type: Type.STRING, description: "e.g., Q3" },
    reportYear: { type: Type.INTEGER },
    revenue: { type: Type.NUMBER },
    revenuePrior: { type: Type.NUMBER },
    netIncome: { type: Type.NUMBER },
    netIncomePrior: { type: Type.NUMBER },
    eps: { type: Type.NUMBER },
    epsPrior: { type: Type.NUMBER },
    grossMargin: { type: Type.NUMBER },
    operatingMargin: { type: Type.NUMBER },
    netMargin: { type: Type.NUMBER },
    sentimentScore: { type: Type.INTEGER, description: "A score from 0 (very bearish) to 100 (very bullish) based on management tone." },
    expenses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          amount: { type: Type.NUMBER }
        },
        required: ["category", "amount"]
      }
    },
    trends: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          period: { type: Type.STRING },
          revenue: { type: Type.NUMBER },
          netIncome: { type: Type.NUMBER }
        },
        required: ["period", "revenue", "netIncome"]
      }
    },
    highlights: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    managementCommentary: { type: Type.STRING }
  },
  required: [
    "companyName", "ticker", "reportPeriod", "reportYear", "revenue", 
    "revenuePrior", "netIncome", "eps", "grossMargin", "expenses", "trends", "highlights", "sentimentScore"
  ]
};

export async function analyzeEarningsReport(file: File): Promise<FinancialReport> {
  const ai = getAIClient();
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data
            }
          },
          {
            text: "Conduct a rigorous financial analysis of this earnings report. Extract all numerical KPIs with 100% accuracy. Use your thinking capacity to ensure year-over-year calculations are correct. Determine a 'sentimentScore' (0-100) based on management's verbal confidence during the call/release transcript."
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: reportSchema,
      thinkingConfig: { thinkingBudget: 8192 }, // Ample budget for financial auditing
      temperature: 0.1
    }
  });

  const rawData = JSON.parse(response.text || '{}');
  
  return {
    ...rawData,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
}

export async function getMarketContext(ticker: string, company: string) {
  const ai = getAIClient();
  const prompt = `Perform a comprehensive market scan for ${company} (${ticker}) focusing on developments since their last earnings report. Include current stock price trends, major news, and analyst upgrades/downgrades.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 2048 }
    }
  });

  const summary = response.text || "No market context available at this time.";
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  const insights: MarketInsight[] = chunks.map((chunk: any) => ({
    title: chunk.web?.title || 'External Source',
    uri: chunk.web?.uri || '#',
    snippet: ''
  })).filter((i: any) => i.uri !== '#');

  return {
    summary,
    insights,
    timestamp: Date.now()
  };
}
