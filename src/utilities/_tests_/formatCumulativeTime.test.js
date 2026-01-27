import { describe, it, expect } from "vitest";
import formatCumulativeTime from "../formatCumulativeTime";

describe("formatCumulativeTime", () => {
  it("should format 0 milliseconds correctly", () => {
    const result = formatCumulativeTime(0);
    expect(result).toBe("0_hrs_0_mins_0_secs");
  });

  it("should format seconds correctly", () => {
    const oneSecond = 1000;
    const result = formatCumulativeTime(oneSecond);
    expect(result).toBe("0_hrs_0_mins_1_secs");
  });

  it("should format minutes and seconds correctly", () => {
    const time = 5 * 60 * 1000 + 30 * 1000; // 5 mins 30 secs
    const result = formatCumulativeTime(time);
    expect(result).toBe("0_hrs_5_mins_30_secs");
  });

  it("should format hours, minutes, and seconds correctly", () => {
    const time = 2 * 60 * 60 * 1000 + 15 * 60 * 1000 + 45000; // 2 hrs 15 mins 45 secs
    const result = formatCumulativeTime(time);
    expect(result).toBe("2_hrs_15_mins_45_secs");
  });

  it("should handle string inputs by converting them to numbers", () => {
    const result = formatCumulativeTime("5000");
    expect(result).toBe("0_hrs_0_mins_5_secs");
  });

  it("should reset hours after 24 hours due to UTC behavior", () => {
    // Note: Since you use d.getUTCHours(), 25 hours will return "1_hrs"
    const twentyFiveHours = 25 * 60 * 60 * 1000;
    const result = formatCumulativeTime(twentyFiveHours);
    expect(result).toBe("1_hrs_0_mins_0_secs");
  });
});
