
import React, { useState, useEffect } from 'react';
import { AppView, FinancialReport } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ComparisonView from './components/ComparisonView';
import HistoryView from './components/HistoryView';
import ReportUploader from './components/ReportUploader';
import DiagnosticsOverlay from './components/DiagnosticsOverlay';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  const [reports, setReports] = useState<FinancialReport[]>(() => {
    const saved = localStorage.getItem('fin_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeReportId, setActiveReportId] = useState<string | null>(() => {
    const saved = localStorage.getItem('fin_reports');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed[0].id : null;
    }
    return null;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('fin_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const refreshReports = () => {
    const saved = localStorage.getItem('fin_reports');
    if (saved) {
      const parsed = JSON.parse(saved);
      setReports(parsed);
      if (activeReportId && !parsed.find((r: FinancialReport) => r.id === activeReportId)) {
        setActiveReportId(parsed.length > 0 ? parsed[0].id : null);
      }
    }
  };

  const handleReportAdded = (report: FinancialReport) => {
    setReports(prev => [report, ...prev]);
    setActiveReportId(report.id);
    setView(AppView.DASHBOARD);
  };

  const handleUpdateReport = (updatedReport: FinancialReport) => {
    setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    if (activeReportId === id) {
      const remaining = reports.filter(r => r.id !== id);
      setActiveReportId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const activeReport = reports.find(r => r.id === activeReportId) || null;

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        view={view} 
        setView={(v) => { setView(v); setIsMobileMenuOpen(false); }} 
        isOpen={isMobileMenuOpen}
        onRunDiagnostics={() => setShowDiagnostics(true)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          companyName={activeReport?.companyName}
          ticker={activeReport?.ticker}
          reports={reports}
          onSelectReport={(id) => {
            setActiveReportId(id);
            setView(AppView.DASHBOARD);
          }}
          onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {view === AppView.UPLOAD && (
            <ReportUploader onReportAdded={handleReportAdded} />
          )}
          
          {view === AppView.DASHBOARD && (
            <Dashboard 
              report={activeReport} 
              onSwitchToUpload={() => setView(AppView.UPLOAD)} 
              onUpdateReport={handleUpdateReport}
            />
          )}

          {view === AppView.COMPARISON && (
            <ComparisonView reports={reports} onRefresh={refreshReports} />
          )}

          {view === AppView.HISTORY && (
            <HistoryView 
              reports={reports} 
              setActiveReportId={(id) => {
                setActiveReportId(id);
                setView(AppView.DASHBOARD);
              }}
              deleteReport={deleteReport}
            />
          )}
        </main>
      </div>

      {showDiagnostics && (
        <DiagnosticsOverlay onClose={() => setShowDiagnostics(false)} />
      )}
    </div>
  );
};

export default App;
