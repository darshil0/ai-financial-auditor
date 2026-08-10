import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SummaryCards from "@/features/dashboard/SummaryCards";
import { FinancialReport } from "@/shared/types";

const mockReport: FinancialReport = {
  id: "1",
  companyName: "Test Co",
  ticker: "TST",
  reportType: "10-Q",
  reportPeriod: "Q1",
  reportYear: 2024,
  revenue: 1000000,
  revenuePrior: 900000,
  netIncome: 200000,
  netIncomePrior: 150000,
  eps: 2.5,
  epsPrior: 2.0,
  grossMargin: 50,
  operatingMargin: 25,
  netMargin: 20,
  sentimentScore: 75,
  expenses: [],
  trends: [],
  highlights: [],
  managementCommentary: "",
  timestamp: 0,
};

describe("SummaryCards", () => {
  it("renders all four card labels", () => {
    render(<SummaryCards report={mockReport} />);
    expect(screen.getByText("Gross Revenue")).toBeInTheDocument();
    expect(screen.getByText("Net Earnings")).toBeInTheDocument();
    expect(screen.getByText("Diluted EPS")).toBeInTheDocument();
    expect(screen.getByText("Operating Margin")).toBeInTheDocument();
  });

  it("displays formatted values", () => {
    render(<SummaryCards report={mockReport} />);
    expect(screen.getByText("$1.00M")).toBeInTheDocument();
    expect(screen.getByText("$200.00K")).toBeInTheDocument();
    expect(screen.getByText("$2.50")).toBeInTheDocument();
  });

  it("shows growth indicators", () => {
    render(<SummaryCards report={mockReport} />);
    const growthBadges = screen.getAllByText(/%/);
    expect(growthBadges.length).toBeGreaterThanOrEqual(3);
  });
});
