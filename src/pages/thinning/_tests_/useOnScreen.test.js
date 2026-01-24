import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useOnScreen from "../useOnScreen"; // adjust path as needed

// 1. Mock the IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

window.IntersectionObserver = vi.fn((callback) => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  // Trigger the callback manually for testing
  trigger: (isIntersecting) => {
    callback([{ isIntersecting }]);
  },
}));

describe("useOnScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with false", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useOnScreen(ref));

    expect(result.current).toBe(false);
  });

  it("should call observe on the provided ref", () => {
    const element = document.createElement("div");
    const ref = { current: element };

    renderHook(() => useOnScreen(ref));

    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it("should update state when intersection changes", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useOnScreen(ref));

    // Get the instance of the observer created inside the hook
    vi.mocked(window.IntersectionObserver).mock.results[0].value;

    // Simulate an intersection event
    act(() => {
      // This calls the callback passed to IntersectionObserver
      const callback = vi.mocked(window.IntersectionObserver).mock.calls[0][0];
      callback([{ isIntersecting: true }]);
    });

    expect(result.current).toBe(true);
  });

  it("should disconnect on unmount", () => {
    const ref = { current: document.createElement("div") };
    const { unmount } = renderHook(() => useOnScreen(ref));

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
