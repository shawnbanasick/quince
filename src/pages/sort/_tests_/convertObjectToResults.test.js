import { describe, it, expect } from "vitest";
import convertObjectToResults from "../convertObjectToResults"; // Update this path

describe("convertObjectToResults", () => {
  // Mock Data
  const mockColumnStatements = {
    vCols: {
      columnN1: [{ statementNum: 10 }, { statementNum: 11 }],
      column2: [{ statementNum: 5 }],
    },
  };

  const mockResultsPresort = {
    posStateNums: "10",
    neuStateNums: "11",
    negStateNums: "5",
  };

  it("should return undefined if columnStatements is empty", () => {
    expect(convertObjectToResults([], mockResultsPresort)).toBeUndefined();
  });

  it("should correctly parse column names and statement numbers", () => {
    // "columnN1" should become -1
    // "column2" should become 2
    // Statements are sorted numerically: 5, 10, 11
    const result = convertObjectToResults(mockColumnStatements, mockResultsPresort, false);

    // Result sort string should be based on statement order: 5(val:2), 10(val:-1), 11(val:-1)
    expect(result.sort).toBe("2|-1|-1");
  });

  it("should include presortTrace when traceSorts is true", () => {
    const result = convertObjectToResults(mockColumnStatements, mockResultsPresort, true);

    expect(result).toHaveProperty("presortTrace");
    // Format: statement*presortVal*sortValue
    // Statement 5: 5*n*2
    // Statement 10: 10*p*-1
    // Statement 11: 11*u*-1
    expect(result.presortTrace).toBe("5*n*2|10*p*-1|11*u*-1");
  });

  it("should handle empty presort values gracefully", () => {
    const emptyPresort = {
      posStateNums: "",
      neuStateNums: "",
      negStateNums: "",
    };
    const result = convertObjectToResults(mockColumnStatements, emptyPresort, true);

    // presortVal should be undefined in the trace string if not matched
    expect(result.presortTrace).toContain("5*undefined*2");
  });

  it('should handle "true" as a string for the traceSorts argument', () => {
    const result = convertObjectToResults(mockColumnStatements, mockResultsPresort, "true");
    expect(result).toHaveProperty("presortTrace");
  });

  it("should correctly remove the trailing bar from the result strings", () => {
    const result = convertObjectToResults(mockColumnStatements, mockResultsPresort, false);
    expect(result.sort.endsWith("|")).toBe(false);
  });
});
