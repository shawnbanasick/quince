import { describe, it, expect, beforeEach, vi } from "vitest";
import createPresortObject from "../createPresortObject";

describe("createPresortObject", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean slate
    localStorage.clear();
    // Clear console mocks
    vi.restoreAllMocks();
  });

  it("should return a formatted object when valid data exists in localStorage", () => {
    const mockData = {
      npos: 5,
      posStateNums: [1, 2],
      nneu: 2,
      neuStateNums: [3],
      nneg: 1,
      negStateNums: [4],
    };
    localStorage.setItem("resultsPresort", JSON.stringify(mockData));

    const result = createPresortObject();

    expect(result).toEqual({
      npos: 5,
      posStateNums: [1, 2],
      nneu: 2,
      neuStateNums: [3],
      nneg: 1,
      negStateNums: [4],
    });
  });

  it("should return default values (0 and []) if localStorage is empty", () => {
    const result = createPresortObject();

    expect(result).toEqual({
      npos: 0,
      posStateNums: [],
      nneu: 0,
      neuStateNums: [],
      nneg: 0,
      negStateNums: [],
    });
  });

  it("should catch errors and return undefined if JSON is invalid", () => {
    // Mock console.log to prevent cluttering test output
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    localStorage.setItem("resultsPresort", "invalid-json-{");

    const result = createPresortObject();

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
