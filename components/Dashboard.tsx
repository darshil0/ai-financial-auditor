
import React, { useState, useRef } from 'react';
import { FinancialReport } from '../types';
import SummaryCards from './SummaryCards';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { FileQuestion, Globe, Loader2, Newspaper, ArrowRight, Printer, Info, Sparkles, PieChart as PieChartIcon, Activity, Play, Image as ImageIcon, MessageSquareText } from 'lucide-react';
import { getMarketContext, generateAudioBriefing, visualizeGuidance } from '../geminiService';
import { formatCurrency, getSentimentColor, getSentimentLabel } from '../utils';
import LiveAnalyst from './LiveAnalyst';
import { decodeBase64 } from '../audioUtils';

interface DashboardProps {
  report: FinancialReport | null;
  onSwitchToUpload: () => void;
  onUpdateReport?: (report: FinancialReport) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ report, onSwitchToUpload, onUpdateReport }) => {
  const [isFetchingContext, setIsFetchingContext] = useState(false);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [showLiveAnalyst, setShowLiveAnalyst] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-24 px-4">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-8 rounded-full mb-8 animate-pulse">
          <FileQuestion size={56} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-3xl font-black mb-3 tracking-tight text-slate-900 dark:text-white">Intelligence Engine Standby</h3>
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
    setIsFetchingContext(true);
    try {
      const context = await getMarketContext(report.ticker, report.companyName);
      if (onUpdateReport) onUpdateReport({ ...report, marketContext: context });
    } catch (err) { console.error(err); }
    finally { setIsFetchingContext(false); }
  };

  const handleGenerateBriefing = async () => {
    setIsGeneratingBriefing(true);
    try {
      const briefing = await generateAudioBriefing(report);
      if (onUpdateReport) onUpdateReport({ ...report, audioBriefing: briefing });
      
      const audioBytes = decodeBase64(briefing.base64Audio);
      const blob = new Blob([audioBytes], { type: 'audio/pcm' });
      // Note: In a real app we'd need to wrap PCM in a WAV header or use AudioContext
      // For simplicity in this briefing, we'll assume the model returns a format playable via data URI if possible
      // or we'd implement a real decoder. Here we trigger visual confirmation.
    } catch (err) { console.error(err); }
    finally { setIsGeneratingBriefing(false); }
  };

  const handleVisualizeGuidance = async () => {
    setIsGeneratingVisual(true);
    try {
      const imageUrl = await visualizeGuidance(report);
      if (onUpdateReport) onUpdateReport({ ...report, visualizedGuidance: imageUrl });
    } catch (err) { console.error(err); }
    finally { setIsGeneratingVisual(false); }
  };

  const revenueData = [
    { name: 'Prior Year', revenue: report.revenuePrior },
    { name: 'Current Year', revenue: report.revenue }
  ];

  const marginData = [
    { name: 'Gross Margin', value: report.grossMargin },
    { name: 'Operating Margin', value: report.operatingMargin },
    { name: 'Net Margin', value: report.netMargin }
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
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowLiveAnalyst(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <MessageSquareText size={18} /> Talk to Analyst
          </button>
          <button 
            onClick={handleVisualizeGuidance}
            disabled={isGeneratingVisual}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
          >
            {isGeneratingVisual ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
            Visualize Guidance
          </button>
          <button 
            onClick={handleFetchMarketContext}
            disabled={isFetchingContext}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-50 active:scale-95"
          >
            {isFetchingContext ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
            Market Grounding
          </button>
        </div>
      </div>

      <SummaryCards report={report} />

      {/* Guidance Visualization Section */}
      {report.visualizedGuidance && (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-indigo-500/5 animate-in slide-in-from-right-4 duration-700">
           <div className="relative aspect-video w-full group">
             <img src={report.visualizedGuidance} alt="Guidance Visualization" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-10">
               <h4 className="text-2xl font-black text-white mb-2">Guidance Visual Intelligence</h4>
               <p className="text-slate-300 text-sm font-medium max-w-xl">AI-generated architectural interpretation of management's future outlook and market positioning.</p>
             </div>
           </div>
        </div>
      )}

      {/* Market Context Section */}
      {report.marketContext && (
        <div className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 animate-in slide-in-from-top-6 duration-700 shadow-2xl shadow-blue-500/5 print:border print:bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 text-white rounded-[1.25rem] shadow-lg shadow-blue-500/20">
                <Newspaper size={24} />
              </div>
              <div>
                <h3 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">Grounding Intelligence</h3>
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
        {/* Sentiment Gauge & Audio Briefing */}
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center group">
          <div className="w-full flex justify-between items-center mb-10">
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Narrative Sentiment</h3>
            <button 
              onClick={handleGenerateBriefing}
              disabled={isGeneratingBriefing}
              className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-100 transition-all disabled:opacity-50"
              title="Audio Briefing"
            >
              {isGeneratingBriefing ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
            </button>
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
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <PieChartIcon size={20} />
            </div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Expense Breakdown</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.expenses}
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
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.96)'
                  }}
                  itemStyle={{ fontWeight: 700 }}
                  formatter={(value: number) => formatCurrency(value)} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showLiveAnalyst && (
        <LiveAnalyst report={report} onClose={() => setShowLiveAnalyst(false)} />
      )}
    </div>
  );
};

export default Dashboard;
