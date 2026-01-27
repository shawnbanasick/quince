import { describe, it, expect } from "vitest";
import msToTime from "../millisecondsToTime";

describe("msToTime utility", () => {
  it("should format 0 milliseconds correctly", () => {
    expect(msToTime(0)).toBe("00:00:00");
  });

  it("should format seconds correctly", () => {
    expect(msToTime(5000)).toBe("00:00:05");
    expect(msToTime(59000)).toBe("00:00:59");
  });

  it("should format minutes correctly", () => {
    expect(msToTime(60000)).toBe("00:01:00");
    expect(msToTime(3540000)).toBe("00:59:00");
  });

  it("should format hours correctly", () => {
    expect(msToTime(3600000)).toBe("01:00:00");
    expect(msToTime(36000000)).toBe("10:00:00");
  });

  it("should handle complex time durations", () => {
    // 1 hour, 1 minute, 1 second = 3600000 + 60000 + 1000
    expect(msToTime(3661000)).toBe("01:01:01");
  });

  it("should truncate millisecond remainders (due to bitwise OR)", () => {
    // 1.5 seconds should still show as 01 seconds
    expect(msToTime(1500)).toBe("00:00:01");
  });

  it("should handle large hour values beyond 24h", () => {
    // 25 hours = 90,000,000 ms
    expect(msToTime(90000000)).toBe("25:00:00");
  });
});
