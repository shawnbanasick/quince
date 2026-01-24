import { describe, it, expect } from "vitest";
import setMaxIterations from "../setMaxIterations";

describe("setMaxIterations", () => {
  it("should return undefined if the array is empty", () => {
    const result = setMaxIterations([]);
    expect(result).toBeUndefined();
  });

  it("should return 0 when the length is 3", () => {
    // Math.ceil((3 - 3) / 2) = 0
    const result = setMaxIterations([1, 2, 3]);
    expect(result).toBe(0);
  });

  it("should return 1 when the length is 4", () => {
    // Math.ceil((4 - 3) / 2) = Math.ceil(0.5) = 1
    const result = setMaxIterations([1, 2, 3, 4]);
    expect(result).toBe(1);
  });

  it("should return 1 when the length is 5", () => {
    // Math.ceil((5 - 3) / 2) = 1
    const result = setMaxIterations(["a", "b", "c", "d", "e"]);
    expect(result).toBe(1);
  });

  it("should return 2 when the length is 6", () => {
    // Math.ceil((6 - 3) / 2) = Math.ceil(1.5) = 2
    const result = setMaxIterations(new Array(6));
    expect(result).toBe(2);
  });

  it("should handle negative results for lengths less than 3", () => {
    // Math.ceil((1 - 3) / 2) = -1
    const result = setMaxIterations([1]);
    expect(result).toBe(-1);
  });
});
