import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  getSentimentColor,
  getSentimentLabel,
  calculateGrowth,
  getVarianceColor,
} from '../../utils';

describe('formatCurrency', () => {
  it('formats billions', () => {
    expect(formatCurrency(1500000000)).toBe('$1.50B');
  });

  it('formats millions', () => {
    expect(formatCurrency(2500000)).toBe('$2.50M');
  });

  it('formats thousands', () => {
    expect(formatCurrency(123456)).toBe('$123,456');
  });

  it('handles negative numbers', () => {
    expect(formatCurrency(-2500000)).toBe('-$2.50M');
  });
});

describe('getSentimentColor', () => {
  it('returns emerald for high scores', () => {
    expect(getSentimentColor(70).text).toBe('text-emerald-500');
  });

  it('returns rose for low scores', () => {
    expect(getSentimentColor(30).text).toBe('text-rose-500');
  });

  it('returns amber for neutral scores', () => {
    expect(getSentimentColor(50).text).toBe('text-amber-500');
  });
});

describe('getSentimentLabel', () => {
  it('returns Extremely Bullish for very high scores', () => {
    expect(getSentimentLabel(80)).toBe('Extremely Bullish');
  });

  it('returns Bullish for high scores', () => {
    expect(getSentimentLabel(65)).toBe('Bullish');
  });

  it('returns Neutral for mid scores', () => {
    expect(getSentimentLabel(45)).toBe('Neutral');
  });

  it('returns Bearish for low scores', () => {
    expect(getSentimentLabel(25)).toBe('Bearish');
  });

  it('returns Extremely Bearish for very low scores', () => {
    expect(getSentimentLabel(10)).toBe('Extremely Bearish');
  });
});

describe('calculateGrowth', () => {
  it('calculates positive growth', () => {
    expect(calculateGrowth(120, 100)).toBe(20);
  });

  it('calculates negative growth', () => {
    expect(calculateGrowth(80, 100)).toBe(-20);
  });

  it('handles zero prior value', () => {
    expect(calculateGrowth(100, 0)).toBe(0);
  });
});

describe('getVarianceColor', () => {
  it('returns emerald for positive variance', () => {
    expect(getVarianceColor(10)).toContain('emerald');
  });

  it('returns rose for negative variance', () => {
    expect(getVarianceColor(-10)).toContain('rose');
  });

  it('returns slate for zero variance', () => {
    expect(getVarianceColor(0)).toContain('slate');
  });

  it('inverts colors when invert is true', () => {
    expect(getVarianceColor(10, true)).toContain('rose');
    expect(getVarianceColor(-10, true)).toContain('emerald');
  });
});
