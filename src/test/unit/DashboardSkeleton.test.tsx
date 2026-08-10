import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardSkeleton, { NoReportState } from "@/features/dashboard/DashboardSkeleton";

describe("DashboardSkeleton", () => {
  it("renders skeleton blocks", () => {
    const { container } = render(<DashboardSkeleton />);
    const blocks = container.querySelectorAll(".animate-pulse");
    expect(blocks.length).toBeGreaterThan(0);
  });
});

describe("NoReportState", () => {
  it("renders standby message and launch button", () => {
    render(<NoReportState onSwitchToUpload={() => {}} />);
    expect(screen.getByText("Intelligence Engine Standby")).toBeInTheDocument();
    expect(screen.getByText("Launch New Analysis")).toBeInTheDocument();
  });

  it("calls onSwitchToUpload when button clicked", () => {
    const fn = vi.fn();
    render(<NoReportState onSwitchToUpload={fn} />);
    fireEvent.click(screen.getByText("Launch New Analysis"));
    expect(fn).toHaveBeenCalled();
  });
});
