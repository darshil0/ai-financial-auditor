
/**
 * FinAnalyzer Pro - Utility Functions
 */

export const formatCurrency = (val: number): string => {
  const absVal = Math.abs(val);
  let formatted = '';
  if (absVal >= 1000000000) {
    formatted = `$${(absVal / 1000000000).toFixed(2)}B`;
  } else if (absVal >= 1000000) {
    formatted = `$${(absVal / 1000000).toFixed(2)}M`;
  } else {
    formatted = `$${absVal.toLocaleString()}`;
  }
  return val < 0 ? `-${formatted}` : formatted;
};

export const getSentimentColor = (score: number): { text: string; bg: string; border: string } => {
  if (score >= 70) return { 
    text: 'text-emerald-500', 
    bg: 'bg-emerald-500', 
    border: 'border-emerald-200 dark:border-emerald-800' 
  };
  if (score <= 30) return { 
    text: 'text-rose-500', 
    bg: 'bg-rose-500', 
    border: 'border-rose-200 dark:border-rose-800' 
  };
  return { 
    text: 'text-amber-500', 
    bg: 'bg-amber-500', 
    border: 'border-amber-200 dark:border-amber-800' 
  };
};

export const getSentimentLabel = (score: number): string => {
  if (score >= 80) return 'Extremely Bullish';
  if (score >= 60) return 'Bullish';
  if (score >= 40) return 'Neutral';
  if (score >= 20) return 'Bearish';
  return 'Extremely Bearish';
};

export const calculateGrowth = (current: number, prior: number): number => {
  if (!prior || prior === 0) return 0;
  return ((current - prior) / Math.abs(prior)) * 100;
};

export const getVarianceColor = (value: number, invert: boolean = false): string => {
  if (Math.abs(value) < 0.001) return 'text-slate-500';
  const isPositive = value > 0;
  const isGood = invert ? !isPositive : isPositive;
  return isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
};
