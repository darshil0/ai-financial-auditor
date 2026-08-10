import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportUploader from "@/features/upload/ReportUploader";
import { analyzeEarningsReport } from "@/shared/services/geminiService";

vi.mock("@/shared/services/geminiService", () => ({
  analyzeEarningsReport: vi.fn(),
}));

describe("ReportUploader Component", () => {
  const onReportAdded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders uploader drop area correctly", () => {
    render(<ReportUploader onReportAdded={onReportAdded} />);
    expect(screen.getByText("Analyze Corporate Earnings")).toBeInTheDocument();
    expect(screen.getByText("Drop Report PDF")).toBeInTheDocument();
  });

  it("shows error when non-PDF file is selected", () => {
    const { container } = render(<ReportUploader onReportAdded={onReportAdded} />);
    const input = container.querySelector("input[type='file']") as HTMLInputElement;

    const file = new File(["dummy txt"], "test.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("Please upload a valid PDF file.")).toBeInTheDocument();
    expect(analyzeEarningsReport).not.toHaveBeenCalled();
  });

  it("shows error when file size exceeds 25MB limit", () => {
    const { container } = render(<ReportUploader onReportAdded={onReportAdded} />);
    const input = container.querySelector("input[type='file']") as HTMLInputElement;

    const largeFile = new File(["dummy content"], "large.pdf", { type: "application/pdf" });
    // Override the size property
    Object.defineProperty(largeFile, "size", { value: 26 * 1024 * 1024 });

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(
      screen.getByText("File exceeds the 25MB limit. Please compress or use a shorter report."),
    ).toBeInTheDocument();
    expect(analyzeEarningsReport).not.toHaveBeenCalled();
  });

  it("calls analyzeEarningsReport and triggers onReportAdded on success", async () => {
    let resolvePromise: any;
    const mockReport = { id: "report-123", companyName: "Success Corp" };
    const deferredPromise = new Promise((resolve) => {
      resolvePromise = () => resolve(mockReport);
    });
    vi.mocked(analyzeEarningsReport).mockReturnValueOnce(deferredPromise as any);

    const { container } = render(<ReportUploader onReportAdded={onReportAdded} />);
    const input = container.querySelector("input[type='file']") as HTMLInputElement;

    const validFile = new File(["dummy pdf bytes"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [validFile] } });

    expect(screen.getByText("Parsing Intelligence")).toBeInTheDocument();
    expect(screen.getByText("Gemini is conducting a deep-dive analysis...")).toBeInTheDocument();

    resolvePromise();

    await waitFor(() => {
      expect(analyzeEarningsReport).toHaveBeenCalledWith(validFile);
      expect(onReportAdded).toHaveBeenCalledWith(mockReport);
    });
  });

  it("displays custom error message on analysis failure", async () => {
    vi.mocked(analyzeEarningsReport).mockRejectedValueOnce(new Error("Network Error"));

    const { container } = render(<ReportUploader onReportAdded={onReportAdded} />);
    const input = container.querySelector("input[type='file']") as HTMLInputElement;

    const validFile = new File(["dummy pdf bytes"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(/Analysis failed. The PDF might be encrypted or formatted incorrectly/),
      ).toBeInTheDocument();
    });
  });
});
