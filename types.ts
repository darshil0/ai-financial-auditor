
export interface ExpenseCategory {
  category: string;
  amount: number;
}

export interface QuarterlyTrend {
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
  sentimentScore: number; // 0 to 100
  expenses: ExpenseCategory[];
  trends: QuarterlyTrend[];
  highlights: string[];
  managementCommentary: string;
  marketContext?: {
    insights: MarketInsight[];
    summary: string;
    timestamp: number;
  };
  timestamp: number;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  COMPARISON = 'comparison',
  HISTORY = 'history',
  UPLOAD = 'upload'
}
