import React, { useEffect, useState } from "react";
import { AppView } from "@/types";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import ComparisonView from "@/components/ComparisonView";
import HistoryView from "@/components/HistoryView";
import ReportUploader from "@/components/ReportUploader";
import DiagnosticsOverlay from "@/components/DiagnosticsOverlay";
import Modal from "@/components/Modal";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAppStore } from "@/store";
import { Toaster, toast } from "sonner";

const App: React.FC = () => {
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const showErrorModal = (title: string, message: string) => {
    setErrorModal({ isOpen: true, title, message });
  };

  const {
    view,
    isMobileMenuOpen,
    showDiagnostics,
    reports,
    activeReportId,
    isDarkMode,
    setView,
    addReport,
    updateReport,
    deleteReport: deleteReportFromStore,
    setActiveReportId,
    toggleDarkMode,
    setMobileMenuOpen,
    setShowDiagnostics,
  } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const activeReport = reports.find((r) => r.id === activeReportId) || null;

  const handleDeleteReport = (id: string) => {
    const reportToDelete = reports.find((r) => r.id === id);
    deleteReportFromStore(id);
    toast.success(
      `${reportToDelete?.companyName || "Report"} analysis deleted.`,
    );
  };

  return (
    <>
      <Toaster
        position="top-right"
        theme={isDarkMode ? "dark" : "light"}
        richColors
      />
      <div
        className={`min-h-screen flex transition-colors duration-200 ${
          isDarkMode
            ? "bg-slate-900 text-slate-100"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <Sidebar
          view={view}
          setView={setView}
          isOpen={isMobileMenuOpen}
          onRunDiagnostics={() => setShowDiagnostics(true)}
          reportCount={reports.length}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            isDarkMode={isDarkMode}
            setIsDarkMode={toggleDarkMode}
            companyName={activeReport?.companyName}
            ticker={activeReport?.ticker}
            reports={reports}
            onSelectReport={setActiveReportId}
            onToggleMenu={() => setMobileMenuOpen(!isMobileMenuOpen)}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <ErrorBoundary>
              {view === AppView.UPLOAD && (
                <ReportUploader onReportAdded={addReport} />
              )}

              {view === AppView.DASHBOARD && (
                <Dashboard
                  report={activeReport}
                  onSwitchToUpload={() => setView(AppView.UPLOAD)}
                  onUpdateReport={updateReport}
                />
              )}

              {view === AppView.COMPARISON && (
                <ComparisonView reports={reports} />
              )}

              {view === AppView.HISTORY && (
                <HistoryView
                  reports={reports}
                  setActiveReportId={setActiveReportId}
                  deleteReport={handleDeleteReport}
                />
              )}
            </ErrorBoundary>
          </main>
        </div>

        {showDiagnostics && (
          <DiagnosticsOverlay
            onClose={() => setShowDiagnostics(false)}
            showErrorModal={(msg) => showErrorModal("Diagnostic Error", msg)}
          />
        )}

        <Modal
          isOpen={errorModal.isOpen}
          onClose={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
          title={errorModal.title}
        >
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {errorModal.message}
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default App;
