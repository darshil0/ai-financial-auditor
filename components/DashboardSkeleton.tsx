import React from "react";
import {
  FileQuestion,
  Sparkles,
  PieChart as PieChartIcon,
  Activity,
  MessageSquareText,
  ImageIcon,
  Globe,
} from "lucide-react";

const SkeletonBlock = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={`bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem] animate-pulse ${className}`}
  >
    {children}
  </div>
);

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <SkeletonBlock className="h-10 w-72 mb-3" />
          <SkeletonBlock className="h-4 w-48" />
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <SkeletonBlock className="h-12 w-36 rounded-2xl" />
          <SkeletonBlock className="h-12 w-44 rounded-2xl" />
          <SkeletonBlock className="h-12 w-48 rounded-2xl" />
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <SkeletonBlock className="h-36" />
        <SkeletonBlock className="h-36" />
        <SkeletonBlock className="h-36" />
        <SkeletonBlock className="h-36" />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <SkeletonBlock className="h-96" />
          <SkeletonBlock className="h-72" />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <SkeletonBlock className="h-96" />
          <SkeletonBlock className="h-72" />
        </div>
      </div>
    </div>
  );
};

export const NoReportState: React.FC<{ onSwitchToUpload: () => void }> = ({
  onSwitchToUpload,
}) => (
  <div className="h-full flex flex-col items-center justify-center text-center py-24 px-4">
    <div className="bg-blue-100 dark:bg-blue-900/20 p-8 rounded-full mb-8">
      <FileQuestion size={56} className="text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-3xl font-black mb-3 tracking-tight text-slate-900 dark:text-white">
      Intelligence Engine Standby
    </h3>
    <p className="text-slate-500 max-w-md mb-10 text-lg">
      No active analysis detected. Upload an earnings report to initialize the
      dashboard.
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

export default DashboardSkeleton;
