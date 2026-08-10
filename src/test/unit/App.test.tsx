import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "@/App";
import { useAppStore } from "@/shared/services/store";
import { AppView } from "@/shared/types";
import { toast } from "sonner";

// Mock out the Recharts components to prevent JSDOM errors or logging warnings
vi.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    AreaChart: ({ children }: any) => <div>{children}</div>,
    Area: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />,
    PieChart: ({ children }: any) => <div>{children}</div>,
    Pie: () => <div />,
    Cell: () => <div />,
  };
});

// Mock sonner toast and Toaster
vi.mock("sonner", () => ({
  Toaster: () => <div data-testid="sonner-toaster" />,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      view: AppView.UPLOAD,
      reports: [],
      activeReportId: null,
      isDarkMode: false,
      isMobileMenuOpen: false,
      showDiagnostics: false,
    });
  });

  it("renders upload view by default and lets user switch views using the sidebar", async () => {
    render(<App />);

    // Initially in Upload View
    expect(screen.getByText("Analyze Corporate Earnings")).toBeInTheDocument();

    // Switch to Comparison view via sidebar
    const comparisonBtn = screen.getByText("Comparison").closest("button");
    // It's disabled since we have 0 reports, so click will not switch view
    expect(comparisonBtn).toHaveAttribute("title", "Requires at least 2 reports");

    // Add mock reports to the store to enable comparison and dashboard
    act(() => {
      useAppStore.setState({
        reports: [
          { id: "1", companyName: "Co A", ticker: "A", revenue: 100 } as any,
          { id: "2", companyName: "Co B", ticker: "B", revenue: 200 } as any,
        ],
        activeReportId: "1",
        view: AppView.UPLOAD,
      });
    });

    // Now click Comparison
    fireEvent.click(screen.getByText("Comparison"));
    expect(useAppStore.getState().view).toBe(AppView.COMPARISON);

    // Switch to Historical Reports
    fireEvent.click(screen.getByText("Historical Reports"));
    expect(screen.getByText("Analysis Vault")).toBeInTheDocument();
  });

  it("toggles dark mode in global state and document element classes", () => {
    render(<App />);

    const darkBtn = screen.getByLabelText("Switch to Dark Mode");
    fireEvent.click(darkBtn);

    expect(useAppStore.getState().isDarkMode).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    const lightBtn = screen.getByLabelText("Switch to Light Mode");
    fireEvent.click(lightBtn);

    expect(useAppStore.getState().isDarkMode).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("handles deleting a report from HistoryView correctly", async () => {
    act(() => {
      useAppStore.setState({
        reports: [
          { id: "report-delete", companyName: "Co Delete", ticker: "DEL", revenue: 100 } as any,
        ],
        activeReportId: "report-delete",
        view: AppView.HISTORY,
      });
    });

    render(<App />);

    // Trigger delete
    const deleteBtn = screen.getByLabelText("Delete report for Co Delete");
    fireEvent.click(deleteBtn);

    // Click confirm in the Modal
    const confirmBtn = screen.getByText("Confirm Delete");
    fireEvent.click(confirmBtn);

    // Toast should be success and store should be empty
    expect(toast.success).toHaveBeenCalledWith("Co Delete analysis deleted.");
    expect(useAppStore.getState().reports).toHaveLength(0);
  });

  it("renders diagnostics overlay when showDiagnostics is enabled", () => {
    act(() => {
      useAppStore.setState({
        showDiagnostics: true,
      });
    });

    render(<App />);

    expect(screen.getByText("UI Diagnostics")).toBeInTheDocument();

    // Click close on diagnostics
    const closeBtn = screen.getByLabelText("Close Diagnostics");
    fireEvent.click(closeBtn);

    expect(useAppStore.getState().showDiagnostics).toBe(false);
  });
});
