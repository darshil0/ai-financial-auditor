
import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Search, Bell, ChevronRight, Clock, Hash, Menu } from 'lucide-react';
import { FinancialReport } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  companyName?: string;
  ticker?: string;
  reports: FinancialReport[];
  onSelectReport: (id: string) => void;
  onToggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode, companyName, ticker, reports, onSelectReport, onToggleMenu }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredReports = searchTerm.trim() === '' 
    ? reports.slice(0, 5) 
    : reports.filter(r => 
        r.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm, isDropdownOpen]);

  const handleSelect = (id: string) => {
    onSelectReport(id);
    setSearchTerm('');
    setIsDropdownOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown') setIsDropdownOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredReports.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredReports.length) {
          handleSelect(filteredReports[selectedIndex].id);
        } else if (filteredReports.length > 0) {
          handleSelect(filteredReports[0].id);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        break;
    }
  };

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
          aria-label="Open Navigation"
        >
          <Menu size={20} />
        </button>

        {companyName ? (
          <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
            <h2 className="text-base md:text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight truncate max-w-[120px] md:max-w-none">
              {companyName}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-black text-blue-600 dark:text-blue-400 tracking-widest flex items-center gap-1">
                <Hash size={10} /> {ticker}
              </span>
              <span className="hidden md:inline text-[10px] text-slate-300 dark:text-slate-600 font-bold">•</span>
              <span className="hidden md:inline text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Workspace</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <div className="hidden md:flex w-10 h-10 bg-blue-600 rounded-xl items-center justify-center shadow-lg shadow-blue-500/20">
               <Hash className="text-white" size={20} />
             </div>
             <h2 className="text-base md:text-xl font-black text-slate-900 dark:text-white tracking-tight">Financial Hub</h2>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative hidden lg:block" ref={dropdownRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search Ticker or Company..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            className="bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl pl-12 pr-6 py-2.5 w-[300px] xl:w-[400px] focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold transition-all shadow-sm placeholder:text-slate-400"
          />

          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
              {filteredReports.length > 0 ? (
                <div className="py-2">
                  <div className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 dark:border-slate-700/50 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {searchTerm.trim() === '' ? <Clock size={12} /> : <Search size={12} />}
                      {searchTerm.trim() === '' ? 'Recent Analysis' : 'Search Results'}
                    </span>
                    <span className="text-[9px] font-bold opacity-50">↑↓ to navigate</span>
                  </div>
                  {filteredReports.map((r, idx) => (
                    <button
                      key={r.id}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => handleSelect(r.id)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 transition-all text-left ${
                        selectedIndex === idx 
                          ? 'bg-blue-50 dark:bg-blue-900/40 translate-x-1' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                           selectedIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}>
                          {r.ticker.substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-black transition-colors ${selectedIndex === idx ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                            {r.ticker} — {r.reportPeriod} {r.reportYear}
                          </span>
                          <span className="text-[11px] text-slate-400 font-bold truncate max-w-[200px]">{r.companyName}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={`transition-all ${selectedIndex === idx ? 'text-blue-500 translate-x-1' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-10 text-center flex flex-col items-center gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-300">
                    <Search size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-800 dark:text-white">No data found</p>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed px-4">
                      We couldn't find any reports for "{searchTerm}". Try another ticker or upload a new PDF.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:gap-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button 
            onClick={() => setIsDarkMode(false)}
            className={`p-2 md:p-2.5 rounded-xl transition-all ${!isDarkMode ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-200'}`}
            title="Light Mode"
          >
            <Sun size={18} />
          </button>
          <button 
            onClick={() => setIsDarkMode(true)}
            className={`p-2 md:p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-slate-700 text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            title="Dark Mode"
          >
            <Moon size={18} />
          </button>
        </div>

        <button className="p-2 md:p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all relative group" title="Intelligence Alerts">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
