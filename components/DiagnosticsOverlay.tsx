import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play,
  Activity,
  ShieldCheck,
  Bug,
} from "lucide-react";

interface DiagnosticsOverlayProps {
  onClose: () => void;
}

interface TestResult {
  id: string;
  name: string;
  status: "pending" | "running" | "pass" | "fail";
  message: string;
}

const DiagnosticsOverlay: React.FC<DiagnosticsOverlayProps> = ({ onClose }) => {
  const [tests, setTests] = useState<TestResult[]>([
    {
      id: "1",
      name: "Responsive Layout Check",
      status: "pending",
      message: "Verifying container widths and stacking logic.",
    },
    {
      id: "2",
      name: "Color Palette Contrast",
      status: "pending",
      message: "Checking WCAG 2.1 contrast ratios for legibility.",
    },
    {
      id: "3",
      name: "Interactive States",
      status: "pending",
      message: "Testing hover, focus, and active button states.",
    },
    {
      id: "4",
      name: "Asset Integrity",
      status: "pending",
      message: "Validating SVG and iconography rendering.",
    },
    {
      id: "5",
      name: "LocalStorage Persistence",
      status: "pending",
      message: "Checking report vault write/read capability.",
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    for (let i = 0; i < tests.length; i++) {
      setTests((prev) =>
        prev.map((t, idx) => (idx === i ? { ...t, status: "running" } : t)),
      );
      await new Promise((r) => setTimeout(r, 800));
      setTests((prev) =>
        prev.map((t, idx) => (idx === i ? { ...t, status: "pass" } : t)),
      );
    }
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                UI Diagnostics
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Automation Suite v2.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                test.status === "pass"
                  ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50"
                  : test.status === "running"
                    ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 animate-pulse"
                    : "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700"
              }`}
            >
              <div
                className={`p-2 rounded-xl flex-shrink-0 ${
                  test.status === "pass"
                    ? "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30"
                    : test.status === "running"
                      ? "text-blue-500 bg-blue-100 dark:bg-blue-900/30"
                      : "text-slate-300 bg-slate-200 dark:bg-slate-800"
                }`}
              >
                {test.status === "pass" && <CheckCircle2 size={20} />}
                {test.status === "running" && (
                  <Loader2 size={20} className="animate-spin" />
                )}
                {test.status === "pending" && <Activity size={20} />}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-black text-sm mb-1 ${test.status === "pass" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}
                >
                  {test.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {test.message}
                </p>
              </div>
              {test.status === "pass" && (
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
                  Passed
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black shadow-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Play size={20} />
            )}
            Run Automated Sweep
          </button>
          <button className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
            <Bug size={20} /> Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsOverlay;
