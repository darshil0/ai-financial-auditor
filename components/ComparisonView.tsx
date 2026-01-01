import React, { useState, useMemo, useRef } from "react";
import { FinancialReport } from "../types";
import {
  ArrowLeftRight,
  Minus,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  AlertTriangle,
  FileText,
  X,
  ShieldAlert,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Filter,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { toPng } from "html-to-image";
import { formatCurrency, calculateGrowth } from "../utils";
import { useAppStore } from "../store";

interface ComparisonViewProps {
  reports: FinancialReport[];
  report1Id?: string;
  report2Id?: string;
}

interface MetricRowProps {
  label: string;
  v1: number;
  v2: number;
  format?: "currency" | "percent" | "raw";
  invert?: boolean;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  reports,
  report1Id: report1IdProp,
  report2Id: report2IdProp,
}) => {
  const [report1Id, setReport1Id] = useState<string>(
    report1IdProp || reports[0]?.id || "",
  );
  const [report2Id, setReport2Id] = useState<string>(
    report2IdProp || reports[1]?.id || "",
  );
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<number>>(
    new Set(),
  );
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const summaryCardsRef = useRef<HTMLDivElement>(null);

  // Derive unique report types for filtering
  const reportTypes = useMemo(() => {
    const types = new Set<string>();
    reports.forEach((r) => {
      if (r.reportType) types.add(r.reportType);
    });
    return ["All Types", ...Array.from(types).sort()];
  }, [reports]);

  // Filter reports based on the selected document type
  const filteredReports = useMemo(() => {
    if (typeFilter === "All Types") return reports;
    return reports.filter((r) => r.reportType === typeFilter);
  }, [reports, typeFilter]);

  const report1 = reports.find((r) => r.id === report1Id);
  const report2 = reports.find((r) => r.id === report2Id);

  const validation = useMemo(() => {
    if (!report1 || !report2) return null;
    const errors: string[] = [];
    const warnings: string[] = [];

    if (report1.ticker !== report2.ticker) {
      warnings.push(
        `Entity Mismatch: You are comparing ${report1.ticker} (${report1.companyName}) with ${report2.ticker} (${report2.companyName}). Metric variances may not accurately reflect organic performance trends.`,
      );
    }

    const date1 =
      report1.reportYear * 10 +
      (parseInt(report1.reportPeriod.replace(/\D/g, "")) || 0);
    const date2 =
      report2.reportYear * 10 +
      (parseInt(report2.reportPeriod.replace(/\D/g, "")) || 0);

    if (date2 < date1) {
      warnings.push(
        "Reverse Chronology: Your 'Benchmark' period is older than your 'Baseline'. Percentage changes will reflect historical contraction rather than forward growth.",
      );
    }

    const required = [
      "revenue",
      "netIncome",
      "eps",
      "revenuePrior",
      "netIncomePrior",
      "epsPrior",
    ];
    required.forEach((m) => {
      if (
        typeof (report1 as any)[m] !== "number" ||
        typeof (report2 as any)[m] !== "number"
      ) {
        errors.push(
          `Critical data point missing: ${m.replace(/([A-Z])/g, " $1").toLowerCase()} is required for accurate variance modeling.`,
        );
      }
    });

    return { errors, warnings, isValid: errors.length === 0 };
  }, [report1, report2]);

  const handleDismissWarning = (index: number) => {
    setDismissedWarnings((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // This is just for visual feedback, the store is the source of truth
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsRefreshing(false);
  };

  const handleExportPNG = async () => {
    if (!summaryCardsRef.current || isExportingPng) return;

    setIsExportingPng(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dataUrl = await toPng(summaryCardsRef.current, {
        cacheBust: true,
        backgroundColor: document.documentElement.classList.contains("dark")
          ? "#0f172a"
          : "#f8fafc",
        style: { padding: "24px", borderRadius: "0px" },
      });
      const link = document.createElement("a");
      link.download = `comparison_summary_${report1?.ticker}_vs_${report2?.ticker}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export PNG", err);
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleExportCSV = () => {
    if (!report1 || !report2 || !validation?.isValid) return;

    const revGrowth1 = calculateGrowth(report1.revenue, report1.revenuePrior);
    const revGrowth2 = calculateGrowth(report2.revenue, report2.revenuePrior);

    const rows = [
      ["Analysis Type", "Comparative Variance Report"],
      ["Export Date", new Date().toLocaleString()],
      ["Entity 1 (Baseline)", `${report1.companyName} (${report1.ticker})`],
      ["Entity 2 (Benchmark)", `${report2.companyName} (${report2.ticker})`],
      [""],
      [
        "Metric",
        `Baseline (${report1.reportPeriod} ${report1.reportYear})`,
        `Benchmark (${report2.reportPeriod} ${report2.reportYear})`,
        "Delta (Abs)",
        "Delta (%)",
      ],
      [
        "Total Revenue",
        report1.revenue,
        report2.revenue,
        report2.revenue - report1.revenue,
        (
          ((report2.revenue - report1.revenue) / Math.abs(report1.revenue)) *
          100
        ).toFixed(2) + "%",
      ],
      [
        "Revenue Growth (YoY) (%)",
        revGrowth1.toFixed(2),
        revGrowth2.toFixed(2),
        (revGrowth2 - revGrowth1).toFixed(2),
        "N/A",
      ],
      [
        "Net Income",
        report1.netIncome,
        report2.netIncome,
        report2.netIncome - report1.netIncome,
        (
          ((report2.netIncome - report1.netIncome) /
            Math.abs(report1.netIncome)) *
          100
        ).toFixed(2) + "%",
      ],
      [
        "EPS (Diluted)",
        report1.eps,
        report2.eps,
        (report2.eps - report1.eps).toFixed(2),
        (((report2.eps - report1.eps) / Math.abs(report1.eps)) * 100).toFixed(
          2,
        ) + "%",
      ],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `variance_analysis_${report2.ticker}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const MetricRow: React.FC<MetricRowProps> = ({
    label,
    v1,
    v2,
    format = "currency",
    invert = false,
  }) => {
    const delta = v2 - v1;
    const pctChange = Math.abs(v1) > 0 ? (delta / Math.abs(v1)) * 100 : 0;

    const displayV1 =
      format === "currency"
        ? formatCurrency(v1)
        : `${v1.toFixed(2)}${format === "percent" ? "%" : ""}`;
    const displayV2 =
      format === "currency"
        ? formatCurrency(v2)
        : `${v2.toFixed(2)}${format === "percent" ? "%" : ""}`;

    const isPositive = delta > 0;
    const isNeutral = Math.abs(delta) < 0.001;
    const isGood = invert ? !isPositive : isPositive;

    const displayDelta =
      format === "currency"
        ? formatCurrency(delta)
        : `${isPositive ? "+" : ""}${delta.toFixed(2)}${format === "percent" ? "%" : ""}`;

    const colorClasses = isNeutral
      ? "text-slate-500 bg-slate-100 dark:bg-slate-800"
      : isGood
        ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "text-rose-700 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400";

    return (
      <div className="grid grid-cols-4 py-4 border-b border-slate-100 dark:border-slate-800 items-center transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-4 -mx-4 rounded-lg">
        <div className="text-slate-600 dark:text-slate-400 font-semibold text-xs md:text-sm">
          {label}
        </div>
        <div className="text-right font-medium text-slate-700 dark:text-slate-300 text-xs md:text-sm">
          {displayV1}
        </div>
        <div className="text-right font-bold text-slate-900 dark:text-white text-xs md:text-sm">
          {displayV2}
        </div>
        <div className="flex flex-col items-end">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] md:text-xs shadow-sm ${colorClasses}`}
          >
            {!isNeutral &&
              (isPositive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              ))}
            {isNeutral && <Minus size={14} />}
            <span>{isNeutral ? "Flat" : displayDelta}</span>
          </div>
          {!isNeutral && format !== "percent" && (
            <span
              className={`text-[10px] font-bold mt-1 ${isGood ? "text-emerald-600/70" : "text-rose-600/70"}`}
            >
              {isPositive ? "+" : ""}
              {pctChange.toFixed(1)}%
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
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-2xl font-bold mb-2">Comparison Hub Locked</h3>
          <p className="text-slate-500 max-w-sm">
            Please upload at least two reports to unlock side-by-side variance
            analysis and YoY benchmarking.
          </p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Check for new reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Comparative Intelligence
          </h2>
          <p className="text-slate-500 font-medium">
            Quantifying variances and growth velocity across periods.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            title="Refresh Data from Storage"
            className="p-3 bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-2xl hover:text-blue-600 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw
              size={18}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
          <button
            onClick={handleExportPNG}
            disabled={!validation?.isValid || isExportingPng}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50 active:scale-95"
          >
            {isExportingPng ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ImageIcon size={18} />
            )}
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

      {/* Global Filter Bar */}
      <div className="bg-slate-100/50 dark:bg-slate-800/30 p-2 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-3 px-6 py-3">
          <Filter size={18} className="text-slate-400" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
            Filter Repository
          </span>
        </div>
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2 md:pb-0 px-2 no-scrollbar">
          {reportTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                typeFilter === type
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-slate-200 dark:ring-slate-600"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {type}
              <span className="ml-2 opacity-50 font-medium">
                (
                {type === "All Types"
                  ? reports.length
                  : reports.filter((r) => r.reportType === type).length}
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Baseline Card */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl transition-all hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-blue-500 shadow-[2px_0_10px_rgba(59,130,246,0.5)]"></div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                    Baseline Report
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {report1?.ticker || "---"}
                    </span>
                    <CheckCircle2 size={14} className="text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">
                  Primary Reference
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Active Selection
                </span>
              </div>
            </div>

            <div className="relative">
              <select
                value={report1Id}
                onChange={(e) => {
                  setReport1Id(e.target.value);
                  setDismissedWarnings(new Set());
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 font-bold outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 dark:text-slate-100 pr-12"
              >
                {filteredReports.length > 0 ? (
                  filteredReports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.ticker} — {r.companyName} ({r.reportPeriod}{" "}
                      {r.reportYear})
                    </option>
                  ))
                ) : (
                  <option disabled>No reports matching filter</option>
                )}
              </select>
              {/* Added missing ChevronRight import to fix errors */}
              <ChevronRight
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none"
                size={20}
              />
            </div>

            {report1 && (
              <div className="flex items-center gap-2 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  Analyzing {report1.reportType || "Standard"} filing for fiscal
                  year {report1.reportYear}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Benchmark Card */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl transition-all hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-emerald-500 shadow-[2px_0_10px_rgba(16,185,129,0.5)]"></div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                    Benchmark Report
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {report2?.ticker || "---"}
                    </span>
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">
                  Variance Target
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Active Comparison
                </span>
              </div>
            </div>

            <div className="relative">
              <select
                value={report2Id}
                onChange={(e) => {
                  setReport2Id(e.target.value);
                  setDismissedWarnings(new Set());
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 font-bold outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-800 dark:text-slate-100 pr-12"
              >
                {filteredReports.length > 0 ? (
                  filteredReports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.ticker} — {r.companyName} ({r.reportPeriod}{" "}
                      {r.reportYear})
                    </option>
                  ))
                ) : (
                  <option disabled>No reports matching filter</option>
                )}
              </select>
              {/* Added missing ChevronRight import to fix errors */}
              <ChevronRight
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none"
                size={20}
              />
            </div>

            {report2 && (
              <div className="flex items-center gap-2 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  Targeting {report2.reportType || "Standard"} filing for fiscal
                  year {report2.reportYear}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {validation &&
        (validation.errors.length > 0 ||
          validation.warnings.length > dismissedWarnings.size) && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            {validation.errors.map((error, i) => (
              <div
                key={`err-${i}`}
                className="flex items-start gap-4 p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-rose-700 dark:text-rose-400 shadow-sm"
              >
                <div className="bg-rose-100 dark:bg-rose-900/40 p-2 rounded-xl text-rose-600 dark:text-rose-500">
                  <ShieldAlert size={20} />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-sm uppercase tracking-wider mb-1">
                    Critical Error
                  </h5>
                  <p className="text-sm font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            ))}
            {validation.warnings.map((warning, i) => {
              if (dismissedWarnings.has(i)) return null;
              return (
                <div
                  key={`warn-${i}`}
                  className="flex items-start gap-4 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-amber-800 dark:text-amber-400 shadow-sm relative group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                  <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-xl text-amber-600 dark:text-amber-500">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1 pr-8">
                    <h5 className="font-bold text-sm uppercase tracking-wider mb-1">
                      Comparability Warning
                    </h5>
                    <p className="text-sm font-medium leading-relaxed">
                      {warning}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDismissWarning(i)}
                    className="p-2 text-amber-400 hover:text-amber-600 dark:hover:text-amber-200 transition-colors rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30"
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
          <div
            ref={summaryCardsRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500"
          >
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 border-l-8 border-l-blue-500 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-2xl text-slate-900 dark:text-white leading-tight">
                    {report1.companyName}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">
                      BASELINE: {report1.reportPeriod} {report1.reportYear}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-[9px] font-black rounded-lg text-slate-500">
                      {report1.reportType || "Standard"}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <FileText size={24} />
                </div>
              </div>
              <div className="grid grid-cols-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 gap-8">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">
                    Revenue
                  </p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">
                    {formatCurrency(report1.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">
                    Net Inc.
                  </p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">
                    {formatCurrency(report1.netIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">
                    EPS
                  </p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">
                    ${report1.eps.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 border-l-8 border-l-emerald-500 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-2xl text-slate-900 dark:text-white leading-tight">
                    {report2.companyName}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">
                      BENCHMARK: {report2.reportPeriod} {report2.reportYear}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-[9px] font-black rounded-lg text-slate-500">
                      {report2.reportType || "Standard"}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <Target size={24} />
                </div>
              </div>
              <div className="grid grid-cols-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 gap-8">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">
                    Revenue
                  </p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">
                    {formatCurrency(report2.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">
                    Net Inc.
                  </p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">
                    {formatCurrency(report2.netIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">
                    EPS
                  </p>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100">
                    ${report2.eps.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="grid grid-cols-4 bg-slate-50/80 dark:bg-slate-900/80 p-8 border-b border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
                KPI Metric
              </div>
              <div className="text-right text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
                Baseline
              </div>
              <div className="text-right text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
                Benchmark
              </div>
              <div className="text-right text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
                Delta Analysis
              </div>
            </div>
            <div className="p-10 space-y-2">
              <MetricRow
                label="Total Revenue"
                v1={report1.revenue}
                v2={report2.revenue}
              />
              <MetricRow
                label="Revenue Growth (YoY)"
                v1={calculateGrowth(report1.revenue, report1.revenuePrior)}
                v2={calculateGrowth(report2.revenue, report2.revenuePrior)}
                format="percent"
              />
              <MetricRow
                label="Net Income"
                v1={report1.netIncome}
                v2={report2.netIncome}
              />
              <MetricRow
                label="EPS (Diluted)"
                v1={report1.eps}
                v2={report2.eps}
                format="raw"
              />
              <MetricRow
                label="Gross Margin"
                v1={report1.grossMargin}
                v2={report2.grossMargin}
                format="percent"
              />
              <MetricRow
                label="Operating Margin"
                v1={report1.operatingMargin}
                v2={report2.operatingMargin}
                format="percent"
              />
              <MetricRow
                label="Net Margin"
                v1={report1.netMargin}
                v2={report2.netMargin}
                format="percent"
              />
            </div>
          </div>
        </>
      )}

      {validation && !validation.isValid && (
        <div className="bg-white dark:bg-slate-800 p-24 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
          <div className="bg-rose-50 dark:bg-rose-900/30 p-8 rounded-full mb-8 text-rose-500">
            <ShieldAlert size={64} strokeWidth={1.5} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
            Incomplete Analysis Data
          </h3>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            The selected financial models are missing key comparative metrics.
            Please ensure both reports contain standard GAAP figures (Revenue,
            Net Income, EPS) for accurate benchmarking.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
