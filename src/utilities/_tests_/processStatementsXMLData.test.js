import { describe, it, expect, vi, beforeEach } from "vitest";
import processStatementsXMLData from "../processStatementsXMLData";
import shuffle from "lodash/shuffle";

// Mock lodash/shuffle
vi.mock("lodash/shuffle", () => ({
  default: vi.fn((arr) => [...arr].reverse()), // Simple predictable shuffle (reverse)
}));

describe("processStatementsXMLData", () => {
  const mockVColsObj = { column1: [], column2: [] };
  const mockDataObject = {
    statements: {
      statement: [
        { _attributes: { id: "1" }, _text: "  Statement One  " },
        { _attributes: { id: "2" }, _text: "Statement Two" },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should transform XML data into the correct statement object format", () => {
    const result = processStatementsXMLData(mockDataObject, false, mockVColsObj);

    expect(result.totalStatements).toBe(2);
    expect(result.columnStatements.statementList[0]).toEqual({
      id: "s1",
      statementNum: "1",
      divColor: "isUncertainStatement",
      cardColor: "yellowSortCard",
      pinkChecked: false,
      yellowChecked: true,
      greenChecked: false,
      sortValue: 222,
      backgroundColor: "#e0e0e0",
      statement: "Statement One", // Trimmed
    });
  });

  it("should trim whitespace from statement text", () => {
    const result = processStatementsXMLData(mockDataObject, false, mockVColsObj);
    expect(result.columnStatements.statementList[0].statement).toBe("Statement One");
  });

  it("should shuffle cards when shuffleCards is true", () => {
    processStatementsXMLData(mockDataObject, true, mockVColsObj);

    // Check if lodash shuffle was called
    expect(shuffle).toHaveBeenCalled();
  });

  it("should NOT shuffle cards when shuffleCards is false", () => {
    processStatementsXMLData(mockDataObject, false, mockVColsObj);

    expect(shuffle).not.toHaveBeenCalled();
  });

  it('should set "hasBeenLoaded" in localStorage', () => {
    processStatementsXMLData(mockDataObject, false, mockVColsObj);

    expect(localStorage.getItem("hasBeenLoaded")).toBe("true");
  });

  it("should correctly attach the vColsObj to the return object", () => {
    const result = processStatementsXMLData(mockDataObject, false, mockVColsObj);
    expect(result.columnStatements.vCols).toBe(mockVColsObj);
  });
});
