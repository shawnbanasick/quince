import { describe, it, expect } from "vitest";
import calcProgressScore from "../calcProgressScore";

describe("calcProgressScore", () => {
  it("returns 10 for landing page", () => {
    const result = calcProgressScore("landing");
    expect(result).toBe(10);
  });

  it("returns 15 for consent page", () => {
    const result = calcProgressScore("consent");
    expect(result).toBe(15);
  });

  it("returns 20 for presort page", () => {
    const result = calcProgressScore("presort");
    expect(result).toBe(20);
  });

  it("returns 40 for thin page", () => {
    const result = calcProgressScore("thin");
    expect(result).toBe(40);
  });

  it("returns 60 for sort page", () => {
    const result = calcProgressScore("sort");
    expect(result).toBe(60);
  });

  it("returns 80 for postsort page", () => {
    const result = calcProgressScore("postsort");
    expect(result).toBe(80);
  });

  it("returns 90 for survey page", () => {
    const result = calcProgressScore("survey");
    expect(result).toBe(90);
  });

  it("returns 100 for submit page", () => {
    const result = calcProgressScore("submit");
    expect(result).toBe(100);
  });

  describe("edge cases", () => {
    it("returns undefined for unknown page", () => {
      const result = calcProgressScore("unknown");
      expect(result).toBeUndefined();
    });

    it("returns undefined for empty string", () => {
      const result = calcProgressScore("");
      expect(result).toBeUndefined();
    });

    it("returns undefined for null", () => {
      const result = calcProgressScore(null);
      expect(result).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
      const result = calcProgressScore(undefined);
      expect(result).toBeUndefined();
    });

    it("is case sensitive", () => {
      const result = calcProgressScore("Landing");
      expect(result).toBeUndefined();
    });

    it("does not match with extra whitespace", () => {
      const result = calcProgressScore(" landing ");
      expect(result).toBeUndefined();
    });

    it("returns undefined for number input", () => {
      const result = calcProgressScore(123);
      expect(result).toBeUndefined();
    });

    it("returns undefined for object input", () => {
      const result = calcProgressScore({ page: "landing" });
      expect(result).toBeUndefined();
    });
  });

  describe("progress score progression", () => {
    it("returns increasing scores in page order", () => {
      const pages = [
        "landing",
        "consent",
        "presort",
        "thin",
        "sort",
        "postsort",
        "survey",
        "submit",
      ];

      const scores = pages.map((page) => calcProgressScore(page));

      // Check that each score is greater than the previous
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeGreaterThan(scores[i - 1]);
      }
    });

    it("starts at 10 and ends at 100", () => {
      expect(calcProgressScore("landing")).toBe(10);
      expect(calcProgressScore("submit")).toBe(100);
    });

    it("has expected gaps between pages", () => {
      expect(calcProgressScore("consent") - calcProgressScore("landing")).toBe(5);
      expect(calcProgressScore("presort") - calcProgressScore("consent")).toBe(5);
      expect(calcProgressScore("thin") - calcProgressScore("presort")).toBe(20);
      expect(calcProgressScore("sort") - calcProgressScore("thin")).toBe(20);
      expect(calcProgressScore("postsort") - calcProgressScore("sort")).toBe(20);
      expect(calcProgressScore("survey") - calcProgressScore("postsort")).toBe(10);
      expect(calcProgressScore("submit") - calcProgressScore("survey")).toBe(10);
    });
  });

  describe("all valid pages", () => {
    it.each([
      ["landing", 10],
      ["consent", 15],
      ["presort", 20],
      ["thin", 40],
      ["sort", 60],
      ["postsort", 80],
      ["survey", 90],
      ["submit", 100],
    ])("returns %i for page '%s'", (page, expectedScore) => {
      expect(calcProgressScore(page)).toBe(expectedScore);
    });
  });

  describe("type checking", () => {
    it("handles string input correctly", () => {
      const result = calcProgressScore("landing");
      expect(typeof result).toBe("number");
    });

    it("returns a number for valid pages", () => {
      const pages = [
        "landing",
        "consent",
        "presort",
        "thin",
        "sort",
        "postsort",
        "survey",
        "submit",
      ];

      pages.forEach((page) => {
        const result = calcProgressScore(page);
        expect(typeof result).toBe("number");
      });
    });
  });
});
