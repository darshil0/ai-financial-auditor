
import React, { useState, useMemo, useRef } from 'react';
import { FinancialReport } from '../types';
import { 
  ArrowLeftRight, 
  TrendingUp, 
  Minus, 
  Info, 
  Target, 
  Calendar, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  AlertTriangle, 
  AlertCircle, 
  FileText,
  X,
  ShieldAlert,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { toPng } from 'html-to-image';

interface ComparisonViewProps {
  reports: FinancialReport[];
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ reports }) => {
  const [report1Id, setReport1Id] = useState<string>(reports[0]?.id || '');
  const [report2Id, setReport2Id] = useState<string>(reports[1]?.id || '');
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<number>>(new Set());
  const [isExportingPng, setIsExportingPng] = useState(false);
  
  const summaryCardsRef = useRef<HTMLDivElement>(null);

  const report1 = reports.find(r => r.id === report1Id);
  const report2 = reports.find(r => r.id === report2Id);

  const validation = useMemo(() => {
    if (!report1 || !report2) return null;
    const errors: string[] = [];
    const warnings: string[] = [];

    if (report1.ticker !== report2.ticker) {
      warnings.push(`Entity Mismatch: You are comparing ${report1.ticker} (${report1.companyName}) with ${report2.ticker} (${report2.companyName}). Metric variances may not accurately reflect organic performance trends.`);
    }

    const date1 = report1.reportYear * 10 + (parseInt(report1.reportPeriod.replace(/\D/g, '')) || 0);
    const date2 = report2.reportYear * 10 + (parseInt(report2.reportPeriod.replace(/\D/g, '')) || 0);
    
    if (date2 < date1) {
      warnings.push("Reverse Chronology: Your 'Benchmark' period is older than your 'Baseline'. Percentage changes will reflect historical contraction rather than forward growth.");
    }

    const required = ['revenue', 'netIncome', 'eps', 'revenuePrior', 'netIncomePrior', 'epsPrior'];
    required.forEach(m => {
      if (typeof (report1 as any)[m] !== 'number' || typeof (report2 as any)[m] !== 'number') {
        errors.push(`Critical data point missing: ${m.replace(/([A-Z])/g, ' $1').toLowerCase()} is required for accurate variance modeling.`);
      }
    });

    return { errors, warnings, isValid: errors.length === 0 };
  }, [report1, report2]);

  const handleDismissWarning = (index: number) => {
    setDismissedWarnings(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const formatCurrency = (val: number) => {
    const absVal = Math.abs(val);
    let formatted = '';
    if (absVal >= 1000000000) formatted = `$${(absVal / 1000000000).toFixed(2)}B`;
    else if (absVal >= 1000000) formatted = `$${(absVal / 1000000).toFixed(2)}M`;
    else formatted = `$${absVal.toLocaleString()}`;
    return val < 0 ? `-${formatted}` : formatted;
  };

  const handleExportPNG = async () => {
    if (!summaryCardsRef.current || isExportingPng) return;
    
    setIsExportingPng(true);
    try {
      // Small delay to ensure any hover states or transitions are settled
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(summaryCardsRef.current, {
        cacheBust: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc',
        style: {
          padding: '24px',
          borderRadius: '0px'
        }
      });
      
      const link = document.createElement('a');
      link.download = `comparison_summary_${report1?.ticker}_vs_${report2?.ticker}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export PNG', err);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleExportCSV = () => {
    if (!report1 || !report2 || !validation?.isValid) return;

    const revGrowth1 = report1.revenuePrior !== 0 ? ((report1.revenue - report1.revenuePrior) / Math.abs(report1.revenuePrior)) * 100 : 0;
    const revGrowth2 = report2.revenuePrior !== 0 ? ((report2.revenue - report2.revenuePrior) / Math.abs(report2.revenuePrior)) * 100 : 0;

    const rows = [
      ['Analysis Type', 'Comparative Variance Report'],
      ['Export Date', new Date().toLocaleString()],
      ['Entity 1 (Baseline)', `${report1.companyName} (${report1.ticker})`],
      ['Entity 2 (Benchmark)', `${report2.companyName} (${report2.ticker})`],
      [''],
      ['Metric', `Baseline (${report1.reportPeriod} ${report1.reportYear})`, `Benchmark (${report2.reportPeriod} ${report2.reportYear})`, 'Delta (Abs)', 'Delta (%)'],
      ['Total Revenue', report1.revenue, report2.revenue, report2.revenue - report1.revenue, (((report2.revenue - report1.revenue) / Math.abs(report1.revenue)) * 100).toFixed(2) + '%'],
      ['Revenue Growth (YoY) (%)', revGrowth1.toFixed(2), revGrowth2.toFixed(2), (revGrowth2 - revGrowth1).toFixed(2), 'N/A'],
      ['Net Income', report1.netIncome, report2.netIncome, report2.netIncome - report1.netIncome, (((report2.netIncome - report1.netIncome) / Math.abs(report1.netIncome)) * 100).toFixed(2) + '%'],
      ['EPS (Diluted)', report1.eps, report2.eps, (report2.eps - report1.eps).toFixed(2), (((report2.eps - report1.eps) / Math.abs(report1.eps)) * 100).toFixed(2) + '%'],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `variance_analysis_${report2.ticker}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const MetricRow = ({ label, v1, v2, format = 'currency', invert = false }: any) => {
    const delta = v2 - v1;
    const pctChange = Math.abs(v1) > 0 ? (delta / Math.abs(v1)) * 100 : 0;
    
    const displayV1 = format === 'currency' ? formatCurrency(v1) : `${v1.toFixed(2)}${format === 'percent' ? '%' : ''}`;
    const displayV2 = format === 'currency' ? formatCurrency(v2) : `${v2.toFixed(2)}${format === 'percent' ? '%' : ''}`;
    
    const isPositive = delta > 0;
    const isNeutral = Math.abs(delta) < 0.001;
    const isGood = invert ? !isPositive : isPositive;

    const displayDelta = format === 'currency' 
      ? formatCurrency(delta) 
      : `${Math.abs(delta).toFixed(2)}${format === 'percent' ? '%' : ''}`;

    const colorClasses = isNeutral 
      ? 'text-slate-500 bg-slate-100 dark:bg-slate-800' 
      : isGood 
        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' 
        : 'text-rose-700 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400';

    return (
      <div className="grid grid-cols-4 py-4 border-b border-slate-100 dark:border-slate-800 items-center transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-4 -mx-4 rounded-lg">
        <div className="text-slate-600 dark:text-slate-400 font-semibold text-xs md:text-sm">{label}</div>
        <div className="text-right font-medium text-slate-700 dark:text-slate-300 text-xs md:text-sm">{displayV1}</div>
        <div className="text-right font-bold text-slate-900 dark:text-white text-xs md:text-sm">{displayV2}</div>
        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] md:text-xs shadow-sm ${colorClasses}`}>
            {!isNeutral && (isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />)}
            {isNeutral && <Minus size={14} />}
            <span>{isNeutral ? 'Flat' : displayDelta}</span>
          </div>
          {!isNeutral && format !== 'percent' && (
             <span className={`text-[10px] font-bold mt-1 ${isGood ? 'text-emerald-600/70' : 'text-rose-600/70'}`}>
               {isPositive ? '+' : ''}{pctChange.toFixed(1)}%
             </span>
          )}
        </div>
      </div>
    );
  };

  if (reports.length < 2) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-6">
          <ArrowLeftRight size={64} className="text-slate-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Comparison Hub Locked</h3>
        <p className="text-slate-500 max-w-sm">
          Please upload at least two reports to unlock side-by-side variance analysis and YoY benchmarking.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Comparative Intelligence</h2>
          <p className="text-slate-500 font-medium">Quantifying variances and growth velocity across periods.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportPNG}
            disabled={!validation?.isValid || isExportingPng}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50 active:scale-95"
          >
            {isExportingPng ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
            Export Summary PNG
          </button>
          <button 
            onClick={handleExportCSV} 
            disabled={!validation?.isValid}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95"
          >
            <Download size={18} /> Export Delta CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-blue-500" />
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Baseline Selection</label>
          </div>
          <select 
            value={report1Id} 
            onChange={(e) => { setReport1Id(e.target.value); setDismissedWarnings(new Set()); }}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            {reports.map(r => <option key={r.id} value={r.id}>{r.ticker} — {r.reportPeriod} {r.reportYear}</option>)}
          </select>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-emerald-500" />
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Benchmark Target</label>
          </div>
          <select 
            value={report2Id} 
            onChange={(e) => { setReport2Id(e.target.value); setDismissedWarnings(new Set()); }}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500"
          >
            {reports.map(r => <option key={r.id} value={r.id}>{r.ticker} — {r.reportPeriod} {r.reportYear}</option>)}
          </select>
        </div>
      </div>

      {/* Prominent Validation Alerts */}
      {validation && (validation.errors.length > 0 || (validation.warnings.length > dismissedWarnings.size)) && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
          {validation.errors.map((error, i) => (
            <div key={`err-${i}`} className="flex items-start gap-4 p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-rose-700 dark:text-rose-400 shadow-sm">
              <div className="bg-rose-100 dark:bg-rose-900/40 p-2 rounded-xl text-rose-600 dark:text-rose-500">
                <ShieldAlert size={20} />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-sm uppercase tracking-wider mb-1">Critical Error</h5>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
            </div>
          ))}

          {validation.warnings.map((warning, i) => {
            if (dismissedWarnings.has(i)) return null;
            return (
              <div key={`warn-${i}`} className="flex items-start gap-4 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-amber-800 dark:text-amber-400 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-xl text-amber-600 dark:text-amber-500">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1 pr-8">
                  <h5 className="font-bold text-sm uppercase tracking-wider mb-1">Comparability Warning</h5>
                  <p className="text-sm font-medium leading-relaxed">{warning}</p>
                </div>
                <button 
                  onClick={() => handleDismissWarning(i)}
                  className="p-2 text-amber-400 hover:text-amber-600 dark:hover:text-amber-200 transition-colors rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  aria-label="Dismiss warning"
                >
                  <X size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {report1 && report2 && validation?.isValid && (
        <>
          {/* Summary Cards Ref added here for PNG export */}
          <div ref={summaryCardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 border-l-8 border-l-blue-500 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-2xl text-slate-900 dark:text-white leading-tight">{report1.companyName}</h4>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mt-2">BASELINE: {report1.reportPeriod} {report1.reportYear}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <FileText size={24} />
                </div>
              </div>
              <div className="grid grid-cols-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 gap-8">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">Revenue</p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">{formatCurrency(report1.revenue)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">Net Inc.</p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">{formatCurrency(report1.netIncome)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">EPS</p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">${report1.eps.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 border-l-8 border-l-emerald-500 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-2xl text-slate-900 dark:text-white leading-tight">{report2.companyName}</h4>
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mt-2">BENCHMARK: {report2.reportPeriod} {report2.reportYear}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <Target size={24} />
                </div>
              </div>
              <div className="grid grid-cols-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 gap-8">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">Revenue</p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">{formatCurrency(report2.revenue)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">Net Inc.</p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">{formatCurrency(report2.netIncome)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">EPS</p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">${report2.eps.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="grid grid-cols-4 bg-slate-50/80 dark:bg-slate-900/80 p-8 border-b border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">KPI Metric</div>
              <div className="text-right text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Baseline</div>
              <div className="text-right text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Benchmark</div>
              <div className="text-right text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Delta Analysis</div>
            </div>
            <div className="p-10 space-y-2">
              <MetricRow label="Total Revenue" v1={report1.revenue} v2={report2.revenue} />
              <MetricRow label="Revenue Growth (YoY)" 
                v1={report1.revenuePrior > 0 ? ((report1.revenue - report1.revenuePrior) / report1.revenuePrior) * 100 : 0} 
                v2={report2.revenuePrior > 0 ? ((report2.revenue - report2.revenuePrior) / report2.revenuePrior) * 100 : 0} 
                format="percent" 
              />
              <MetricRow label="Net Income" v1={report1.netIncome} v2={report2.netIncome} />
              <MetricRow label="EPS (Diluted)" v1={report1.eps} v2={report2.eps} format="raw" />
              <MetricRow label="Gross Margin" v1={report1.grossMargin} v2={report2.grossMargin} format="percent" />
              <MetricRow label="Operating Margin" v1={report1.operatingMargin} v2={report2.operatingMargin} format="percent" />
              <MetricRow label="Net Margin" v1={report1.netMargin} v2={report2.netMargin} format="percent" />
            </div>
          </div>
        </>
      )}

      {validation && !validation.isValid && (
        <div className="bg-white dark:bg-slate-800 p-24 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
          <div className="bg-rose-50 dark:bg-rose-900/30 p-8 rounded-full mb-8 text-rose-500">
            <ShieldAlert size={64} strokeWidth={1.5} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Incomplete Analysis Data</h3>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            The selected financial models are missing key comparative metrics. Please ensure both reports contain standard GAAP figures (Revenue, Net Income, EPS) for accurate benchmarking.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
