export interface ExpenseCategory {
  [key: string]: string | number;
  category: string;
  amount: number;
}

export interface QuarterlyTrend {
  [key: string]: string | number;
  period: string;
  revenue: number;
  netIncome: number;
}

export interface MarketInsight {
  title: string;
  uri: string;
  snippet: string;
}

export interface FinancialReport {
  id: string;
  companyName: string;
  ticker: string;
  reportType: string;
  reportPeriod: string;
  reportYear: number;
  revenue: number;
  revenuePrior: number;
  netIncome: number;
  netIncomePrior: number;
  eps: number;
  epsPrior: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  sentimentScore: number;
  expenses: ExpenseCategory[];
  trends: QuarterlyTrend[];
  highlights: string[];
  managementCommentary: string;
  marketContext?: {
    insights: MarketInsight[];
    summary: string;
    timestamp: number;
  };
  audioBriefing?: {
    base64Audio: string;
    summary: string;
  };
  visualizedGuidance?: string; // URL to generated image
  timestamp: number;
}

export enum AppView {
  DASHBOARD = "dashboard",
  COMPARISON = "comparison",
  HISTORY = "history",
  UPLOAD = "upload",
}
