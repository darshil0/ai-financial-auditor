import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "@/shared/components/Sidebar";
import { AppView } from "@/shared/types";

describe("Sidebar", () => {
  const baseProps = {
    view: AppView.DASHBOARD,
    setView: vi.fn(),
    isOpen: true,
    onRunDiagnostics: vi.fn(),
    reportCount: 0,
  };

  it("renders all nav items", () => {
    render(<Sidebar {...baseProps} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Upload Report")).toBeInTheDocument();
    expect(screen.getByText("Comparison")).toBeInTheDocument();
    expect(screen.getByText("Historical Reports")).toBeInTheDocument();
  });

  it("calls setView when a nav item is clicked", () => {
    const setView = vi.fn();
    render(<Sidebar {...baseProps} setView={setView} />);
    fireEvent.click(screen.getByText("Upload Report"));
    expect(setView).toHaveBeenCalledWith(AppView.UPLOAD);
  });

  it("disables Comparison when fewer than 2 reports", () => {
    render(<Sidebar {...baseProps} reportCount={1} />);
    const compBtn = screen.getByText("Comparison").closest("button");
    expect(compBtn).toHaveAttribute("title", "Requires at least 2 reports");
  });

  it("enables Comparison when 2+ reports", () => {
    const setView = vi.fn();
    render(<Sidebar {...baseProps} reportCount={3} setView={setView} />);
    fireEvent.click(screen.getByText("Comparison"));
    expect(setView).toHaveBeenCalledWith(AppView.COMPARISON);
  });

  it("shows report count badge", () => {
    render(<Sidebar {...baseProps} reportCount={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onRunDiagnostics when diagnostics button is clicked", () => {
    const onRunDiagnostics = vi.fn();
    render(<Sidebar {...baseProps} onRunDiagnostics={onRunDiagnostics} />);
    fireEvent.click(screen.getByText("Run UI Diagnostics"));
    expect(onRunDiagnostics).toHaveBeenCalled();
  });
});
