
import React, { useState, useEffect } from 'react';
import { AppView, FinancialReport } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ComparisonView from './components/ComparisonView';
import HistoryView from './components/HistoryView';
import ReportUploader from './components/ReportUploader';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fin_reports');
    if (saved) {
      const parsed = JSON.parse(saved);
      setReports(parsed);
      if (parsed.length > 0) setActiveReportId(parsed[0].id);
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

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
      setActiveReportId(reports.find(r => r.id !== id)?.id || null);
    }
  };

  const activeReport = reports.find(r => r.id === activeReportId) || null;

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar view={view} setView={setView} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          companyName={activeReport?.companyName}
          ticker={activeReport?.ticker}
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
            <ComparisonView reports={reports} />
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
    </div>
  );
};

export default App;
