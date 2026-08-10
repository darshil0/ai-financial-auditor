import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import LiveAnalyst from "@/features/analyst/LiveAnalyst";
import { connectLiveAnalyst } from "@/shared/services/geminiService";

vi.mock("@/shared/services/geminiService", () => ({
  connectLiveAnalyst: vi.fn(),
}));

describe("LiveAnalyst Component", () => {
  const mockReport = {
    id: "report-123",
    companyName: "Acme Corp",
    ticker: "ACME",
    reportPeriod: "Q1",
    reportYear: 2026,
    revenue: 50000000,
    netIncome: 10000000,
    eps: 2.5,
    sentimentScore: 85,
    highlights: ["Awesome highlights"],
  } as any;

  const onClose = vi.fn();
  const onConnected = vi.fn();

  let mockAudioContextInstance: any;
  let mockMediaStreamInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockMediaStreamInstance = {
      getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
    };

    const mockGainNode = {
      connect: vi.fn(),
    };

    const mockScriptProcessor = {
      connect: vi.fn(),
      onaudioprocess: null,
    };

    const mockMediaStreamSource = {
      connect: vi.fn(),
    };

    const mockAudioBuffer = {
      length: 4096,
      duration: 1.5,
      sampleRate: 24000,
      numberOfChannels: 1,
      getChannelData: vi.fn().mockReturnValue(new Float32Array(4096)),
    };

    mockAudioContextInstance = {
      createGain: vi.fn().mockReturnValue(mockGainNode),
      createMediaStreamSource: vi.fn().mockReturnValue(mockMediaStreamSource),
      createScriptProcessor: vi.fn().mockReturnValue(mockScriptProcessor),
      createBuffer: vi.fn().mockReturnValue(mockAudioBuffer),
      destination: {},
      close: vi.fn().mockResolvedValue(undefined),
      state: "running",
    };

    // Safely redefine mediaDevices on navigator's prototype
    try {
      Object.defineProperty(Object.getPrototypeOf(window.navigator), "mediaDevices", {
        writable: true,
        configurable: true,
        value: {
          getUserMedia: vi.fn().mockResolvedValue(mockMediaStreamInstance),
        },
      });
    } catch (e) {
      // Fallback define on window.navigator directly if needed
      (window.navigator as any).mediaDevices = {
        getUserMedia: vi.fn().mockResolvedValue(mockMediaStreamInstance),
      };
    }

    // Assign directly to window object as a real constructor function for JSDOM compatibility
    const MockAudioContext = function (this: any) {
      return mockAudioContextInstance;
    };
    (window as any).AudioContext = MockAudioContext;
    (window as any).webkitAudioContext = MockAudioContext;
  });

  afterEach(() => {
    delete (window as any).AudioContext;
    delete (window as any).webkitAudioContext;
  });

  it("renders connecting state initially", async () => {
    const sessionPromise = new Promise(() => {});
    vi.mocked(connectLiveAnalyst).mockReturnValueOnce(sessionPromise as any);

    render(<LiveAnalyst report={mockReport} onClose={onClose} onConnected={onConnected} />);

    expect(screen.getByText("Live AI Analyst")).toBeInTheDocument();
    expect(screen.getByText("Initializing analyst connection...")).toBeInTheDocument();
  });

  it("triggers callback and opens session successfully, streams microphone data, and synthesizes output", async () => {
    const mockSession = {
      sendRealtimeInput: vi.fn(),
      close: vi.fn(),
    };

    let cachedCallbacks: any;
    vi.mocked(connectLiveAnalyst).mockImplementationOnce((async (report: any, callbacks: any) => {
      cachedCallbacks = callbacks;
      return mockSession;
    }) as any);

    render(<LiveAnalyst report={mockReport} onClose={onClose} onConnected={onConnected} />);

    await waitFor(() => {
      expect(cachedCallbacks).toBeDefined();
    });

    await act(async () => {
      await cachedCallbacks.onopen();
    });

    expect(screen.getByText("Analyst connected. You can speak now.")).toBeInTheDocument();
    expect(onConnected).toHaveBeenCalled();

    const scriptProcessor = mockAudioContextInstance.createScriptProcessor.mock.results[0].value;
    expect(scriptProcessor.onaudioprocess).toBeDefined();

    const mockChannelData = new Float32Array(4096);
    const mockAudioProcessEvent = {
      inputBuffer: {
        getChannelData: vi.fn().mockReturnValue(mockChannelData),
      },
    };

    act(() => {
      scriptProcessor.onaudioprocess(mockAudioProcessEvent);
    });

    expect(mockSession.sendRealtimeInput).toHaveBeenCalled();

    const buttons = screen.getAllByRole("button");
    const muteBtn = buttons.find((btn) => btn.querySelector("svg") !== null);
    if (muteBtn) {
      fireEvent.click(muteBtn); // Mute
      fireEvent.click(muteBtn); // Unmute
    }

    const mockMessage = {
      serverContent: {
        modelTurn: {
          parts: [
            {
              inlineData: {
                data: "base64audiobytes",
              },
            },
          ],
        },
      },
    };

    const mockAudioBuffer = { duration: 1.5 };
    mockAudioContextInstance.decodeAudioData = vi.fn().mockResolvedValue(mockAudioBuffer);

    const mockBufferSource = {
      connect: vi.fn(),
      addEventListener: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    mockAudioContextInstance.createBufferSource = vi.fn().mockReturnValue(mockBufferSource);

    await act(async () => {
      await cachedCallbacks.onmessage(mockMessage);
    });

    expect(mockAudioContextInstance.createBufferSource).toHaveBeenCalled();
    expect(mockBufferSource.start).toHaveBeenCalled();

    const mockInterruptMessage = {
      serverContent: {
        interrupted: true,
      },
    };

    await act(async () => {
      await cachedCallbacks.onmessage(mockInterruptMessage);
    });

    expect(mockBufferSource.stop).toHaveBeenCalled();
  });

  it("handles onClose when close button is clicked", () => {
    const sessionPromise = new Promise(() => {});
    vi.mocked(connectLiveAnalyst).mockReturnValueOnce(sessionPromise as any);

    render(<LiveAnalyst report={mockReport} onClose={onClose} onConnected={onConnected} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(onClose).toHaveBeenCalled();
  });
});
