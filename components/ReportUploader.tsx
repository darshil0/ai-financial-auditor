
import React, { useState } from 'react';
import { FileUp, Loader2, CheckCircle2, AlertCircle, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { analyzeEarningsReport } from '../geminiService';
import { FinancialReport } from '../types';

interface ReportUploaderProps {
  onReportAdded: (report: FinancialReport) => void;
}

const ReportUploader: React.FC<ReportUploaderProps> = ({ onReportAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus('Reading file and preparing for analysis...');

    try {
      setStatus('Gemini 3 Pro is conducting a deep-dive analysis...');
      const report = await analyzeEarningsReport(file);
      onReportAdded(report);
    } catch (err: any) {
      console.error(err);
      setError('Analysis failed. The PDF might be encrypted or formatted incorrectly for automated extraction.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-800/50">
          <Sparkles size={12} />
          AI Extraction Engine v3.1
        </div>
        <h2 className="text-5xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white">Analyze Corporate Earnings</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Upload official earnings releases, 10-Qs, or 10-Ks. Our intelligence platform extracts GAAP/non-GAAP metrics and management sentiment in seconds.
        </p>
      </div>

      <div className={`relative group border-2 border-dashed rounded-[3rem] p-16 text-center transition-all duration-500 overflow-hidden ${
        loading 
          ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' 
          : 'border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-white dark:hover:bg-slate-900 shadow-2xl shadow-blue-500/0 hover:shadow-blue-500/5'
      }`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
           {loading && <div className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite]" style={{width: '30%'}}></div>}
        </div>

        {loading ? (
          <div className="space-y-10 animate-in zoom-in-95 duration-300">
            <div className="relative mx-auto w-24 h-24">
               <div className="absolute inset-0 bg-blue-600 rounded-3xl animate-ping opacity-20"></div>
               <div className="relative bg-blue-600 rounded-3xl w-full h-full flex items-center justify-center text-white shadow-xl">
                 <Loader2 size={40} className="animate-spin" />
               </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">Parsing Intelligence</h4>
              <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">{status}</p>
            </div>
          </div>
        ) : (
          <>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-10 relative">
              <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/40">
                <FileUp size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Drop Report PDF</h4>
                <p className="text-slate-500 font-medium">10-Q, 10-K, or Press Release formats supported</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black shadow-xl transition-all group-hover:bg-blue-600 group-hover:text-white flex items-center gap-2">
                  Browse Files <ArrowRight size={18} />
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-slate-400">Max size: 25MB</span>
              </div>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-8 p-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 rounded-3xl flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: FileText, title: "GAAP Precision", desc: "Automated extraction of balance sheet and income statement items." },
          { icon: Sparkles, title: "Linguistic Analysis", desc: "Deciphers management tone and guidance confidence." },
          { icon: CheckCircle2, title: "Instant Comparison", desc: "Automatically maps results to historical reporting periods." }
        ].map((feat, i) => (
          <div key={i} className="space-y-4 animate-in fade-in duration-1000" style={{ animationDelay: `${i * 200}ms` }}>
            <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
              <feat.icon size={22} />
            </div>
            <h5 className="font-black text-slate-900 dark:text-white">{feat.title}</h5>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportUploader;
