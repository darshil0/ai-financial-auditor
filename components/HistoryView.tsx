
import React, { useState } from 'react';
import { FinancialReport } from '../types';
import { Search, Filter, Trash2, Calendar, FileText, ChevronRight } from 'lucide-react';

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

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Report Library</h2>
          <p className="text-slate-500">Manage and browse your analyzed financial reports.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search company or ticker..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Company</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Period</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Revenue</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date Added</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.length > 0 ? (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => setActiveReportId(r.id)}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold">
                        {r.ticker[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white">{r.companyName}</div>
                        <div className="text-xs text-slate-400 font-medium">{r.ticker}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                      {r.reportPeriod} {r.reportYear}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(r.revenue)}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400">
                    {new Date(r.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteReport(r.id); }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 group-hover:text-blue-500 rounded-lg transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                  {search ? 'No reports matching your search.' : 'No reports found. Upload your first earnings report to begin.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryView;
