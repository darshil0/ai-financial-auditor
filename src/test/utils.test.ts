import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  getSentimentColor,
  getSentimentLabel,
  calculateGrowth,
  getVarianceColor,
} from "../../utils";

describe("formatCurrency", () => {
  // Standard Formatting
  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
  it("formats positive integers", () => {
    expect(formatCurrency(12345)).toBe("$12,345.00");
  });
  it("formats positive floats", () => {
    expect(formatCurrency(12345.67)).toBe("$12,345.67");
  });
  it("formats negative integers", () => {
    expect(formatCurrency(-54321)).toBe("-$54,321.00");
  });
  it("formats negative floats", () => {
    expect(formatCurrency(-54321.98)).toBe("-$54,321.98");
  });
  it("handles different decimal precision", () => {
    expect(formatCurrency(100.123, false, 3)).toBe("$100.123");
  });

  // Compact Formatting
  it("formats trillions", () => {
    expect(formatCurrency(1.23e12, true)).toBe("$1.23T");
  });
  it("formats billions", () => {
    expect(formatCurrency(2.34e9, true)).toBe("$2.34B");
  });
  it("formats millions", () => {
    expect(formatCurrency(3.45e6, true)).toBe("$3.45M");
  });
  it("formats thousands", () => {
    expect(formatCurrency(4.56e3, true)).toBe("$4.56K");
  });
  it("formats hundreds", () => {
    expect(formatCurrency(567, true)).toBe("$567.00");
  });
  it("handles negative compact numbers", () => {
    expect(formatCurrency(-1.5e9, true)).toBe("-$1.50B");
  });
  it("handles compact decimals", () => {
    expect(formatCurrency(1.2345e6, true, 4)).toBe("$1.2345M");
  });
});

describe("getSentimentColor", () => {
  it("returns emerald for high scores", () => {
    expect(getSentimentColor(70).text).toBe("text-emerald-500");
  });

  it("returns rose for low scores", () => {
    expect(getSentimentColor(30).text).toBe("text-rose-500");
  });

  it("returns amber for neutral scores", () => {
    expect(getSentimentColor(50).text).toBe("text-amber-500");
  });
});

describe("getSentimentLabel", () => {
  it("returns Extremely Bullish for very high scores", () => {
    expect(getSentimentLabel(80)).toBe("Extremely Bullish");
  });

  it("returns Bullish for high scores", () => {
    expect(getSentimentLabel(65)).toBe("Bullish");
  });

  it("returns Neutral for mid scores", () => {
    expect(getSentimentLabel(45)).toBe("Neutral");
  });

  it("returns Bearish for low scores", () => {
    expect(getSentimentLabel(25)).toBe("Bearish");
  });

  it("returns Extremely Bearish for very low scores", () => {
    expect(getSentimentLabel(10)).toBe("Extremely Bearish");
  });
});

describe("calculateGrowth", () => {
  it("calculates positive growth", () => {
    expect(calculateGrowth(120, 100)).toBe(20);
  });

  it("calculates negative growth", () => {
    expect(calculateGrowth(80, 100)).toBe(-20);
  });

  it("handles zero prior value", () => {
    expect(calculateGrowth(100, 0)).toBe(0);
  });
});

describe("getVarianceColor", () => {
  it("returns emerald for positive variance", () => {
    expect(getVarianceColor(10)).toContain("emerald");
  });

  it("returns rose for negative variance", () => {
    expect(getVarianceColor(-10)).toContain("rose");
  });

  it("returns slate for zero variance", () => {
    expect(getVarianceColor(0)).toContain("slate");
  });

  it("inverts colors when invert is true", () => {
    expect(getVarianceColor(10, true)).toContain("rose");
    expect(getVarianceColor(-10, true)).toContain("emerald");
  });
});

import { cn } from "../../utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, "b", undefined, "c", null)).toBe("a b c");
  });

  it("handles an empty input", () => {
    expect(cn()).toBe("");
  });
});
