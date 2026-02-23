/**
 * FinAnalyzer Pro - Utility Functions
 */

export const formatCurrency = (
  value: number,
  compact = false,
  decimals = 2,
): string => {
  if (value === 0) return "$0.00";
  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value);
  let formattedValue;

  if (compact) {
    if (absValue >= 1e12) {
      formattedValue = `${(absValue / 1e12).toFixed(decimals)}T`;
    } else if (absValue >= 1e9) {
      formattedValue = `${(absValue / 1e9).toFixed(decimals)}B`;
    } else if (absValue >= 1e6) {
      formattedValue = `${(absValue / 1e6).toFixed(decimals)}M`;
    } else if (absValue >= 1e3) {
      formattedValue = `${(absValue / 1e3).toFixed(decimals)}K`;
    } else {
      formattedValue = absValue.toFixed(decimals);
    }
  } else {
    formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
      .format(absValue)
      .replace(/^\$/, "");
  }

  return `${sign}$${formattedValue}`;
};

export const getSentimentColor = (
  score: number,
): { text: string; bg: string; border: string } => {
  if (score >= 70)
    return {
      text: "text-emerald-500",
      bg: "bg-emerald-500",
      border: "border-emerald-200 dark:border-emerald-800",
    };
  if (score <= 30)
    return {
      text: "text-rose-500",
      bg: "bg-rose-500",
      border: "border-rose-200 dark:border-rose-800",
    };
  return {
    text: "text-amber-500",
    bg: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-800",
  };
};

export const getSentimentLabel = (score: number): string => {
  if (score >= 80) return "Extremely Bullish";
  if (score >= 60) return "Bullish";
  if (score >= 40) return "Neutral";
  if (score >= 20) return "Bearish";
  return "Extremely Bearish";
};

export const calculateGrowth = (current: number, prior: number): number => {
  if (!prior || prior === 0) return 0;
  return ((current - prior) / Math.abs(prior)) * 100;
};

export const getVarianceColor = (
  value: number,
  invert: boolean = false,
): string => {
  if (Math.abs(value) < 0.001) return "text-slate-500";
  const isPositive = value > 0;
  const isGood = invert ? !isPositive : isPositive;
  return isGood
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
};

export const cn = (
  ...classes: (string | boolean | undefined | null)[]
): string => classes.filter(Boolean).join(" ");
