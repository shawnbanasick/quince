import { describe, it, expect } from "vitest";
import createMobilePresortResultsObject from "../createMobilePresortResultsObject";

describe("createMobilePresortResultsObject", () => {
  it("should correctly count and list positive, negative, and neutral values", () => {
    const input = [
      { id: "101", psValue: 5 },
      { id: "102", psValue: -3 },
      { id: "103", psValue: 0 },
      { id: "104", psValue: 10 },
    ];

    const result = createMobilePresortResultsObject(input);

    expect(result).toEqual({
      npos: 2,
      nneg: 1,
      nneu: 1,
      posStateNums: "101, 104",
      negStateNums: "102",
      neuStateNums: "103",
    });
  });

  it("should handle an empty array gracefully", () => {
    const input = [];
    const result = createMobilePresortResultsObject(input);

    expect(result).toEqual({
      npos: 0,
      nneg: 0,
      nneu: 0,
      posStateNums: "",
      negStateNums: "",
      neuStateNums: "",
    });
  });

  it("should handle only positive values", () => {
    const input = [{ id: "A", psValue: 1 }];
    const result = createMobilePresortResultsObject(input);

    expect(result.npos).toBe(1);
    expect(result.posStateNums).toBe("A");
    expect(result.negStateNums).toBe("");
    expect(result.neuStateNums).toBe("");
  });

  it("should handle only neutral values (psValue of 0)", () => {
    const input = [{ id: "B", psValue: 0 }];
    const result = createMobilePresortResultsObject(input);

    expect(result.nneu).toBe(1);
    expect(result.neuStateNums).toBe("B");
  });

  it("should remove the trailing comma and space correctly for multiple IDs", () => {
    const input = [
      { id: "1", psValue: -1 },
      { id: "2", psValue: -1 },
      { id: "3", psValue: -1 },
    ];
    const result = createMobilePresortResultsObject(input);

    expect(result.negStateNums).toBe("1, 2, 3");
    // Ensure no trailing ", " exists
    expect(result.negStateNums).not.toMatch(/, $/);
  });
});
