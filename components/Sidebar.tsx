
import React from 'react';
import { LayoutDashboard, FileUp, History, BarChart2, TrendingUp, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  view: AppView;
  setView: (view: AppView) => void;
  isOpen: boolean;
  onRunDiagnostics: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, isOpen, onRunDiagnostics }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.UPLOAD, label: 'Upload Report', icon: FileUp },
    { id: AppView.COMPARISON, label: 'Comparison', icon: BarChart2 },
    { id: AppView.HISTORY, label: 'Historical Reports', icon: History },
  ];

  const baseClasses = "w-64 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen z-[70] transition-transform duration-300 lg:translate-x-0";
  const mobileClasses = isOpen ? "translate-x-0 fixed inset-y-0 left-0" : "-translate-x-full fixed inset-y-0 left-0 lg:static";

  return (
    <div className={`${baseClasses} ${mobileClasses}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
          <TrendingUp className="text-white" size={24} />
        </div>
        <h1 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">FinAnalyzer Pro</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              view === item.id 
                ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-3 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={onRunDiagnostics}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all border border-emerald-100 dark:border-emerald-800/50"
        >
          <ShieldCheck size={18} />
          Run UI Diagnostics
        </button>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-xs">
          <p className="text-slate-900 dark:text-slate-200 font-black mb-1">System Health</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-slate-500 font-bold">API Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
