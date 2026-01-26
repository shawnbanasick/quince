import { describe, it, expect, vi } from "vitest";
import mobileCalcPresortCountsObject from "../mobileCalcPresortCountsObject";

describe("mobileCalcPresortCountsObject", () => {
  it("should correctly count and join statement numbers for positive, negative, and neutral items", () => {
    const mockResults = [
      { statementNum: 1, greenChecked: true },
      { statementNum: 2, pinkChecked: true },
      { statementNum: 3, yellowChecked: true },
      { statementNum: 4, greenChecked: true },
    ];

    const result = mobileCalcPresortCountsObject(mockResults);

    expect(result).toEqual({
      npos: 2,
      posStateNums: "1|4",
      nneu: 1,
      neuStateNums: "3",
      nneg: 1,
      negStateNums: "2",
    });
  });

  it("should return zeros and empty strings when the input array is empty", () => {
    const result = mobileCalcPresortCountsObject([]);

    expect(result).toEqual({
      npos: 0,
      posStateNums: "",
      nneu: 0,
      neuStateNums: "",
      nneg: 0,
      negStateNums: "",
    });
  });

  it("should ignore items that do not have any relevant checkbox marked true", () => {
    const mockResults = [
      { statementNum: 10, someOtherProp: true }, // No valid checkbox
    ];

    const result = mobileCalcPresortCountsObject(mockResults);

    expect(result.npos).toBe(0);
    expect(result.nneg).toBe(0);
    expect(result.nneu).toBe(0);
  });

  it("should handle the error and log to console if sortResults is null/undefined", () => {
    // Spy on console.log to verify it's called
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = mobileCalcPresortCountsObject(null);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error in calculating createPresortObject",
      expect.any(Error),
    );
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
