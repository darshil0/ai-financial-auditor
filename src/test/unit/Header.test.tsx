import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Header from "@/shared/components/Header";
import { FinancialReport } from "@/shared/types";

describe("Header Component", () => {
  const mockReports: FinancialReport[] = [
    {
      id: "report-1",
      companyName: "Alpha Corp",
      ticker: "ALPH",
      reportType: "10-Q",
      reportPeriod: "Q1",
      reportYear: 2026,
      revenue: 10000000,
    } as any,
    {
      id: "report-2",
      companyName: "Beta LLC",
      ticker: "BETA",
      reportType: "10-K",
      reportPeriod: "FY",
      reportYear: 2025,
      revenue: 50000000,
    } as any,
  ];

  const defaultProps = {
    isDarkMode: false,
    onToggleDarkMode: vi.fn(),
    companyName: "Alpha Corp",
    ticker: "ALPH",
    reports: mockReports,
    onSelectReport: vi.fn(),
    onToggleMenu: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders active company and ticker when specified", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Alpha Corp")).toBeInTheDocument();
    expect(screen.getByText("ALPH")).toBeInTheDocument();
  });

  it("renders fallback 'Financial Hub' when active company is not specified", () => {
    render(<Header {...defaultProps} companyName={undefined} ticker={undefined} />);
    expect(screen.getByText("Financial Hub")).toBeInTheDocument();
  });

  it("calls onToggleMenu when mobile hamburger menu is clicked", () => {
    render(<Header {...defaultProps} />);
    const menuBtn = screen.getByLabelText("Open Navigation");
    fireEvent.click(menuBtn);
    expect(defaultProps.onToggleMenu).toHaveBeenCalledTimes(1);
  });

  it("toggles theme when theme toggles are clicked", () => {
    render(<Header {...defaultProps} isDarkMode={false} />);
    const darkBtn = screen.getByLabelText("Switch to Dark Mode");
    fireEvent.click(darkBtn);
    expect(defaultProps.onToggleDarkMode).toHaveBeenCalledTimes(1);
  });

  it("focuses search input on Cmd+K / Ctrl+K keyboard shortcut", () => {
    render(<Header {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search Ticker or Company...") as HTMLInputElement;

    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    act(() => {
      document.dispatchEvent(event);
    });

    expect(document.activeElement).toBe(input);
  });

  it("opens dropdown and filters results on input change, and closes on clicking outside", () => {
    render(<Header {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search Ticker or Company...");

    // Focus input
    fireEvent.focus(input);
    // Type search
    fireEvent.change(input, { target: { value: "beta" } });

    // Should display dropdown with Beta result
    expect(screen.getByText("BETA — FY 2025")).toBeInTheDocument();
    expect(screen.queryByText("ALPH — Q1 2026")).not.toBeInTheDocument();

    // Click outside to close
    fireEvent.mouseDown(document);
    expect(screen.queryByText("BETA — FY 2025")).not.toBeInTheDocument();
  });

  it("supports keyboard navigation within search results (ArrowDown, ArrowUp, Enter, Escape)", () => {
    render(<Header {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search Ticker or Company...");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "" } }); // Show top results (both reports)

    // Should show both reports
    expect(screen.getByText("ALPH — Q1 2026")).toBeInTheDocument();
    expect(screen.getByText("BETA — FY 2025")).toBeInTheDocument();

    // ArrowDown should highlight first item
    fireEvent.keyDown(input, { key: "ArrowDown" });
    // ArrowDown again should highlight second item
    fireEvent.keyDown(input, { key: "ArrowDown" });
    // ArrowUp should highlight first item again
    fireEvent.keyDown(input, { key: "ArrowUp" });

    // Enter should select the highlighted item (report-1)
    fireEvent.keyDown(input, { key: "Enter" });
    expect(defaultProps.onSelectReport).toHaveBeenCalledWith("report-1");
  });

  it("closes dropdown on Escape key", () => {
    render(<Header {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search Ticker or Company...");

    fireEvent.focus(input);
    expect(screen.getByText("ALPH — Q1 2026")).toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByText("ALPH — Q1 2026")).not.toBeInTheDocument();
  });

  it("navigates search dropdown with ArrowUp and Enter on unselected item", () => {
    render(<Header {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search Ticker or Company...");

    fireEvent.focus(input);

    // Press ArrowDown to highlight first (index 0)
    fireEvent.keyDown(input, { key: "ArrowDown" });
    // Press ArrowUp to highlight nothing (index -1)
    fireEvent.keyDown(input, { key: "ArrowUp" });
    // Press Enter (should select first item if nothing is selected)
    fireEvent.keyDown(input, { key: "Enter" });

    expect(defaultProps.onSelectReport).toHaveBeenCalledWith("report-1");
  });

  it("displays 'No data found' message when query matches nothing", () => {
    render(<Header {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search Ticker or Company...");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "mismatching-query" } });

    expect(screen.getByText("No data found")).toBeInTheDocument();
  });
});
