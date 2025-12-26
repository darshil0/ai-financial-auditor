
import React, { useState } from 'react';
import { FinancialReport } from '../types';
import SummaryCards from './SummaryCards';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { FileQuestion, Globe, Loader2, Newspaper, ArrowRight, Printer, Info, Sparkles } from 'lucide-react';
import { getMarketContext } from '../geminiService';
import { formatCurrency, getSentimentColor, getSentimentLabel } from '../utils';

interface DashboardProps {
  report: FinancialReport | null;
  onSwitchToUpload: () => void;
  onUpdateReport?: (report: FinancialReport) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ report, onSwitchToUpload, onUpdateReport }) => {
  const [isFetchingContext, setIsFetchingContext] = useState(false);

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-24 px-4">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-8 rounded-full mb-8 animate-pulse">
          <FileQuestion size={56} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-3xl font-black mb-3 tracking-tight">Intelligence Engine Standby</h3>
        <p className="text-slate-500 max-w-md mb-10 text-lg">
          No active analysis detected. Upload an earnings report to initialize the dashboard.
        </p>
        <button 
          onClick={onSwitchToUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          <Sparkles size={20} />
          Launch New Analysis
        </button>
      </div>
    );
  }

  const handleFetchMarketContext = async () => {
    if (!report) return;
    setIsFetchingContext(true);
    try {
      const context = await getMarketContext(report.ticker, report.companyName);
      if (onUpdateReport) {
        onUpdateReport({ ...report, marketContext: context });
      }
    } catch (err) {
      console.error("Failed to fetch market context", err);
    } finally {
      setIsFetchingContext(false);
    }
  };

  const revenueData = [
    { name: 'Prior Year', revenue: report.revenuePrior },
    { name: 'Current Year', revenue: report.revenue }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const sentimentTheme = getSentimentColor(report.sentimentScore);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 print:bg-white print:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
               {report.reportPeriod} {report.reportYear} Results
             </h1>
             <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-black uppercase tracking-widest">
               Verified Analysis
             </span>
          </div>
          <p className="text-slate-500 font-medium">Data finalized on {new Date(report.timestamp).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => window.print()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <Printer size={18} /> Print PDF
          </button>
          <button 
            onClick={handleFetchMarketContext}
            disabled={isFetchingContext}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-50 active:scale-95"
          >
            {isFetchingContext ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
            Market Grounding
          </button>
        </div>
      </div>

      <SummaryCards report={report} />

      {/* Market Context Section */}
      {report.marketContext && (
        <div className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 animate-in slide-in-from-top-6 duration-700 shadow-2xl shadow-blue-500/5 print:border print:bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 text-white rounded-[1.25rem] shadow-lg shadow-blue-500/20">
                <Newspaper size={24} />
              </div>
              <div>
                <h3 className="font-black text-2xl tracking-tight">Grounding Intelligence</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Gemini Search Integration • Updated {new Date(report.marketContext.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-500/20 rounded-full"></div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium whitespace-pre-wrap pl-2">
                  {report.marketContext.summary}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contextual Sources</h4>
              <div className="flex flex-col gap-3">
                {report.marketContext.insights.map((insight, idx) => (
                  <a 
                    key={idx} 
                    href={insight.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-all group shadow-sm"
                  >
                    <span className="text-sm font-bold truncate max-w-[220px] text-slate-700 dark:text-slate-300">{insight.title}</span>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Gauge */}
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center group">
          <div className="w-full flex justify-between items-center mb-10">
            <h3 className="text-xl font-black tracking-tight">Narrative Sentiment</h3>
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400">
               <Info size={18} />
            </div>
          </div>
          <div className="relative w-64 h-32 mb-6 overflow-hidden">
             <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[16px] border-slate-100 dark:border-slate-900"></div>
             <div 
               className={`absolute top-0 left-0 w-64 h-64 rounded-full border-[16px] border-current transition-all duration-[1500ms] ease-out ${sentimentTheme.text}`}
               style={{ 
                 clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 50%)',
                 transform: `rotate(${((report.sentimentScore / 100) * 180) - 90}deg)`
               }}
             ></div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-5xl font-black text-slate-900 dark:text-white">{report.sentimentScore}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">AI Confidence Score</span>
             </div>
          </div>
          <div className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest ${sentimentTheme.bg} text-white shadow-lg shadow-current/20 mb-6`}>
            {getSentimentLabel(report.sentimentScore)}
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
            Quantitative analysis of management tone, linguistic confidence, and forward-looking variance statements.
          </p>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-black mb-8 tracking-tight">Resource Allocation</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.expenses as any[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={8}
                  dataKey="amount"
                  nameKey="category"
                  stroke="none"
                >
                  {report.expenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  formatter={(value: number) => formatCurrency(value)} 
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Comparison */}
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-black mb-8 tracking-tight">YoY Revenue Variance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData as any[]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={formatCurrency} tick={{ fontSize: 10, fontWeight: 500 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatCurrency(value)} 
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[12, 12, 0, 0]} barSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quarterly Trends */}
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-black mb-8 tracking-tight">Growth Trajectory</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.trends as any[]}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={formatCurrency} tick={{ fontSize: 10, fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => formatCurrency(value)} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
