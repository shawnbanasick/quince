import { describe, it, expect, beforeEach, afterEach } from "vitest";
import checkForIeBrowser from "../checkForIeBrowser";

describe("checkForIeBrowser", () => {
  let originalUserAgent;

  beforeEach(() => {
    // Save original userAgent
    originalUserAgent = window.navigator.userAgent;
  });

  afterEach(() => {
    // Restore original userAgent
    Object.defineProperty(window.navigator, "userAgent", {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
  });

  describe("IE 10 or older detection", () => {
    it("should detect IE 10", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE 9", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE 8", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE 7", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE 6", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });
  });

  describe("IE 11 detection (Trident)", () => {
    it("should detect IE 11 on Windows 10", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE 11 on Windows 8.1", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE 11 on Windows 7", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE 11 with different Trident version", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 6.3; Trident/6.0; rv:11.0) like Gecko",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });
  });

  describe("Non-IE browser detection", () => {
    it("should return false for Chrome", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should return false for Firefox", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should return false for Safari", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should return false for Edge (Chromium-based)", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should return false for Opera", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/77.0.4054.203",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should return false for Mobile Safari (iOS)", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should return false for Chrome Mobile (Android)", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty user agent string", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it('should handle user agent with "MSIE" substring but not IE', () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 NotMSIEBrowser",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it('should handle user agent with "Trident" substring but not IE', () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 NotTridentBrowser",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should detect IE when MSIE appears anywhere in user agent", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Some text before MSIE 10.0 some text after",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE when Trident appears anywhere in user agent", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Some text before Trident/7.0 some text after",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should be case-sensitive for MSIE", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (compatible; msie 10.0; Windows NT 6.2)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should be case-sensitive for Trident", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; trident/7.0; rv:11.0) like Gecko",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });
  });

  describe("Multiple browser detection patterns", () => {
    it("should return true if both MSIE and Trident are present (prioritize MSIE)", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE if only MSIE is present", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE if only Trident is present", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });
  });

  describe("Real-world user agent strings", () => {
    it("should detect IE 10 with real UA string", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should detect IE 11 with real UA string", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should not detect new Edge (Chromium) with real UA string", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should not detect Chrome with real UA string", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });

    it("should not detect Firefox with real UA string", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(false);
    });
  });

  describe("Function consistency", () => {
    it("should return consistent results for same user agent", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2)",
        writable: true,
        configurable: true,
      });

      const result1 = checkForIeBrowser();
      const result2 = checkForIeBrowser();
      const result3 = checkForIeBrowser();

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe(true);
    });

    it("should return boolean value", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(typeof result).toBe("boolean");
    });

    it("should only return true or false", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2)",
        writable: true,
        configurable: true,
      });

      const resultIE = checkForIeBrowser();
      expect([true, false]).toContain(resultIE);

      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 Chrome/91.0",
        writable: true,
        configurable: true,
      });

      const resultChrome = checkForIeBrowser();
      expect([true, false]).toContain(resultChrome);
    });
  });

  describe("Special characters in user agent", () => {
    it("should handle special characters before MSIE", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Test@#$%MSIE 10.0",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should handle special characters before Trident", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Test@#$%Trident/7.0",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });

    it("should handle unicode characters in user agent", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 🎉 (compatible; MSIE 10.0; Windows NT 6.2)",
        writable: true,
        configurable: true,
      });

      const result = checkForIeBrowser();
      expect(result).toBe(true);
    });
  });
});
