import { create } from "zustand";
import { AppView, FinancialReport } from "./types";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
  view: AppView;
  reports: FinancialReport[];
  activeReportId: string | null;
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  showDiagnostics: boolean;

  // Actions
  setView: (view: AppView) => void;
  addReport: (report: FinancialReport) => void;
  updateReport: (updatedReport: FinancialReport) => void;
  deleteReport: (id: string) => void;
  setActiveReportId: (id: string | null) => void;
  toggleDarkMode: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  setShowDiagnostics: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // State
      view: AppView.DASHBOARD,
      reports: [],
      activeReportId: null,
      isDarkMode: false,
      isMobileMenuOpen: false,
      showDiagnostics: false,

      // Actions
      setView: (view) => set({ view, isMobileMenuOpen: false }),
      addReport: (report) =>
        set((state) => ({
          reports: [report, ...state.reports],
          activeReportId: report.id,
          view: AppView.DASHBOARD,
        })),
      updateReport: (updatedReport) =>
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === updatedReport.id ? updatedReport : r,
          ),
        })),
      deleteReport: (id) =>
        set((state) => {
          const remaining = state.reports.filter((r) => r.id !== id);
          const newActiveId =
            state.activeReportId === id
              ? remaining.length > 0
                ? remaining[0].id
                : null
              : state.activeReportId;
          return { reports: remaining, activeReportId: newActiveId };
        }),
      setActiveReportId: (id) => set({ activeReportId: id, view: AppView.DASHBOARD }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
      setShowDiagnostics: (show) => set({ showDiagnostics: show }),
    }),
    {
      name: "fin-analyzer-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reports: state.reports,
        activeReportId: state.activeReportId,
        isDarkMode: state.isDarkMode,
      }),
    },
  ),
);
