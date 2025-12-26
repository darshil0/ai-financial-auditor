
import React, { useState } from 'react';
import { FileUp, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
      setStatus('AI is analyzing the earnings report... this may take a moment.');
      const report = await analyzeEarningsReport(file);
      onReportAdded(report);
    } catch (err: any) {
      console.error(err);
      setError('Failed to analyze the report. Ensure it is a valid earnings release and try again.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Analyze Earnings Report</h2>
        <p className="text-slate-500">
          Upload any company's official earnings PDF (press release, 10-Q, or 10-K).
          Our AI will extract financials, trends, and key management takeaways.
        </p>
      </div>

      <div className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
        loading 
          ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' 
          : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}>
        {loading ? (
          <div className="space-y-6">
            <Loader2 className="mx-auto text-blue-600 animate-spin" size={48} />
            <div className="space-y-2">
              <h4 className="text-xl font-semibold">Processing Data...</h4>
              <p className="text-slate-500 animate-pulse">{status}</p>
            </div>
            <div className="w-full max-w-xs mx-auto bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
            </div>
          </div>
        ) : (
          <>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                <FileUp size={36} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Select Earnings PDF</h4>
                <p className="text-slate-500">Click to browse or drag and drop files here</p>
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
                Choose File
              </button>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: CheckCircle2, title: "Structured Data", desc: "Turns messy PDFs into clean financial schemas." },
          { icon: CheckCircle2, title: "Trend Analysis", desc: "Automatically maps historical performance." },
          { icon: CheckCircle2, title: "Insight Extraction", desc: "Highlights management tone and key risks." }
        ].map((feat, i) => (
          <div key={i} className="text-center space-y-2">
            <feat.icon className="mx-auto text-emerald-500" size={24} />
            <h5 className="font-bold">{feat.title}</h5>
            <p className="text-xs text-slate-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportUploader;
