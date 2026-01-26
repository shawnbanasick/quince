import { describe, it, expect, beforeEach, vi } from "vitest";
import addNoResultToPostsortResults from "../addNoResultToPostsortResults";

describe("addNoResultToPostsortResults", () => {
  let mockMapObj;
  let mockConfigObj;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();

    // Default mock data based on function logic
    mockMapObj = {
      qSortPattern: ["2", "3", "3", "2"], // lowCardNum is 2, highCardNum is 2
      qSortHeaders: ["-2", "-1", "1", "2"], // lowCardVal is -2, highCardVal is 2
    };

    mockConfigObj = {
      showSecondPosColumn: false,
      showSecondNegColumn: false,
    };
  });

  it('should add "no response" entries for missing high and low card items', () => {
    // Setup localStorage mocks
    localStorage.setItem(
      "noResponseCheckArrayHC1",
      JSON.stringify(["column2_0: stateA", "column2_1: stateB"]),
    );
    localStorage.setItem(
      "noResponseCheckArrayLC1",
      JSON.stringify(["column-2_0: stateC", "column-2_1: stateD"]),
    );

    const resultsPostsort = {}; // Start empty
    const result = addNoResultToPostsortResults(resultsPostsort, mockMapObj, mockConfigObj);

    // Verify properties exist
    expect(result).toHaveProperty("column2_0", "(stateA): no response");
    expect(result).toHaveProperty("column-2_1", "(stateD): no response");
  });

  it("should not overwrite existing results in resultsPostsort", () => {
    localStorage.setItem("noResponseCheckArrayHC1", JSON.stringify(["column2_0: stateA"]));

    const resultsPostsort = {
      column2_0: "Existing Answer",
    };

    const result = addNoResultToPostsortResults(resultsPostsort, mockMapObj, mockConfigObj);

    // Should keep the original value, not the "no response" string
    expect(result.column2_0).toBe("Existing Answer");
  });

  it("should handle second position and second negative columns when config flags are true", () => {
    mockConfigObj.showSecondPosColumn = true;
    mockConfigObj.showSecondNegColumn = true;

    // Pattern indices: 0=low, 1=low2, 2=high2, 3=high
    // Values indices:  0=low, 1=low2, 2=high2, 3=high

    localStorage.setItem("noResponseCheckArrayHC2", JSON.stringify(["column1_0: stateHigh2"]));
    localStorage.setItem("noResponseCheckArrayLC2", JSON.stringify(["column-1_0: stateLow2"]));

    const result = addNoResultToPostsortResults({}, mockMapObj, mockConfigObj);

    expect(result).toHaveProperty("column1_0", "(stateHigh2): no response");
    expect(result).toHaveProperty("column-1_0", "(stateLow2): no response");
  });

  it("should return a new object with keys sorted alphabetically", () => {
    const resultsPostsort = {
      z_last: "val",
      a_first: "val",
      m_middle: "val",
    };

    const result = addNoResultToPostsortResults(resultsPostsort, mockMapObj, mockConfigObj);
    const keys = Object.keys(result);

    expect(keys[0]).toBe("a_first");
    expect(keys[keys.length - 1]).toBe("z_last");
  });

  it("should handle empty localStorage gracefully", () => {
    const result = addNoResultToPostsortResults({}, mockMapObj, mockConfigObj);

    // If localStorage is empty, combinedObject[identifier] is undefined
    expect(result["column2_0"]).toBe("(undefined): no response");
  });
});
