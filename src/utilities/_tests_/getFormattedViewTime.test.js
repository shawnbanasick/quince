import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import getFormattedViewTime from "../getFormattedViewTime";

describe("getFormattedViewTime", () => {
  beforeEach(() => {
    // Tell Vitest to use fake versions of standard timer functions
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it("should format the date and time correctly for single-digit minutes and seconds", () => {
    // Set system time to: Jan 1, 2026, 05:05:05
    const mockDate = new Date(2026, 0, 1, 5, 5, 5);
    vi.setSystemTime(mockDate);

    const result = getFormattedViewTime();

    // Format: DD/MM/YYYY @ HH:mm:ss
    expect(result).toBe("1/1/2026 @ 5:05:05");
  });

  it("should format the date and time correctly for double-digit minutes and seconds", () => {
    // Set system time to: Oct 25, 2026, 15:30:45
    const mockDate = new Date(2026, 9, 25, 15, 30, 45);
    vi.setSystemTime(mockDate);

    const result = getFormattedViewTime();

    expect(result).toBe("25/10/2026 @ 15:30:45");
  });

  it("should handle the end of the year correctly", () => {
    // Set system time to: Dec 31, 2026, 23:59:59
    const mockDate = new Date(2026, 11, 31, 23, 59, 59);
    vi.setSystemTime(mockDate);

    const result = getFormattedViewTime();

    expect(result).toBe("31/12/2026 @ 23:59:59");
  });
});
