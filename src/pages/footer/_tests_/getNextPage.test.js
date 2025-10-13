import { describe, it, expect } from "vitest";
import getNextPage from "../getNextPage";

describe("getNextPage", () => {
  describe("consent page navigation", () => {
    it("returns /landing when showConsent is true", () => {
      const result = getNextPage("consent", false, false, true, false);
      expect(result).toBe("/landing");
    });

    it("returns /presort when showConsent is false", () => {
      const result = getNextPage("consent", false, false, false, false);
      expect(result).toBe("/presort");
    });

    it("returns /presort when showConsent is undefined", () => {
      const result = getNextPage("consent", false, false, undefined, false);
      expect(result).toBe("/presort");
    });

    it("returns /presort when showConsent is null", () => {
      const result = getNextPage("consent", false, false, null, false);
      expect(result).toBe("/presort");
    });
  });

  describe("landing page navigation", () => {
    it("always returns /presort", () => {
      const result = getNextPage("landing", false, false, false, false);
      expect(result).toBe("/presort");
    });

    it("returns /presort regardless of other flags", () => {
      const result = getNextPage("landing", true, true, true, true);
      expect(result).toBe("/presort");
    });
  });

  describe("presort page navigation", () => {
    it("returns /thin when showThinning is true", () => {
      const result = getNextPage("presort", false, false, false, true);
      expect(result).toBe("/thin");
    });

    it("returns /sort when showThinning is false", () => {
      const result = getNextPage("presort", false, false, false, false);
      expect(result).toBe("/sort");
    });

    it("returns /sort when showThinning is undefined", () => {
      const result = getNextPage("presort", false, false, false, undefined);
      expect(result).toBe("/sort");
    });

    it("returns /sort when showThinning is null", () => {
      const result = getNextPage("presort", false, false, false, null);
      expect(result).toBe("/sort");
    });
  });

  describe("thin page navigation", () => {
    it("always returns /sort", () => {
      const result = getNextPage("thin", false, false, false, false);
      expect(result).toBe("/sort");
    });

    it("returns /sort regardless of other flags", () => {
      const result = getNextPage("thin", true, true, true, true);
      expect(result).toBe("/sort");
    });
  });

  describe("sort page navigation", () => {
    it("returns /postsort when showPostsort is true", () => {
      const result = getNextPage("sort", true, false, false, false);
      expect(result).toBe("/postsort");
    });

    it("returns /survey when showPostsort is false and showSurvey is true", () => {
      const result = getNextPage("sort", false, true, false, false);
      expect(result).toBe("/survey");
    });

    it("returns /submit when both showPostsort and showSurvey are false", () => {
      const result = getNextPage("sort", false, false, false, false);
      expect(result).toBe("/submit");
    });

    it("returns /postsort when both showPostsort and showSurvey are true", () => {
      const result = getNextPage("sort", true, true, false, false);
      expect(result).toBe("/postsort");
    });

    it("returns /submit when showPostsort and showSurvey are undefined", () => {
      const result = getNextPage("sort", undefined, undefined, false, false);
      expect(result).toBe("/submit");
    });
  });

  describe("postsort page navigation", () => {
    it("returns /survey when showSurvey is true", () => {
      const result = getNextPage("postsort", false, true, false, false);
      expect(result).toBe("/survey");
    });

    it("returns /submit when showSurvey is false", () => {
      const result = getNextPage("postsort", false, false, false, false);
      expect(result).toBe("/submit");
    });

    it("returns /submit when showSurvey is undefined", () => {
      const result = getNextPage("postsort", false, undefined, false, false);
      expect(result).toBe("/submit");
    });

    it("returns /submit when showSurvey is null", () => {
      const result = getNextPage("postsort", false, null, false, false);
      expect(result).toBe("/submit");
    });
  });

  describe("survey page navigation", () => {
    it("always returns /submit", () => {
      const result = getNextPage("survey", false, false, false, false);
      expect(result).toBe("/submit");
    });

    it("returns /submit regardless of other flags", () => {
      const result = getNextPage("survey", true, true, true, true);
      expect(result).toBe("/submit");
    });
  });

  describe("submit page navigation", () => {
    it("always returns /", () => {
      const result = getNextPage("submit", false, false, false, false);
      expect(result).toBe("/");
    });

    it("returns / regardless of other flags", () => {
      const result = getNextPage("submit", true, true, true, true);
      expect(result).toBe("/");
    });
  });

  describe("unknown page navigation", () => {
    it("returns /nopagefound for unknown page", () => {
      const result = getNextPage("unknown", false, false, false, false);
      expect(result).toBe("/nopagefound");
    });

    it("returns /nopagefound for empty string", () => {
      const result = getNextPage("", false, false, false, false);
      expect(result).toBe("/nopagefound");
    });

    it("returns /nopagefound for undefined currentPage", () => {
      const result = getNextPage(undefined, false, false, false, false);
      expect(result).toBe("/nopagefound");
    });

    it("returns /nopagefound for null currentPage", () => {
      const result = getNextPage(null, false, false, false, false);
      expect(result).toBe("/nopagefound");
    });

    it("returns /nopagefound for incorrect case", () => {
      const result = getNextPage("Landing", false, false, false, false);
      expect(result).toBe("/nopagefound");
    });

    it("returns /nopagefound for page with whitespace", () => {
      const result = getNextPage(" landing ", false, false, false, false);
      expect(result).toBe("/nopagefound");
    });
  });

  describe("complete navigation flow scenarios", () => {
    it("navigates full path with all features enabled", () => {
      // consent -> landing
      expect(getNextPage("consent", true, true, true, true)).toBe("/landing");

      // landing -> presort
      expect(getNextPage("landing", true, true, true, true)).toBe("/presort");

      // presort -> thin
      expect(getNextPage("presort", true, true, true, true)).toBe("/thin");

      // thin -> sort
      expect(getNextPage("thin", true, true, true, true)).toBe("/sort");

      // sort -> postsort
      expect(getNextPage("sort", true, true, true, true)).toBe("/postsort");

      // postsort -> survey
      expect(getNextPage("postsort", true, true, true, true)).toBe("/survey");

      // survey -> submit
      expect(getNextPage("survey", true, true, true, true)).toBe("/submit");

      // submit -> /
      expect(getNextPage("submit", true, true, true, true)).toBe("/");
    });

    it("navigates minimal path with all features disabled", () => {
      // consent -> presort (no consent page)
      expect(getNextPage("consent", false, false, false, false)).toBe("/presort");

      // presort -> sort (no thinning)
      expect(getNextPage("presort", false, false, false, false)).toBe("/sort");

      // sort -> submit (no postsort or survey)
      expect(getNextPage("sort", false, false, false, false)).toBe("/submit");

      // submit -> /
      expect(getNextPage("submit", false, false, false, false)).toBe("/");
    });

    it("navigates with only postsort enabled", () => {
      expect(getNextPage("sort", true, false, false, false)).toBe("/postsort");
      expect(getNextPage("postsort", false, false, false, false)).toBe("/submit");
    });

    it("navigates with only survey enabled", () => {
      expect(getNextPage("sort", false, true, false, false)).toBe("/survey");
      expect(getNextPage("survey", false, true, false, false)).toBe("/submit");
    });

    it("navigates with only thinning enabled", () => {
      expect(getNextPage("presort", false, false, false, true)).toBe("/thin");
      expect(getNextPage("thin", false, false, false, true)).toBe("/sort");
    });

    it("navigates with postsort and survey enabled", () => {
      expect(getNextPage("sort", true, true, false, false)).toBe("/postsort");
      expect(getNextPage("postsort", true, true, false, false)).toBe("/survey");
      expect(getNextPage("survey", true, true, false, false)).toBe("/submit");
    });
  });

  describe("edge cases with boolean values", () => {
    it("handles string 'true' as falsy", () => {
      const result = getNextPage("presort", "true", "true", "true", "true");
      expect(result).toBe("/sort");
    });

    it("handles number 0 as falsy", () => {
      const result = getNextPage("presort", 0, 0, 0, 0);
      expect(result).toBe("/sort");
    });

    it("handles empty string as falsy", () => {
      const result = getNextPage("presort", "", "", "", "");
      expect(result).toBe("/sort");
    });
  });

  describe("parameter order verification", () => {
    it("has correct parameter order: showPostsort, showSurvey, showConsent, showThinning", () => {
      // Testing that parameters are in the expected order
      const result = getNextPage("consent", false, false, true, false);
      expect(result).toBe("/landing");
    });

    it("verifies showPostsort is first parameter", () => {
      const result = getNextPage("sort", true, false, false, false);
      expect(result).toBe("/postsort");
    });

    it("verifies showSurvey is second parameter", () => {
      const result = getNextPage("sort", false, true, false, false);
      expect(result).toBe("/survey");
    });

    it("verifies showConsent is third parameter", () => {
      const result = getNextPage("consent", false, false, true, false);
      expect(result).toBe("/landing");
    });

    it("verifies showThinning is fourth parameter", () => {
      const result = getNextPage("presort", false, false, false, true);
      expect(result).toBe("/thin");
    });
  });

  describe("all valid pages return valid paths", () => {
    it.each([
      ["consent", "/landing", "/presort"],
      ["landing", "/presort"],
      ["presort", "/thin", "/sort"],
      ["thin", "/sort"],
      ["sort", "/postsort", "/survey", "/submit"],
      ["postsort", "/survey", "/submit"],
      ["survey", "/submit"],
      ["submit", "/"],
    ])("page '%s' returns valid navigation paths", (page, ...expectedPaths) => {
      // Test with various flag combinations
      const allFalse = getNextPage(page, false, false, false, false);
      const allTrue = getNextPage(page, true, true, true, true);

      expect(expectedPaths).toContain(allFalse);
      expect(expectedPaths).toContain(allTrue);
    });
  });
});
