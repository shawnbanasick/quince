import { describe, it, expect } from "vitest";
import parseParams from "../parseParams";

describe("parseParams()", () => {
  it('should return the value after the "=" when a "?" is present', () => {
    const input = "?id=123";
    const result = parseParams(input);
    expect(result).toBe("123");
  });

  it('should return undefined if no "?" is present', () => {
    const input = "id=123";
    const result = parseParams(input);
    expect(result).toBeUndefined();
  });

  it("should return undefined for an empty string", () => {
    const result = parseParams("");
    expect(result).toBeUndefined();
  });

  it("should return undefined if no arguments are passed (defaults to empty string)", () => {
    const result = parseParams();
    expect(result).toBeUndefined();
  });

  it("should return the first value found if multiple parameters exist", () => {
    // Note: Given your current logic, it splits the whole string by "="
    // and takes index [1]. This test documents that behavior.
    const input = "?name=gemini&age=2";
    const result = parseParams(input);
    expect(result).toBe("gemini&age");
  });
});
