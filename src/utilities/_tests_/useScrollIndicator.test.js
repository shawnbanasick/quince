import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useScrollIndicator from "../useScrollIndicator"; // Adjust path as needed

describe("useScrollIndicator", () => {
  let mockElement;

  beforeEach(() => {
    // Setup a mock element with necessary properties
    mockElement = {
      scrollHeight: 200,
      clientHeight: 100,
      scrollTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // Mock ResizeObserver and MutationObserver which aren't in JSDOM by default
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    window.MutationObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }));

    vi.useFakeTimers();
  });

  const getRef = (el) => ({ current: el });

  it("should initialize with false values", () => {
    const { result } = renderHook(() => useScrollIndicator(getRef(null)));

    expect(result.current.hasScrollableContent).toBe(false);
    expect(result.current.isAtBottom).toBe(false);
    expect(result.current.showIndicator).toBe(false);
  });

  it("should detect scrollable content after timeout", () => {
    const { result } = renderHook(() => useScrollIndicator(getRef(mockElement)));

    // Fast-forward the setTimeout(checkScrollable, 100)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.hasScrollableContent).toBe(true);
    expect(result.current.showIndicator).toBe(true);
    expect(result.current.isAtBottom).toBe(false);
  });

  it("should update state when scrolled to the bottom", () => {
    const { result } = renderHook(() => useScrollIndicator(getRef(mockElement)));

    // Simulate scrolling to bottom
    act(() => {
      mockElement.scrollTop = 100; // scrollHeight(200) - clientHeight(100)
      vi.advanceTimersByTime(100);
    });

    // Manually trigger the scroll listener if needed,
    // but checkScrollable is also called in the timeout
    expect(result.current.isAtBottom).toBe(true);
    expect(result.current.showIndicator).toBe(false);
  });

  it("should cleanup observers and listeners on unmount", () => {
    const disconnectResize = vi.fn();
    const disconnectMutation = vi.fn();

    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: disconnectResize,
    }));

    window.MutationObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: disconnectMutation,
    }));

    const { unmount } = renderHook(() => useScrollIndicator(getRef(mockElement)));

    unmount();

    expect(mockElement.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(disconnectResize).toHaveBeenCalled();
    expect(disconnectMutation).toHaveBeenCalled();
  });
});
