import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComparisonView from '../../components/ComparisonView';
import { FinancialReport } from '../../types';

const mockReports: FinancialReport[] = [
  {
    id: '1',
    companyName: 'Company A',
    ticker: 'A',
    reportType: '10-Q',
    reportPeriod: 'Q1',
    reportYear: 2023,
    revenue: 1000,
    netIncome: 100,
    eps: 1,
    revenuePrior: 900,
    netIncomePrior: 90,
    epsPrior: 0.9,
    grossMargin: 0,
    operatingMargin: 0,
    netMargin: 0,
    sentimentScore: 0,
    expenses: [],
    trends: [],
    highlights: [],
    managementCommentary: '',
    timestamp: 0
  },
  {
    id: '2',
    companyName: 'Company A',
    ticker: 'A',
    reportType: '10-Q',
    reportPeriod: 'Q2',
    reportYear: 2022, // Note the year is earlier
    revenue: 1100,
    netIncome: 110,
    eps: 1.1,
    revenuePrior: 1000,
    netIncomePrior: 100,
    epsPrior: 1,
    grossMargin: 0,
    operatingMargin: 0,
    netMargin: 0,
    sentimentScore: 0,
    expenses: [],
    trends: [],
    highlights: [],
    managementCommentary: '',
    timestamp: 0
  },
  {
    id: '3',
    companyName: 'Company B',
    ticker: 'B',
    reportType: '10-K',
    reportPeriod: 'FY',
    reportYear: 2023,
    revenue: 2000,
    netIncome: 200,
    eps: 2,
    revenuePrior: 1800,
    netIncomePrior: 180,
    epsPrior: 1.8,
    grossMargin: 0,
    operatingMargin: 0,
    netMargin: 0,
    sentimentScore: 0,
    expenses: [],
    trends: [],
    highlights: [],
    managementCommentary: '',
    timestamp: 0
  },
];

describe('ComparisonView', () => {
  it('renders a warning for mismatched tickers', () => {
    render(
      <ComparisonView
        reports={mockReports}
        report1Id="1"
        report2Id="3"
      />
    );
    expect(screen.getByText(/Entity Mismatch/)).toBeInTheDocument();
  });

  it('renders a warning for reverse chronological order', () => {
    render(
      <ComparisonView
        reports={mockReports}
        report1Id="1"
        report2Id="2"
      />
    );
    expect(screen.getByText(/Reverse Chronology/)).toBeInTheDocument();
  });
});
