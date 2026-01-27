import { describe, it, expect } from "vitest";
import msToTime from "../millisecondsToTextTime";

describe("msToTime()", () => {
  it("should format 0 milliseconds correctly", () => {
    expect(msToTime(0)).toBe("00hr, 00min, 00sec");
  });

  it("should format seconds correctly", () => {
    // 5 seconds
    expect(msToTime(5000)).toBe("00hr, 00min, 05sec");
  });

  it("should format minutes and seconds correctly", () => {
    // 10 minutes and 30 seconds
    const tenMinsThirtySecs = 10 * 60 * 1000 + 30 * 1000;
    expect(msToTime(tenMinsThirtySecs)).toBe("00hr, 10min, 30sec");
  });

  it("should format hours, minutes, and seconds correctly", () => {
    // 1 hour, 45 minutes, and 12 seconds
    const duration = 1 * 3.6e6 + 45 * 6e4 + 12 * 1000;
    expect(msToTime(duration)).toBe("01hr, 45min, 12sec");
  });

  it("should truncate decimal milliseconds (floor)", () => {
    // 1.9 seconds should show as 1 second
    expect(msToTime(1900)).toBe("00hr, 00min, 01sec");
  });
});
