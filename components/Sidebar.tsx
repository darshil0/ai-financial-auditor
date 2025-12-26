
import React from 'react';
import { LayoutDashboard, FileUp, History, BarChart2, TrendingUp } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  view: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.UPLOAD, label: 'Upload Report', icon: FileUp },
    { id: AppView.COMPARISON, label: 'Comparison', icon: BarChart2 },
    { id: AppView.HISTORY, label: 'Historical Reports', icon: History },
  ];

  return (
    <div className="w-64 hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <TrendingUp className="text-white" size={24} />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">FinAnalyzer Pro</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === item.id 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm">
          <p className="text-slate-600 dark:text-slate-400 font-medium">Power of AI</p>
          <p className="text-slate-400 dark:text-slate-500 mt-1">Upload any earnings PDF to get instant insights.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
