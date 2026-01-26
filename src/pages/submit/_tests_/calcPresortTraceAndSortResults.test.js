import { describe, it, expect, vi } from "vitest";
import calcPresortTranceAndSortResults from "../calcPresortTraceAndSortResults";

describe("calcPresortTranceAndSortResults", () => {
  it("should correctly format sort results and presort trace text", () => {
    const sortResults = [
      { statementNum: 2, greenChecked: true },
      { statementNum: 1, yellowChecked: true },
    ];
    const sortCharacteristicsArray = [{ value: "ValueB" }, { value: "ValueA" }];

    const result = calcPresortTranceAndSortResults(sortResults, sortCharacteristicsArray);

    // Note: The function sorts by statementNum (1 comes before 2)
    // Statement 1 has yellowChecked (u) and ValueA
    // Statement 2 has greenChecked (p) and ValueB
    expect(result.sort).toBe("ValueA|ValueB");
    expect(result.presortTrace).toBe("1*u*ValueA|2*p*ValueB");
  });

  it('should handle different "checked" flags correctly', () => {
    const sortResults = [
      { statementNum: 1, yellowChecked: true },
      { statementNum: 2, greenChecked: true },
      { statementNum: 3, pinkChecked: true },
    ];
    const charArray = [{ value: "v1" }, { value: "v2" }, { value: "v3" }];

    const result = calcPresortTranceAndSortResults(sortResults, charArray);

    expect(result.presortTrace).toContain("1*u*v1"); // yellow
    expect(result.presortTrace).toContain("2*p*v2"); // green
    expect(result.presortTrace).toContain("3*n*v3"); // pink
  });

  it("should sort the output by statementNum regardless of input order", () => {
    const sortResults = [
      { statementNum: 50, yellowChecked: true },
      { statementNum: 10, yellowChecked: true },
    ];
    const charArray = [{ value: "High" }, { value: "Low" }];

    const result = calcPresortTranceAndSortResults(sortResults, charArray);

    // Even though 50 was first in the input, 10 should be first in output string
    expect(result.sort).toBe("Low|High");
    expect(result.presortTrace.startsWith("10*")).toBe(true);
  });

  it("should return empty strings if input arrays are empty", () => {
    const result = calcPresortTranceAndSortResults([], []);
    expect(result.sort).toBe("");
    expect(result.presortTrace).toBe("");
  });

  it("should handle missing values gracefully (optional chaining)", () => {
    const sortResults = [{ statementNum: 1 }];
    const charArray = []; // Missing matching index

    const result = calcPresortTranceAndSortResults(sortResults, charArray);

    // sortValue becomes undefined, presortVal is undefined
    expect(result.sort).toBe("undefined");
    expect(result.presortTrace).toBe("1*undefined*undefined");
  });

  it("should log an error and return undefined if an exception occurs", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Passing null to trigger the .forEach error
    const result = calcPresortTranceAndSortResults(null, null);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error in calculating createPresortTraceAndSortResults"),
      expect.anything(),
    );
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
