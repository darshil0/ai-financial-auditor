import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

const ThrowOnRender = ({ message }: { message: string }) => {
  throw new Error(message);
};

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <p>Safe child</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Safe child")).toBeInTheDocument();
  });

  it("renders error UI when child throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowOnRender message="boom" />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
    spy.mockRestore();
  });

  it("reloads the page when reload button is clicked", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadSpy },
      writable: true,
    });
    render(
      <ErrorBoundary>
        <ThrowOnRender message="err" />
      </ErrorBoundary>,
    );
    fireEvent.click(screen.getByText("Reload App"));
    expect(reloadSpy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
