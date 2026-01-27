import { describe, it, expect } from "vitest";
import stringToBoolean from "../stringToBoolean"; // Adjust the path as needed

describe("stringToBoolean", () => {
  it('should return true for the string "true"', () => {
    expect(stringToBoolean("true")).toBe(true);
  });

  it('should return false for explicit "false" strings', () => {
    expect(stringToBoolean("false")).toBe(false);
    expect(stringToBoolean("0")).toBe(false);
    expect(stringToBoolean("null")).toBe(false);
    expect(stringToBoolean("undefined")).toBe(false);
  });

  describe("default truthy behavior", () => {
    it('should return true for non-empty strings that are not "false" keywords', () => {
      expect(stringToBoolean("hello")).toBe(true);
      expect(stringToBoolean("1")).toBe(true);
      expect(stringToBoolean("yes")).toBe(true);
    });

    it("should return false for an empty string", () => {
      expect(stringToBoolean("")).toBe(false);
    });
  });

  it("should handle non-string inputs gracefully via truthiness", () => {
    // Note: Since the parameter is named 'str', we assume it's a string,
    // but JS allows passing anything.
    expect(stringToBoolean(undefined)).toBe(false);
    expect(stringToBoolean(null)).toBe(false);
  });
});
