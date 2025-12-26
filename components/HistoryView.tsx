
import React, { useState } from 'react';
import { FinancialReport } from '../types';
import { Search, Filter, Trash2, Calendar, FileText, ChevronRight, BookOpen } from 'lucide-react';
import { formatCurrency } from '../utils';

interface HistoryViewProps {
  reports: FinancialReport[];
  setActiveReportId: (id: string) => void;
  deleteReport: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ reports, setActiveReportId, deleteReport }) => {
  const [search, setSearch] = useState('');

  const filtered = reports.filter(r => 
    r.companyName.toLowerCase().includes(search.toLowerCase()) || 
    r.ticker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Analysis Vault</h2>
          <p className="text-slate-500 font-medium">Archived and active reporting period database.</p>
        </div>
        <div className="relative w-full md:w-96 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by ticker or company name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-6 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 dark:text-white transition-all"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/40 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Company Intelligence</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Period</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Revenue</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Analysis Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr 
                    key={r.id} 
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-all group cursor-pointer" 
                    onClick={() => setActiveReportId(r.id)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
                          {r.ticker[0]}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{r.companyName}</div>
                          <div className="text-xs text-slate-400 font-black uppercase tracking-widest">{r.ticker}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {r.reportPeriod} {r.reportYear}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 dark:text-slate-100">
                      {formatCurrency(r.revenue)}
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-400 font-medium">
                      {new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteReport(r.id); }}
                          className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all active:scale-90"
                          title="Delete Report"
                        >
                          <Trash2 size={20} />
                        </button>
                        <button className="p-3 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-xl transition-all">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                       <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-full mb-6">
                         <BookOpen size={48} className="text-slate-300" />
                       </div>
                       <h4 className="text-xl font-bold text-slate-400 mb-2">No Records Detected</h4>
                       <p className="text-slate-500 max-w-xs mx-auto">
                         {search ? `Your query "${search}" returned zero matches in the vault.` : 'Archive empty. Reports will appear here after initial analysis.'}
                       </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
