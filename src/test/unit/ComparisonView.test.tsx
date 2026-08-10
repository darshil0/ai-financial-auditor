import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ComparisonView from "@/features/comparison/ComparisonView";
import { FinancialReport } from "@/shared/types";

const mockReports: FinancialReport[] = [
  {
    id: "1",
    companyName: "Company A",
    ticker: "A",
    reportType: "10-Q",
    reportPeriod: "Q1",
    reportYear: 2023,
    revenue: 1000,
    netIncome: 100,
    eps: 1,
    revenuePrior: 900,
    netIncomePrior: 90,
    epsPrior: 0.9,
    grossMargin: 45,
    operatingMargin: 15,
    netMargin: 10,
    sentimentScore: 75,
    expenses: [],
    trends: [],
    highlights: [],
    managementCommentary: "Good quarter",
    timestamp: Date.now(),
  },
  {
    id: "2",
    companyName: "Company A",
    ticker: "A",
    reportType: "10-Q",
    reportPeriod: "Q2",
    reportYear: 2022, // Reverse chronology warning
    revenue: 1100,
    netIncome: 110,
    eps: 1.1,
    revenuePrior: 1000,
    netIncomePrior: 100,
    epsPrior: 1,
    grossMargin: 46,
    operatingMargin: 16,
    netMargin: 11,
    sentimentScore: 80,
    expenses: [],
    trends: [],
    highlights: [],
    managementCommentary: "Another good quarter",
    timestamp: Date.now(),
  },
  {
    id: "3",
    companyName: "Company B",
    ticker: "B",
    reportType: "10-K",
    reportPeriod: "FY",
    reportYear: 2023,
    revenue: 2000,
    netIncome: 200,
    eps: 2,
    revenuePrior: 1800,
    netIncomePrior: 180,
    epsPrior: 1.8,
    grossMargin: 40,
    operatingMargin: 12,
    netMargin: 8,
    sentimentScore: 70,
    expenses: [],
    trends: [],
    highlights: [],
    managementCommentary: "Solid yearly performance",
    timestamp: Date.now(),
  },
  {
    id: "4",
    companyName: "Company A",
    ticker: "A",
    reportType: "10-Q",
    reportPeriod: "Q3",
    reportYear: 2023,
    // missing vital metrics
    revenue: undefined as any,
    netIncome: undefined as any,
    eps: undefined as any,
    revenuePrior: 0,
    netIncomePrior: 0,
    epsPrior: 0,
    grossMargin: 0,
    operatingMargin: 0,
    netMargin: 0,
    sentimentScore: 0,
    expenses: [],
    trends: [],
    highlights: [],
    managementCommentary: "",
    timestamp: Date.now(),
  },
];

describe("ComparisonView", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a warning for mismatched tickers", () => {
    render(<ComparisonView reports={mockReports} report1Id="1" report2Id="3" />);
    expect(screen.getByText(/Entity Mismatch/)).toBeInTheDocument();
  });

  it("renders a warning for reverse chronological order", () => {
    render(<ComparisonView reports={mockReports} report1Id="1" report2Id="2" />);
    expect(screen.getByText(/Reverse Chronology/)).toBeInTheDocument();
  });

  it("renders locked state when there are fewer than 2 reports", () => {
    render(<ComparisonView reports={[mockReports[0]]} />);
    expect(screen.getByText("Comparison Hub Locked")).toBeInTheDocument();
    expect(screen.getByText(/Please upload at least two reports/)).toBeInTheDocument();
    expect(screen.getByTestId("locked-icon-container")).toBeInTheDocument();
  });

  it("allows dismissing warnings", () => {
    render(<ComparisonView reports={mockReports} report1Id="1" report2Id="3" />);
    const warningText = /Entity Mismatch/;
    expect(screen.getByText(warningText)).toBeInTheDocument();

    const warningContainer = screen.getByText(warningText).closest(".flex-1")?.parentElement;
    const closeBtn = warningContainer?.querySelector("button");
    expect(closeBtn).toBeInTheDocument();

    if (closeBtn) {
      fireEvent.click(closeBtn);
    }
    expect(screen.queryByText(warningText)).not.toBeInTheDocument();
  });

  it("can filter reports by type and update selections", () => {
    render(<ComparisonView reports={mockReports} report1Id="1" report2Id="2" />);

    const tenKButton = screen.getByText("10-K", { exact: false });
    expect(tenKButton).toBeInTheDocument();

    fireEvent.click(tenKButton);

    // Selections should only show Company B (10-K)
    const selects = screen.getAllByRole("combobox");
    expect(selects[0]).toHaveTextContent("B — Company B");
  });

  it("can refresh data visually", async () => {
    vi.useFakeTimers();
    render(<ComparisonView reports={mockReports} report1Id="1" report2Id="2" />);

    const refreshBtn = screen.getByLabelText("Refresh Data from Storage");
    expect(refreshBtn).toBeInTheDocument();

    fireEvent.click(refreshBtn);

    await act(async () => {
      vi.runAllTimers();
    });

    vi.useRealTimers();
  });

  it("renders incomplete data state when reports have missing required metrics", () => {
    render(<ComparisonView reports={mockReports} report1Id="1" report2Id="4" />);
    expect(screen.getByText("Incomplete Analysis Data")).toBeInTheDocument();
    expect(
      screen.getByText(/The selected financial models are missing key comparative metrics/),
    ).toBeInTheDocument();
  });

  it("supports exporting to CSV and downloading file", () => {
    render(<ComparisonView reports={mockReports} report1Id="1" report2Id="2" />);

    const exportCsvBtn = screen.getByText("Export Delta CSV");
    expect(exportCsvBtn).toBeInTheDocument();

    const clickMock = vi.fn();
    const mockLink = {
      setAttribute: vi.fn(),
      click: clickMock,
      style: {},
    } as any;

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "a") return mockLink;
      return originalCreateElement(tagName);
    });
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    fireEvent.click(exportCsvBtn);

    expect(clickMock).toHaveBeenCalled();
  });

  it("handles dropdown select changes for baseline and benchmark", () => {
    render(<ComparisonView reports={mockReports} report1Id="1" report2Id="2" />);

    const selects = screen.getAllByRole("combobox");
    expect(selects).toHaveLength(2);

    fireEvent.change(selects[0], { target: { value: "3" } });
    expect(selects[0]).toHaveValue("3");

    fireEvent.change(selects[1], { target: { value: "1" } });
    expect(selects[1]).toHaveValue("1");
  });
});
