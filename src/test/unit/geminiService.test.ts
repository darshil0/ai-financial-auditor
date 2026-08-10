import { describe, it, expect, vi, beforeEach } from "vitest";

describe("geminiService", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("throws when VITE_API_KEY is missing", async () => {
    vi.stubEnv("VITE_API_KEY", "");
    const { analyzeEarningsReport } = await import("@/shared/services/geminiService");
    const fakeFile = new File([""], "test.pdf", { type: "application/pdf" });
    await expect(analyzeEarningsReport(fakeFile)).rejects.toThrow(
      "VITE_API_KEY is missing or invalid",
    );
    vi.unstubAllEnvs();
  });

  it("throws when VITE_API_KEY is the placeholder", async () => {
    vi.stubEnv("VITE_API_KEY", "your_api_key_here");
    const { analyzeEarningsReport } = await import("@/shared/services/geminiService");
    const fakeFile = new File([""], "test.pdf", { type: "application/pdf" });
    await expect(analyzeEarningsReport(fakeFile)).rejects.toThrow(
      "VITE_API_KEY is missing or invalid",
    );
    vi.unstubAllEnvs();
  });

  it("generateAudioBriefing returns fallback on error", async () => {
    vi.stubEnv("VITE_API_KEY", "fake-key");
    const { generateAudioBriefing } = await import("@/shared/services/geminiService");
    const mockReport = {
      companyName: "Test",
      reportPeriod: "Q1",
      reportYear: 2024,
      revenue: 1000,
      eps: 1,
      sentimentScore: 50,
    } as any;
    const result = await generateAudioBriefing(mockReport);
    expect(result.base64Audio).toBe("");
    expect(result.summary).toContain("Audio briefing unavailable");
    vi.unstubAllEnvs();
  });

  it("visualizeGuidance returns empty string on error", async () => {
    vi.stubEnv("VITE_API_KEY", "fake-key");
    const { visualizeGuidance } = await import("@/shared/services/geminiService");
    const mockReport = {
      companyName: "Test",
      ticker: "TST",
      sentimentScore: 50,
    } as any;
    const result = await visualizeGuidance(mockReport);
    expect(result).toBe("");
    vi.unstubAllEnvs();
  });

  it("getMarketContext returns fallback on error", async () => {
    vi.stubEnv("VITE_API_KEY", "fake-key");
    const { getMarketContext } = await import("@/shared/services/geminiService");
    const result = await getMarketContext("TST", "Test Co");
    expect(result.summary).toContain("Market grounding currently unavailable");
    expect(result.insights).toEqual([]);
    vi.unstubAllEnvs();
  });
});
