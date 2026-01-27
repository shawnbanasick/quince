import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import getCurrentDateTime from "../getCurrentDateTime";

describe("getCurrentDateTime", () => {
  beforeEach(() => {
    // Tell Vitest to use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it("should format a standard date correctly", () => {
    // Set system time to: 2026/05/20 @ 14:30:15
    const mockDate = new Date(2026, 4, 20, 14, 30, 15);
    vi.setSystemTime(mockDate);

    const result = getCurrentDateTime();

    // Month is 4 (May) in the mock, so function should return 5
    expect(result).toBe("2026/5/20@14:30:15");
  });

  it("should pad single-digit minutes and seconds with leading zeros", () => {
    // Set system time to: 2026/01/01 @ 09:05:02
    const mockDate = new Date(2026, 0, 1, 9, 5, 2);
    vi.setSystemTime(mockDate);

    const result = getCurrentDateTime();

    // Month is 0 (Jan), so function returns 1.
    // Minutes and Seconds should be "05" and "02".
    expect(result).toBe("2026/1/1@9:05:02");
  });

  it("should handle the transition to the last second of the year", () => {
    const mockDate = new Date(2025, 11, 31, 23, 59, 59);
    vi.setSystemTime(mockDate);

    const result = getCurrentDateTime();
    expect(result).toBe("2025/12/31@23:59:59");
  });
});
