import React, { useState, useRef, useEffect } from "react";
import { FinancialReport } from "../types";
import SummaryCards from "./SummaryCards";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  Globe,
  Loader2,
  Newspaper,
  ArrowRight,
  PieChart as PieChartIcon,
  Play,
  StopCircle,
  Image as ImageIcon,
  MessageSquareText,
} from "lucide-react";
import {
  getMarketContext,
  generateAudioBriefing,
  visualizeGuidance,
} from "../geminiService";
import { formatCurrency, getSentimentColor, getSentimentLabel } from "../utils";
import LiveAnalyst from "./LiveAnalyst";
import { decodeBase64, createWaveBlob } from "../audioUtils";
import DashboardSkeleton, { NoReportState } from "./DashboardSkeleton";
import { toast } from "sonner";

interface DashboardProps {
  report: FinancialReport | null;
  onSwitchToUpload: () => void;
  onUpdateReport?: (report: FinancialReport) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  report,
  onSwitchToUpload,
  onUpdateReport,
}) => {
  const [isFetchingContext, setIsFetchingContext] = useState(false);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [showLiveAnalyst, setShowLiveAnalyst] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsLoading(true);
    if (report) {
      const timer = setTimeout(() => setIsLoading(false), 750);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [report]);

  if (isLoading) return <DashboardSkeleton />;
  if (!report) return <NoReportState onSwitchToUpload={onSwitchToUpload} />;

  const handleFetchMarketContext = async () => {
    setIsFetchingContext(true);
    const promise = getMarketContext(report.ticker, report.companyName)
      .then((context) => {
        if (onUpdateReport)
          onUpdateReport({ ...report, marketContext: context });
      })
      .finally(() => setIsFetchingContext(false));

    toast.promise(promise, {
      loading: "Fetching market context...",
      success: "Market context updated.",
      error: "Failed to fetch market context.",
    });
  };

  const handleGenerateBriefing = async () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
      return;
    }

    setIsGeneratingBriefing(true);

    const promise = (async () => {
      let audioData = report.audioBriefing?.base64Audio;
      if (!audioData) {
        const briefing = await generateAudioBriefing(report);
        if (onUpdateReport)
          onUpdateReport({ ...report, audioBriefing: briefing });
        audioData = briefing.base64Audio;
      }

      const audioBytes = decodeBase64(audioData);
      const blob = createWaveBlob(audioBytes);
      const url = URL.createObjectURL(blob);

      if (audioRef.current) audioRef.current.pause();

      const audio = new Audio(url);
      audioRef.current = audio;

      await audio.play();
      setIsPlayingAudio(true);

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(url);
      };
    })().finally(() => setIsGeneratingBriefing(false));

    toast.promise(promise, {
      loading: "Generating audio briefing...",
      success: "Audio briefing is playing.",
      error: "Failed to generate audio briefing.",
    });
  };

  const handleVisualizeGuidance = async () => {
    setIsGeneratingVisual(true);
    const promise = visualizeGuidance(report)
      .then((imageUrl) => {
        if (onUpdateReport)
          onUpdateReport({ ...report, visualizedGuidance: imageUrl });
      })
      .finally(() => setIsGeneratingVisual(false));

    toast.promise(promise, {
      loading: "Generating visual guidance...",
      success: "Guidance visualization created.",
      error: "Failed to create visualization.",
    });
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const sentimentTheme = getSentimentColor(report.sentimentScore);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {report.reportPeriod} {report.reportYear} Results
            </h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-black uppercase tracking-widest">
              Verified Analysis
            </span>
          </div>
          <p className="text-slate-500 font-medium">
            Data finalized on {new Date(report.timestamp).toLocaleDateString()}
          </p>
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
            {isGeneratingVisual ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ImageIcon size={18} />
            )}
            Visualize Guidance
          </button>
          <button
            onClick={handleFetchMarketContext}
            disabled={isFetchingContext}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-50 active:scale-95"
          >
            {isFetchingContext ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Globe size={18} />
            )}
            Market Grounding
          </button>
        </div>
      </div>

      <SummaryCards report={report} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {report.visualizedGuidance && (
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-indigo-500/5">
              <div className="relative aspect-video w-full group">
                <img
                  src={report.visualizedGuidance}
                  alt="Guidance Visualization"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-10">
                  <h4 className="text-2xl font-black text-white mb-2">
                    Guidance Visual Intelligence
                  </h4>
                  <p className="text-slate-300 text-sm font-medium max-w-xl">
                    AI-generated architectural interpretation of management's
                    future outlook and market positioning.
                  </p>
                </div>
              </div>
            </div>
          )}

          {report.marketContext && (
            <div className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-500/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-600 text-white rounded-[1.25rem] shadow-lg shadow-blue-500/20">
                  <Newspaper size={24} />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">
                    Grounding Intelligence
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Gemini Search Integration
                  </p>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium whitespace-pre-wrap mb-8">
                {report.marketContext.summary}
              </p>
              <div className="flex flex-col gap-3">
                {report.marketContext.insights.map((insight, idx) => (
                  <a
                    key={idx}
                    href={insight.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-all group shadow-sm"
                  >
                    <span className="text-sm font-bold truncate max-w-full text-slate-700 dark:text-slate-300">
                      {insight.title}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white self-start mb-6">
              Narrative Sentiment
            </h3>
            <div className="relative w-64 h-32 mb-6">
              <div
                className="absolute top-0 left-0 w-64 h-64 rounded-full border-[16px] border-slate-100 dark:border-slate-900"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)",
                }}
              />
              <div
                className={`absolute top-0 left-0 w-64 h-64 rounded-full border-[16px] border-current transition-all duration-[1500ms] ease-out ${sentimentTheme.text}`}
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)",
                  transform: `rotate(${(report.sentimentScore / 100) * 180}deg)`,
                  transformOrigin: "50% 100%",
                }}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-5xl font-black text-slate-900 dark:text-white">
                  {report.sentimentScore}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                  AI Confidence
                </span>
              </div>
            </div>
            <div
              className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest ${sentimentTheme.bg} text-white shadow-lg shadow-current/20 mb-6`}
            >
              {getSentimentLabel(report.sentimentScore)}
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mb-6">
              Quantitative analysis of management tone and forward-looking
              statements.
            </p>
            <button
              onClick={handleGenerateBriefing}
              disabled={isGeneratingBriefing}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl text-sm font-bold hover:bg-blue-100 transition-all disabled:opacity-50"
            >
              {isGeneratingBriefing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isPlayingAudio ? (
                <StopCircle size={18} />
              ) : (
                <Play size={18} />
              )}
              <span>
                {isGeneratingBriefing
                  ? "Generating..."
                  : isPlayingAudio
                  ? "Stop Briefing"
                  : "Play Audio Briefing"}
              </span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <PieChartIcon size={20} />
              </div>
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Expense Breakdown
              </h3>
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
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.96)",
                    }}
                    itemStyle={{ fontWeight: 700 }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {showLiveAnalyst && (
        <LiveAnalyst
          report={report}
          onClose={() => setShowLiveAnalyst(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
