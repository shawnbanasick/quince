import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLongPress from "../useLongPress"; // Adjust path accordingly

describe("useLongPress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {}); // Silence logs in terminal
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with no action", () => {
    const { result } = renderHook(() => useLongPress());
    expect(result.current.action).toBeUndefined();
  });

  it('should register a "click" action when mouse is released quickly', () => {
    const { result } = renderHook(() => useLongPress());

    act(() => {
      result.current.handlers.onMouseDown();
      // Fast forward less than 500ms
      vi.advanceTimersByTime(200);
      result.current.handlers.onMouseUp();
      result.current.handlers.onClick();
    });

    expect(result.current.action).toBe("click");
  });

  it('should register a "longpress" action after 500ms', () => {
    const { result } = renderHook(() => useLongPress());

    act(() => {
      result.current.handlers.onMouseDown();
      // Fast forward exactly the timeout duration
      vi.advanceTimersByTime(500);
    });

    expect(result.current.action).toBe("longpress");
  });

  it('should NOT trigger "click" if it was a long press', () => {
    const { result } = renderHook(() => useLongPress());

    act(() => {
      result.current.handlers.onMouseDown();
      vi.advanceTimersByTime(500); // Triggers longpress
      result.current.handlers.onMouseUp();
      result.current.handlers.onClick();
    });

    // Despite onClick being called, the logic should block it
    expect(result.current.action).toBe("longpress");
    expect(result.current.action).not.toBe("click");
  });

  it("should handle touch events similarly to mouse events", () => {
    const { result } = renderHook(() => useLongPress());

    act(() => {
      result.current.handlers.onTouchStart();
      vi.advanceTimersByTime(500);
    });

    expect(result.current.action).toBe("longpress");
  });

  it("should clear timer if touch ends early", () => {
    const { result } = renderHook(() => useLongPress());

    act(() => {
      result.current.handlers.onTouchStart();
      vi.advanceTimersByTime(100);
      result.current.handlers.onTouchEnd();
      vi.advanceTimersByTime(400); // Total 500ms has passed since start
    });

    // Action should still be undefined because timer was cleared
    expect(result.current.action).toBeUndefined();
  });
});
