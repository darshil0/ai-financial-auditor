
import React from 'react';
import { Sun, Moon, Search, Bell } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  companyName?: string;
  ticker?: string;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode, companyName, ticker }) => {
  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {companyName ? (
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{companyName}</h2>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{ticker}</span>
          </div>
        ) : (
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Overview</h2>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search metrics..." 
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-full pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
