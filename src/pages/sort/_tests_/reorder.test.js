import { describe, it, expect, vi, beforeEach } from "vitest";
import reorder from "../reorder"; // adjust path as needed

describe("reorder utility", () => {
  let mockColumnStatements;

  beforeEach(() => {
    // Reset data before each test to ensure isolation
    mockColumnStatements = {
      vCols: {
        todo: ["Task 1", "Task 2", "Task 3"],
        statements: ["Stmt 1", "Stmt 2"],
      },
    };
  });

  it('should return the original object if the column is "statements"', () => {
    const result = reorder("statements", 0, 1, mockColumnStatements);
    expect(result).toBe(mockColumnStatements);
    expect(result.vCols.statements).toEqual(["Stmt 1", "Stmt 2"]);
  });

  it("should correctly reorder items within a specific column", () => {
    // Move 'Task 1' (index 0) to index 1
    const result = reorder("todo", 0, 1, mockColumnStatements);

    expect(result.vCols.todo).toEqual(["Task 2", "Task 1", "Task 3"]);
    // Ensure we returned a new object reference (immutability check for the root)
    expect(result).not.toBe(mockColumnStatements);
  });

  it("should move an item from the end to the beginning", () => {
    // Move 'Task 3' (index 2) to index 0
    const result = reorder("todo", 2, 0, mockColumnStatements);
    expect(result.vCols.todo).toEqual(["Task 3", "Task 1", "Task 2"]);
  });

  it("should handle errors and log them to the console", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Passing null to force a catch block trigger (cannot read properties of null)
    reorder("todo", 0, 1, null);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should not affect other columns when reordering", () => {
    const result = reorder("todo", 0, 1, mockColumnStatements);
    // 'statements' column should remain untouched
    expect(result.vCols.statements).toEqual(["Stmt 1", "Stmt 2"]);
  });
});
