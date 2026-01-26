import { describe, it, expect, beforeEach, vi } from "vitest";
import createBaserowObject from "../createBaserowObject";

describe("createBaserowObject", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean slate
    localStorage.clear();
    // Spy on console.log to prevent cluttering test output and to verify errors
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should correctly format data when valid results exist in localStorage", () => {
    const mockData = {
      npos: 5,
      nneu: 2,
      nneg: 1,
      posStateNums: [10, 20],
      neuStateNums: [30],
      negStateNums: [40, 50],
    };
    localStorage.setItem("resultsPresort", JSON.stringify(mockData));

    const result = createBaserowObject();

    expect(result).toEqual({
      r14: "(numPos): 5",
      r15: "(numNeu): 2",
      r16: "(numNeg): 1",
      r17: "(pos): 10,20",
      r18: "(neu): 30",
      r19: "(neg): 40,50",
    });
  });

  it("should default counts to 0 and arrays to empty if keys are missing or NaN", () => {
    const mockData = {
      npos: "not-a-number",
      // nneu and nneg are missing entirely
    };
    localStorage.setItem("resultsPresort", JSON.stringify(mockData));

    const result = createBaserowObject();

    expect(result.r14).toBe("(numPos): 0");
    expect(result.r15).toBe("(numNeu): 0");
    expect(result.r16).toBe("(numNeg): 0");
    expect(result.r17).toBe("(pos): ");
    expect(result.r18).toBe("(neu): ");
    expect(result.r19).toBe("(neg): ");
  });

  it("should handle null/missing localStorage gracefully", () => {
    // localStorage is empty by default thanks to beforeEach
    const result = createBaserowObject();

    expect(result.r14).toBe("(numPos): 0");
    expect(result.r17).toBe("(pos): ");
  });

  it("should catch errors and return undefined if JSON parsing fails", () => {
    localStorage.setItem("resultsPresort", "invalid-json-{");

    const result = createBaserowObject();

    expect(console.log).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
