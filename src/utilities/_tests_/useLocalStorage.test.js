import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "../useLocalStorage"; // Adjust path as needed

describe("useLocalStorage", () => {
  const TEST_KEY = "test-key";
  const TEST_VALUE = { name: "Gojo" };

  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean slate
    window.localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  it("should return initialValue if localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, TEST_VALUE));

    expect(result.current[0]).toEqual(TEST_VALUE);
    expect(window.localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(TEST_VALUE));
  });

  it("should return existing value from localStorage if it exists", () => {
    const existingValue = { name: "Sukuna" };
    window.localStorage.setItem(TEST_KEY, JSON.stringify(existingValue));

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, TEST_VALUE));

    expect(result.current[0]).toEqual(existingValue);
  });

  it("should update localStorage when setValue is called", () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, TEST_VALUE));
    const newValue = { name: "Geto" };

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(JSON.parse(window.localStorage.getItem(TEST_KEY))).toEqual(newValue);
  });

  it("should support functional updates (matching useState API)", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));

    act(() => {
      // Pass a function to the setter
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(window.localStorage.getItem("count")).toBe("1");
  });

  it("should handle localStorage errors gracefully", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Simulate a broken localStorage (e.g., QuotaExceededError or blocked cookies)
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage full");
    });

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, TEST_VALUE));

    act(() => {
      result.current[1]("some-new-value");
    });

    // Should still update the internal state even if storage fails
    expect(result.current[0]).toBe("some-new-value");
    expect(consoleSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
