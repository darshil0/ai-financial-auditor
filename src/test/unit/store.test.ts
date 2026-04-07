import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/shared/services/store";
import { AppView } from "@/shared/types";

describe("useAppStore", () => {
  beforeEach(() => {
    // Clear the store before each test
    useAppStore.setState({
      view: AppView.DASHBOARD,
      reports: [],
      activeReportId: null,
      isDarkMode: false,
      isMobileMenuOpen: false,
      showDiagnostics: false,
    });
  });

  it("should initialize with default values", () => {
    const state = useAppStore.getState();
    expect(state.view).toBe(AppView.DASHBOARD);
    expect(state.reports).toEqual([]);
    expect(state.activeReportId).toBeNull();
  });

  it("should change the view", () => {
    useAppStore.getState().setView(AppView.UPLOAD);
    expect(useAppStore.getState().view).toBe(AppView.UPLOAD);
  });

  it("should add a report", () => {
    const mockReport = {
      id: "test-id",
      companyName: "Test Co",
      ticker: "TST",
      revenue: 100,
      timestamp: Date.now(),
      // ... rest of the fields
    } as any;

    useAppStore.getState().addReport(mockReport);
    expect(useAppStore.getState().reports).toHaveLength(1);
    expect(useAppStore.getState().reports[0].id).toBe("test-id");
    expect(useAppStore.getState().activeReportId).toBe("test-id");
    expect(useAppStore.getState().view).toBe(AppView.DASHBOARD);
  });

  it("should delete a report", () => {
    const mockReport = { id: "test-id" } as any;
    useAppStore.getState().addReport(mockReport);
    useAppStore.getState().deleteReport("test-id");
    expect(useAppStore.getState().reports).toHaveLength(0);
    expect(useAppStore.getState().activeReportId).toBeNull();
  });

  it("should toggle dark mode", () => {
    expect(useAppStore.getState().isDarkMode).toBe(false);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(true);
  });
});
