
import React, { useState } from 'react';
import { FinancialReport } from '../types';
import SummaryCards from './SummaryCards';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { FileQuestion, Globe, Download, Loader2, Newspaper, ArrowRight, Printer } from 'lucide-react';
import { getMarketContext } from '../geminiService';

interface DashboardProps {
  report: FinancialReport | null;
  onSwitchToUpload: () => void;
  onUpdateReport?: (report: FinancialReport) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ report, onSwitchToUpload, onUpdateReport }) => {
  const [isFetchingContext, setIsFetchingContext] = useState(false);

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-6">
          <FileQuestion size={48} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No Report Selected</h3>
        <p className="text-slate-500 max-w-md mb-8">
          Upload an earnings report PDF or select one from your history to see the analysis.
        </p>
        <button 
          onClick={onSwitchToUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          Analyze First Report
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

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-emerald-500 bg-emerald-500';
    if (score <= 30) return 'text-rose-500 bg-rose-500';
    return 'text-amber-500 bg-amber-500';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 80) return 'Extremely Bullish';
    if (score >= 60) return 'Bullish';
    if (score >= 40) return 'Neutral';
    if (score >= 20) return 'Bearish';
    return 'Extremely Bearish';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 print:bg-white print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold">{report.reportPeriod} {report.reportYear} Results</h1>
          <p className="text-slate-500">Reported on {new Date(report.timestamp).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer size={16} /> Print Report
          </button>
          <button 
            onClick={handleFetchMarketContext}
            disabled={isFetchingContext}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {isFetchingContext ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
            Market Context
          </button>
        </div>
      </div>

      <SummaryCards report={report} />

      {/* Market Context Section */}
      {report.marketContext && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-8 animate-in slide-in-from-top-4 duration-500 print:border print:bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Newspaper size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Real-Time Market Context</h3>
              <p className="text-xs text-slate-500">Provided by Gemini Search Grounding • Last updated {new Date(report.marketContext.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {report.marketContext.summary}
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Reference Sources</h4>
              <div className="flex flex-col gap-2">
                {report.marketContext.insights.map((insight, idx) => (
                  <a 
                    key={idx} 
                    href={insight.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-400 transition-all group"
                  >
                    <span className="text-sm font-medium truncate max-w-[200px]">{insight.title}</span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Gauge */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold mb-8 w-full text-left">Management Narrative Sentiment</h3>
          <div className="relative w-48 h-24 mb-4 overflow-hidden">
             {/* Semi-circle Gauge */}
             <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-slate-100 dark:border-slate-700"></div>
             <div 
               className={`absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-current transition-all duration-1000 ${getSentimentColor(report.sentimentScore).split(' ')[0]}`}
               style={{ 
                 clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 50%)',
                 transform: `rotate(${((report.sentimentScore / 100) * 180) - 90}deg)`
               }}
             ></div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-3xl font-black">{report.sentimentScore}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Score</span>
             </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest ${getSentimentColor(report.sentimentScore).split(' ')[1]} text-white`}>
            {getSentimentLabel(report.sentimentScore)}
          </div>
          <p className="mt-4 text-sm text-slate-500 italic max-w-xs">
            Reflects the quantitative tone extracted from management's quarterly letter and commentary.
          </p>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Expense Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.expenses}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="amount"
                  nameKey="category"
                  label={(entry) => entry.category}
                >
                  {report.expenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Comparison */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Revenue Comparison (YoY)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quarterly Trends */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.trends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
