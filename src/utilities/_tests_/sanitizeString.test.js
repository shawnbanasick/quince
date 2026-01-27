import { describe, it, expect, vi } from "vitest";
import sanitizeString from "../sanitizeString";

describe("sanitizeString()", () => {
  it("should escape standard HTML special characters", () => {
    const input = '<script>alert("xss & more")</script>';
    const expected = "&lt;script&gt;alert(&quot;xss &amp; more&quot;)&lt;&#x2F;script&gt;";

    expect(sanitizeString(input)).toBe(expected);
  });

  it("should handle single quotes and forward slashes", () => {
    const input = "It's a /path/";
    const expected = "It&#x27;s a &#x2F;path&#x2F;";

    expect(sanitizeString(input)).toBe(expected);
  });

  it("should remove non-printable control characters", () => {
    // \x00 is a Null byte, \x1F is a unit separator
    const input = "Hello\x00World\x1F";
    const expected = "HelloWorld";

    expect(sanitizeString(input)).toBe(expected);
  });

  it("should convert non-string inputs to strings and sanitize them", () => {
    expect(sanitizeString(123)).toBe("123");
    expect(sanitizeString(null)).toBe("null");
  });

  it("should return an empty string when given an empty string", () => {
    expect(sanitizeString("")).toBe("");
  });

  it("should log an error if string conversion fails", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Create an object that throws when converted to a string
    const badInput = {
      toString: () => {
        throw new Error("String conversion failed");
      },
    };

    sanitizeString(badInput);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
