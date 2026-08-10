import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import DiagnosticsOverlay from "@/shared/components/DiagnosticsOverlay";
import * as htmlToImage from "html-to-image";

vi.mock("html-to-image", () => ({
  toPng: vi.fn(),
}));

describe("DiagnosticsOverlay Component", () => {
  const onClose = vi.fn();
  const showErrorModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pending automated checks correctly", () => {
    render(<DiagnosticsOverlay onClose={onClose} showErrorModal={showErrorModal} />);
    expect(screen.getByText("UI Diagnostics")).toBeInTheDocument();
    expect(screen.getByText("Responsive Layout Check")).toBeInTheDocument();
    expect(screen.getByText("Color Palette Contrast")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<DiagnosticsOverlay onClose={onClose} showErrorModal={showErrorModal} />);
    const closeBtn = screen.getByLabelText("Close Diagnostics");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("runs automated sweep through pending, running, and pass states using fake timers", async () => {
    vi.useFakeTimers();

    render(<DiagnosticsOverlay onClose={onClose} showErrorModal={showErrorModal} />);
    const sweepBtn = screen.getByText("Run Automated Sweep");

    fireEvent.click(sweepBtn);

    // Advance timers asynchronously to execute each step in the loop
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(800);
      });
    }

    const passedBadges = screen.getAllByText("Passed");
    expect(passedBadges.length).toBe(5);

    vi.useRealTimers();
  });

  it("mocks html-to-image toPng and triggers download click on Generate Report", async () => {
    const linkClickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    vi.mocked(htmlToImage.toPng).mockResolvedValueOnce("data:image/png;base64,dummy-png-bytes");

    render(<DiagnosticsOverlay onClose={onClose} showErrorModal={showErrorModal} />);
    const genBtn = screen.getByText("Generate Report");

    fireEvent.click(genBtn);

    await waitFor(() => {
      expect(htmlToImage.toPng).toHaveBeenCalled();
      expect(linkClickSpy).toHaveBeenCalled();
    });

    linkClickSpy.mockRestore();
  });

  it("shows error modal when html-to-image toPng fails", async () => {
    vi.mocked(htmlToImage.toPng).mockRejectedValueOnce(new Error("Render Failed"));

    render(<DiagnosticsOverlay onClose={onClose} showErrorModal={showErrorModal} />);
    const genBtn = screen.getByText("Generate Report");

    fireEvent.click(genBtn);

    await waitFor(() => {
      expect(showErrorModal).toHaveBeenCalledWith(
        "Could not generate the report. Please check the console for errors.",
      );
    });
  });
});
