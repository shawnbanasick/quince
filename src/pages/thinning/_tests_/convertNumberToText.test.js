import { describe, it, expect } from "vitest";
import convertNumberToText from "../convertNumberToText";

describe("convertNumberToText", () => {
  describe("edge cases", () => {
    it('should return "zero" for 0', () => {
      expect(convertNumberToText(0)).toBe("zero");
    });

    it("should return undefined for negative numbers", () => {
      expect(convertNumberToText(-1)).toBeUndefined();
      expect(convertNumberToText(-100)).toBeUndefined();
    });
  });

  describe("single digits (1-9)", () => {
    it('should convert 1 to "one"', () => {
      expect(convertNumberToText(1)).toBe("one");
    });

    it('should convert 5 to "five"', () => {
      expect(convertNumberToText(5)).toBe("five");
    });

    it('should convert 9 to "nine"', () => {
      expect(convertNumberToText(9)).toBe("nine");
    });
  });

  describe("teens (10-19)", () => {
    it('should convert 10 to "ten"', () => {
      expect(convertNumberToText(10)).toBe("ten");
    });

    it('should convert 13 to "thirteen"', () => {
      expect(convertNumberToText(13)).toBe("thirteen");
    });

    it('should convert 19 to "nineteen"', () => {
      expect(convertNumberToText(19)).toBe("nineteen");
    });
  });

  describe("tens (20-99)", () => {
    it('should convert 20 to "twenty"', () => {
      expect(convertNumberToText(20)).toBe("twenty");
    });

    it('should convert 25 to "twenty five"', () => {
      expect(convertNumberToText(25)).toBe("twenty five");
    });

    it('should convert 50 to "fifty"', () => {
      expect(convertNumberToText(50)).toBe("fifty");
    });

    it('should convert 73 to "seventy three"', () => {
      expect(convertNumberToText(73)).toBe("seventy three");
    });

    it('should convert 99 to "ninety nine"', () => {
      expect(convertNumberToText(99)).toBe("ninety nine");
    });
  });

  describe("hundreds (100-999)", () => {
    it('should convert 100 to "one hundred"', () => {
      expect(convertNumberToText(100)).toBe("one hundred");
    });

    it('should convert 105 to "one hundred five"', () => {
      expect(convertNumberToText(105)).toBe("one hundred five");
    });

    it('should convert 215 to "two hundred fifteen"', () => {
      expect(convertNumberToText(215)).toBe("two hundred fifteen");
    });

    it('should convert 342 to "three hundred forty two"', () => {
      expect(convertNumberToText(342)).toBe("three hundred forty two");
    });

    it('should convert 500 to "five hundred"', () => {
      expect(convertNumberToText(500)).toBe("five hundred");
    });

    it('should convert 999 to "nine hundred ninety nine"', () => {
      expect(convertNumberToText(999)).toBe("nine hundred ninety nine");
    });
  });

  describe("boundary cases", () => {
    it("should handle numbers at range boundaries", () => {
      expect(convertNumberToText(9)).toBe("nine");
      expect(convertNumberToText(10)).toBe("ten");
      expect(convertNumberToText(19)).toBe("nineteen");
      expect(convertNumberToText(20)).toBe("twenty");
      expect(convertNumberToText(99)).toBe("ninety nine");
      expect(convertNumberToText(100)).toBe("one hundred");
    });
  });
});
