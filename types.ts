
export interface ExpenseCategory {
  /**
   * Added index signature to satisfy Recharts ChartDataInput requirement.
   * Recharts requires data objects to be indexable when using dynamic keys.
   */
  [key: string]: string | number;
  category: string;
  amount: number;
}

export interface QuarterlyTrend {
  /**
   * Added index signature to satisfy Recharts ChartDataInput requirement.
   * Recharts requires data objects to be indexable when using dynamic keys.
   */
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
  reportType: string; // e.g., "10-Q", "10-K", "Press Release"
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