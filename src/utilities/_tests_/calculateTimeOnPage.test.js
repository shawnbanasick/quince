import { describe, it, expect, vi, beforeEach } from "vitest";
import calculateTimeOnPage from "../calculateTimeOnPage";

// 1. Mock the external dependencies
vi.mock("../millisecondsToTime", () => ({
  default: vi.fn((ms) => `formatted-${ms}`),
}));
vi.mock("../getCurrentDateTime", () => ({
  default: vi.fn(() => "2026-01-26 18:00:00"),
}));
vi.mock("../millisecondsToTextTime", () => ({
  default: vi.fn((ms) => `${ms} text`),
}));

describe("calculateTimeOnPage", () => {
  beforeEach(() => {
    // Clear localStorage and mocks before every test
    localStorage.clear();
    vi.clearAllMocks();

    // Mock Date.now() to keep time consistent
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-26T18:15:00Z"));
  });

  it("should calculate and store duration when localStorage is empty", () => {
    const startTime = new Date("2026-01-26T18:00:00Z").getTime();
    const now = Date.now(); // 18:15:00
    const expectedDiff = now - startTime; // 15 minutes in ms

    calculateTimeOnPage(startTime, "Home", "HomePage");

    // Verify localStorage updates
    expect(localStorage.getItem("cumulativeHomeDuration")).toBe(expectedDiff.toString());
    expect(localStorage.getItem("lastAccessHomePage")).toBe("2026-01-26 18:00:00");
    expect(localStorage.getItem("timeOnHomePage")).toBe(`formatted-${expectedDiff}`);
    expect(localStorage.getItem("CumulativeTimeHomePage")).toBe(`${expectedDiff} text`);
  });

  it("should accumulate time if a previous duration exists in localStorage", () => {
    const existingDuration = 5000;
    localStorage.setItem("cumulativeProfileDuration", existingDuration.toString());

    const startTime = Date.now() - 1000; // 1 second ago
    const expectedNewTotal = existingDuration + 1000;

    calculateTimeOnPage(startTime, "Profile", "ProfilePage");

    expect(localStorage.getItem("cumulativeProfileDuration")).toBe(expectedNewTotal.toString());
    expect(localStorage.getItem("timeOnProfilePage")).toBe(`formatted-${expectedNewTotal}`);
  });

  it("should handle missing or undefined duration by defaulting to 0", () => {
    const startTime = Date.now();

    // Explicitly testing the "undefined" logic in your code
    calculateTimeOnPage(startTime, "Settings", "SettingsPage");

    const storedValue = localStorage.getItem("cumulativeSettingsDuration");
    expect(storedValue).toBe("0");
  });
});
