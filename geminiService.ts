import { GoogleGenAI, Type, Modality } from "@google/genai";
import { FinancialReport, MarketInsight } from "./types";

const getAIClient = () =>
  new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    companyName: { type: Type.STRING },
    ticker: { type: Type.STRING },
    reportType: { type: Type.STRING },
    reportPeriod: { type: Type.STRING },
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
    sentimentScore: { type: Type.INTEGER },
    expenses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          amount: { type: Type.NUMBER },
        },
        required: ["category", "amount"],
      },
    },
    trends: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          period: { type: Type.STRING },
          revenue: { type: Type.NUMBER },
          netIncome: { type: Type.NUMBER },
        },
        required: ["period", "revenue", "netIncome"],
      },
    },
    highlights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    managementCommentary: { type: Type.STRING },
  },
  required: [
    "companyName",
    "ticker",
    "reportType",
    "reportPeriod",
    "reportYear",
    "revenue",
    "revenuePrior",
    "netIncome",
    "eps",
    "grossMargin",
    "expenses",
    "trends",
    "highlights",
    "sentimentScore",
  ],
};

export async function analyzeEarningsReport(
  file: File,
): Promise<FinancialReport> {
  const ai = getAIClient();
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Data,
          },
        },
        {
          text: "Conduct a rigorous financial analysis of this earnings report. Extract all numerical KPIs with 100% accuracy. Identify the document type. Use your thinking capacity to ensure year-over-year calculations are correct. Determine a 'sentimentScore' (0-100) based on management's verbal confidence.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: reportSchema,
      thinkingConfig: { thinkingBudget: 16384 },
      temperature: 0.1,
    },
  });

  const rawData = JSON.parse(response.text || "{}");

  return {
    ...rawData,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
}

export async function generateAudioBriefing(report: FinancialReport) {
  const ai = getAIClient();
  const prompt = `Provide a concise 1-minute executive audio briefing for ${report.companyName}'s ${report.reportPeriod} ${report.reportYear} results. 
  Focus on the most critical takeaways: Revenue of ${report.revenue}, EPS of ${report.eps}, and the overall sentiment which is ${report.sentimentScore}/100. 
  Sound professional yet engaging, like a high-end financial analyst.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Kore" },
        },
      },
    },
  });

  const base64Audio =
    response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return {
    base64Audio: base64Audio || "",
    summary: "Professional analyst audio briefing ready.",
  };
}

export async function visualizeGuidance(
  report: FinancialReport,
): Promise<string> {
  const ai = getAIClient();
  const prompt = `A conceptual, futuristic corporate visualization for ${report.companyName} based on their latest guidance. 
  The theme should be 'Growth and Innovation'. Incorporate professional financial aesthetics, clean lines, and a high-end architectural feel. 
  Sentiment: ${report.sentimentScore}/100. Ticker: ${report.ticker}. 4k resolution, professional photography style.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "";
}

export async function getMarketContext(ticker: string, company: string) {
  const ai = getAIClient();
  const prompt = `Perform a comprehensive market scan for ${company} (${ticker}) focusing on developments since their last earnings report. Include current stock price trends, major news, and analyst upgrades/downgrades.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 2048 },
    },
  });

  const summary = response.text || "No market context available at this time.";
  const chunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  const insights: MarketInsight[] = chunks
    .map((chunk: any) => ({
      title: chunk.web?.title || "External Source",
      uri: chunk.web?.uri || "#",
      snippet: "",
    }))
    .filter((i: any) => i.uri !== "#");

  return {
    summary,
    insights,
    timestamp: Date.now(),
  };
}

export async function connectLiveAnalyst(
  report: FinancialReport,
  callbacks: any,
) {
  const ai = getAIClient();
  const systemInstruction = `You are a high-end senior financial analyst assistant. 
  The user is reviewing the earnings report for ${report.companyName} (${report.ticker}) for ${report.reportPeriod} ${report.reportYear}.
  Key data: Revenue ${report.revenue}, Net Income ${report.netIncome}, EPS ${report.eps}, Sentiment ${report.sentimentScore}.
  Highlights: ${report.highlights.join("; ")}.
  Provide deep insights, answer complex questions about these results, and maintain a professional, helpful, and objective tone.`;

  return ai.live.connect({
    model: "gemini-2.5-flash-native-audio-preview-09-2025",
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
      },
      systemInstruction,
    },
  });
}
