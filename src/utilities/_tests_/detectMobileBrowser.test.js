import { describe, it, expect, vi, afterEach } from "vitest";
import mobileCheck from "../detectMobileBrowser";

describe("mobileCheck utility", () => {
  // We mock the navigator object to control the userAgent
  const setUA = (userAgent) => {
    vi.stubGlobal("navigator", {
      userAgent,
      vendor: "",
    });
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return true for a standard iPhone user agent", () => {
    setUA(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    );
    expect(mobileCheck()).toBe(true);
  });

  it("should return true for an Android mobile device", () => {
    setUA(
      "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36",
    );
    expect(mobileCheck()).toBe(true);
  });

  it("should return true for specialized mobile browsers (Opera Mini)", () => {
    setUA(
      "Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23; U; en) Presto/2.5.24 Version/10.10",
    );
    expect(mobileCheck()).toBe(true);
  });

  it("should return false for a standard Desktop Chrome browser", () => {
    setUA(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );
    expect(mobileCheck()).toBe(false);
  });

  it("should return false for a Desktop Safari browser on macOS", () => {
    setUA(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    );
    expect(mobileCheck()).toBe(false);
  });

  it('should handle the 4-character prefix check (e.g., "palm")', () => {
    setUA("palm"); // Triggers the .substr(0, 4) check
    expect(mobileCheck()).toBe(true);
  });
});
