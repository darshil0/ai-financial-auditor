import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Dashboard from "@/features/dashboard/Dashboard";
import { FinancialReport } from "@/shared/types";
import {
  getMarketContext,
  generateAudioBriefing,
  visualizeGuidance,
} from "@/shared/services/geminiService";

vi.mock("@/shared/services/geminiService", () => ({
  getMarketContext: vi.fn(),
  generateAudioBriefing: vi.fn(),
  visualizeGuidance: vi.fn(),
  connectLiveAnalyst: vi.fn(),
}));

// Mock LiveAnalyst so it doesn't try to initialize Web Audio APIs
vi.mock("@/features/analyst/LiveAnalyst", () => ({
  default: () => <div>Live Analyst Component Mock</div>,
}));

describe("Dashboard Component", () => {
  const mockReport: FinancialReport = {
    id: "report-123",
    companyName: "Acme Corp",
    ticker: "ACME",
    reportType: "10-Q",
    reportPeriod: "Q1",
    reportYear: 2026,
    revenue: 50000000,
    revenuePrior: 40000000,
    netIncome: 10000000,
    netIncomePrior: 8000000,
    eps: 2.5,
    epsPrior: 2.0,
    grossMargin: 60,
    operatingMargin: 25,
    netMargin: 20,
    sentimentScore: 85,
    expenses: [{ category: "R&D", amount: 15000000 }],
    trends: [
      { period: "Q1 2025", revenue: 40000000, netIncome: 8000000 },
      { period: "Q1 2026", revenue: 50000000, netIncome: 10000000 },
    ],
    highlights: ["Awesome growth"],
    managementCommentary: "We had a solid quarter with strong execution.",
    timestamp: Date.now(),
  };

  const onSwitchToUpload = vi.fn();
  const onUpdateReport = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock window.URL.createObjectURL and revokeObjectURL
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:test-url"),
      revokeObjectURL: vi.fn(),
    });

    // Mock HTMLAudioElement
    const mockAudio = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      src: "",
      onended: null,
    };
    vi.stubGlobal(
      "Audio",
      vi.fn().mockImplementation(() => mockAudio),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  // Helper to mount and transition past isLoading state safely using our mixed timers pattern
  const renderDashboardLoaded = () => {
    const utils = render(
      <Dashboard
        report={mockReport}
        onSwitchToUpload={onSwitchToUpload}
        onUpdateReport={onUpdateReport}
      />,
    );

    // Fast-forward mount timer synchronously
    act(() => {
      vi.advanceTimersByTime(800);
    });

    // Immediately restore real timers for subsequent promises, Sonner, and RTL waitFors
    vi.useRealTimers();

    return utils;
  };

  it("renders loading skeleton and then dashboard report metrics correctly", async () => {
    render(
      <Dashboard
        report={mockReport}
        onSwitchToUpload={onSwitchToUpload}
        onUpdateReport={onUpdateReport}
      />,
    );

    // Initial render displays loading skeleton (pulse animations)
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();

    // Advance timers past the loading phase (750ms)
    act(() => {
      vi.advanceTimersByTime(800);
    });

    // Dashboard metrics render
    expect(screen.getByText("Q1 2026 Results")).toBeInTheDocument();
    expect(screen.getByText("Verified Analysis")).toBeInTheDocument();
    expect(screen.getByText(/We had a solid quarter with strong execution/)).toBeInTheDocument();
  });

  it("triggers switch to upload view when no report is present", async () => {
    // Restore real timers immediately since there's no loading phase for empty state
    vi.useRealTimers();

    render(
      <Dashboard
        report={null}
        onSwitchToUpload={onSwitchToUpload}
        onUpdateReport={onUpdateReport}
      />,
    );

    // Click Launch New Analysis button on empty state
    const btn = screen.getByText("Launch New Analysis");
    fireEvent.click(btn);
    expect(onSwitchToUpload).toHaveBeenCalledTimes(1);
  });

  it("triggers Market Grounding action and calls onUpdateReport on success", async () => {
    const mockContext = { summary: "Acme stock rose 5%", insights: [] };
    vi.mocked(getMarketContext).mockResolvedValueOnce(mockContext as any);

    renderDashboardLoaded();

    const groundingBtn = screen.getByText("Market Grounding");
    fireEvent.click(groundingBtn);

    await waitFor(() => {
      expect(getMarketContext).toHaveBeenCalledWith("ACME", "Acme Corp");
      expect(onUpdateReport).toHaveBeenCalledWith(
        expect.objectContaining({
          marketContext: mockContext,
        }),
      );
    });
  });

  it("triggers Visualize Guidance action and calls onUpdateReport on success", async () => {
    vi.mocked(visualizeGuidance).mockResolvedValueOnce("data:image/png;base64,image-bytes");

    renderDashboardLoaded();

    const visualBtn = screen.getByText("Visualize Guidance");
    fireEvent.click(visualBtn);

    await waitFor(() => {
      expect(visualizeGuidance).toHaveBeenCalledWith(mockReport);
      expect(onUpdateReport).toHaveBeenCalledWith(
        expect.objectContaining({
          visualizedGuidance: "data:image/png;base64,image-bytes",
        }),
      );
    });
  });

  it("generates and plays audio briefing on play click", async () => {
    const mockAudioBriefing = { base64Audio: "audio-bytes", summary: "summary" };
    vi.mocked(generateAudioBriefing).mockResolvedValueOnce(mockAudioBriefing);

    renderDashboardLoaded();

    const audioBtn = screen.getByText("Play Audio Briefing");
    fireEvent.click(audioBtn);

    await waitFor(() => {
      expect(generateAudioBriefing).toHaveBeenCalledWith(mockReport);
      expect(onUpdateReport).toHaveBeenCalledWith(
        expect.objectContaining({
          audioBriefing: mockAudioBriefing,
        }),
      );
    });
  });

  it("opens live analyst dialog when Talk to Analyst is clicked", async () => {
    renderDashboardLoaded();

    const analystBtn = screen.getByText("Talk to Analyst");
    fireEvent.click(analystBtn);

    // Live analyst dialog should render (our mock)
    expect(screen.getByText("Live Analyst Component Mock")).toBeInTheDocument();
  });
});
