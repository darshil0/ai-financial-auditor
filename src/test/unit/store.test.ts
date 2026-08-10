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
    } as any;

    useAppStore.getState().addReport(mockReport);
    expect(useAppStore.getState().reports).toHaveLength(1);
    expect(useAppStore.getState().reports[0].id).toBe("test-id");
    expect(useAppStore.getState().activeReportId).toBe("test-id");
    expect(useAppStore.getState().view).toBe(AppView.DASHBOARD);
  });

  it("should update an existing report", () => {
    const mockReport = {
      id: "test-id",
      companyName: "Test Co",
      ticker: "TST",
      revenue: 100,
    } as any;

    useAppStore.getState().addReport(mockReport);

    const updatedReport = {
      id: "test-id",
      companyName: "Updated Co",
      ticker: "TST",
      revenue: 150,
    } as any;

    useAppStore.getState().updateReport(updatedReport);
    expect(useAppStore.getState().reports).toHaveLength(1);
    expect(useAppStore.getState().reports[0].companyName).toBe("Updated Co");
    expect(useAppStore.getState().reports[0].revenue).toBe(150);
  });

  it("should delete a report", () => {
    const mockReport = { id: "test-id" } as any;
    useAppStore.getState().addReport(mockReport);
    useAppStore.getState().deleteReport("test-id");
    expect(useAppStore.getState().reports).toHaveLength(0);
    expect(useAppStore.getState().activeReportId).toBeNull();
  });

  it("should handle deleting active report when there are other reports", () => {
    const r1 = { id: "id-1" } as any;
    const r2 = { id: "id-2" } as any;
    useAppStore.getState().addReport(r1);
    useAppStore.getState().addReport(r2);
    useAppStore.getState().setActiveReportId("id-2");

    useAppStore.getState().deleteReport("id-2");
    expect(useAppStore.getState().reports).toHaveLength(1);
    expect(useAppStore.getState().activeReportId).toBe("id-1");
  });

  it("should toggle dark mode", () => {
    expect(useAppStore.getState().isDarkMode).toBe(false);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(true);
  });

  it("should set mobile menu open status", () => {
    expect(useAppStore.getState().isMobileMenuOpen).toBe(false);
    useAppStore.getState().setMobileMenuOpen(true);
    expect(useAppStore.getState().isMobileMenuOpen).toBe(true);
  });

  it("should set diagnostics overlay visibility", () => {
    expect(useAppStore.getState().showDiagnostics).toBe(false);
    useAppStore.getState().setShowDiagnostics(true);
    expect(useAppStore.getState().showDiagnostics).toBe(true);
  });
});
