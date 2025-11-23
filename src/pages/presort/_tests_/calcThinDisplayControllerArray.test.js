import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import calcThinDisplayControllerArray from "../calcThinDisplayControllerArray";

describe("calcThinDisplayControllerArray", () => {
  let consoleErrorSpy;
  let alertSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
  });

  describe("basic functionality", () => {
    it("should return an empty array when both input arrays are empty", () => {
      const result = calcThinDisplayControllerArray(10, 10, [], []);
      expect(result).toEqual([]);
    });

    it("should process only right arrays when left arrays are empty", () => {
      const sortRightArrays = [
        ["col1", 5],
        ["col2", 3],
      ];
      const sortLeftArrays = [];

      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        targetCol: "col1",
        maxNum: 5,
        side: "right",
        iteration: 1,
      });
      expect(result[1]).toEqual({
        targetCol: "col2",
        maxNum: 3,
        side: "right",
        iteration: 2,
      });
    });

    it("should process only left arrays when right arrays are empty", () => {
      const sortRightArrays = [];
      const sortLeftArrays = [
        ["col1", 4],
        ["col2", 2],
      ];

      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        targetCol: "col1",
        maxNum: 4,
        side: "left",
        iteration: 1,
      });
      expect(result[1]).toEqual({
        targetCol: "col2",
        maxNum: 2,
        side: "left",
        iteration: 2,
      });
    });

    it("should process both right and left arrays", () => {
      const sortRightArrays = [
        ["colR1", 3],
        ["colR2", 2],
      ];
      const sortLeftArrays = [
        ["colL1", 4],
        ["colL2", 1],
      ];

      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      expect(result).toHaveLength(4);
      expect(result.filter((item) => item.side === "right")).toHaveLength(2);
      expect(result.filter((item) => item.side === "left")).toHaveLength(2);
    });
  });

  describe("remaining count filtering", () => {
    it("should only include items where maxNum is less than remaining count", () => {
      const sortRightArrays = [
        ["col1", 5],
        ["col2", 15],
        ["col3", 3],
      ];
      const sortLeftArrays = [];

      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      expect(result).toHaveLength(2);
      expect(result[0].targetCol).toBe("col1");
      expect(result[1].targetCol).toBe("col3");
      expect(result.find((item) => item.targetCol === "col2")).toBeUndefined();
    });

    it("should update remaining counts after each item", () => {
      const sortRightArrays = [
        ["col1", 3],
        ["col2", 4],
        ["col3", 2],
      ];
      const sortLeftArrays = [];

      // Starting with remainingPosCount = 10
      // After col1 (3): remaining = 7
      // After col2 (4): remaining = 3
      // col3 (2) < 3, so it should be included
      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      expect(result).toHaveLength(3);
      expect(result.map((item) => item.targetCol)).toEqual(["col1", "col2", "col3"]);
    });

    it("should handle when remaining count becomes zero or negative", () => {
      const sortRightArrays = [
        ["col1", 5],
        ["col2", 5],
        ["col3", 1],
      ];
      const sortLeftArrays = [];

      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      // col1 (5) < 10 ✓, remaining = 5
      // col2 (5) < 5 ✗
      // col3 (1) < 5 ✓
      expect(result).toHaveLength(2);
      expect(result[0].targetCol).toBe("col1");
      expect(result[1].targetCol).toBe("col3");
    });
  });

  describe("array length mismatches", () => {
    it("should handle when right arrays are longer than left arrays", () => {
      const sortRightArrays = [
        ["colR1", 2],
        ["colR2", 3],
        ["colR3", 1],
      ];
      const sortLeftArrays = [["colL1", 2]];

      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      expect(result.filter((item) => item.side === "right")).toHaveLength(3);
      expect(result.filter((item) => item.side === "left")).toHaveLength(1);
    });

    it("should handle when left arrays are longer than right arrays", () => {
      const sortRightArrays = [["colR1", 2]];
      const sortLeftArrays = [
        ["colL1", 2],
        ["colL2", 3],
        ["colL3", 1],
      ];

      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      expect(result.filter((item) => item.side === "right")).toHaveLength(1);
      expect(result.filter((item) => item.side === "left")).toHaveLength(3);
    });
  });

  describe("iteration numbering", () => {
    it("should correctly number iterations starting from 1", () => {
      const sortRightArrays = [
        ["col1", 1],
        ["col2", 2],
        ["col3", 3],
      ];
      const sortLeftArrays = [
        ["col4", 1],
        ["col5", 2],
      ];

      const result = calcThinDisplayControllerArray(20, 20, sortRightArrays, sortLeftArrays);

      expect(result[0].iteration).toBe(1);
      expect(result[2].iteration).toBe(2);
      expect(result[4].iteration).toBe(3);
    });
  });

  describe("type coercion", () => {
    it("should handle string numbers in arrays", () => {
      const sortRightArrays = [
        ["col1", "5"],
        ["col2", "3"],
      ];
      const sortLeftArrays = [["col3", "4"]];

      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      expect(result[0].maxNum).toBe(5);
      expect(result[1].maxNum).toBe(4);
      expect(result[2].maxNum).toBe(3);
    });
  });

  describe("edge cases and undefined handling", () => {
    it("should handle undefined array elements gracefully", () => {
      const sortRightArrays = [["col1", 3], undefined, ["col2", 2]];
      const sortLeftArrays = [];

      const result = calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);

      // Should process valid elements and skip undefined
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle arrays with undefined values", () => {
      const sortRightArrays = [
        [undefined, 3],
        ["col2", undefined],
      ];
      const sortLeftArrays = [];

      // Should not throw error due to optional chaining
      expect(() => {
        calcThinDisplayControllerArray(10, 10, sortRightArrays, sortLeftArrays);
      }).not.toThrow();
    });

    it("should handle zero remaining counts", () => {
      const sortRightArrays = [["col1", 1]];
      const sortLeftArrays = [["col2", 1]];

      const result = calcThinDisplayControllerArray(0, 0, sortRightArrays, sortLeftArrays);

      expect(result).toHaveLength(0);
    });

    it("should handle negative remaining counts", () => {
      const sortRightArrays = [["col1", 1]];
      const sortLeftArrays = [["col2", 1]];

      const result = calcThinDisplayControllerArray(-5, -5, sortRightArrays, sortLeftArrays);

      expect(result).toHaveLength(0);
    });
  });

  describe("error handling", () => {
    it("should catch and log errors when invalid input causes exception", () => {
      // Force an error by passing null which will cause issues in the loop
      const result = calcThinDisplayControllerArray(10, 10, null, null);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith(
        "There was an error calculating the thin display controller array. Please contact the developer"
      );
      expect(result).toBeUndefined();
    });
  });

  describe("complex scenarios", () => {
    it("should handle realistic data scenario", () => {
      const sortRightArrays = [
        ["revenue", 150],
        ["profit", 80],
        ["growth", 45],
        ["margin", 120],
      ];
      const sortLeftArrays = [
        ["expenses", 90],
        ["losses", 60],
        ["debt", 110],
      ];

      const result = calcThinDisplayControllerArray(200, 150, sortRightArrays, sortLeftArrays);

      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every((item) => item.targetCol && item.maxNum && item.side && item.iteration)
      ).toBe(true);
    });
  });
});
