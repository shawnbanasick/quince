import { describe, it, expect } from "vitest";
import convertObjectToBaserowResults from "../convertObjectToBaserowResults";

describe("convertObjectToBaserowResults", () => {
  it("should return undefined if input is empty or undefined", () => {
    expect(convertObjectToBaserowResults([])).toBeUndefined();
    // @ts-ignore - testing runtime safety
    expect(convertObjectToBaserowResults(undefined)).toBeUndefined();
  });

  it('should correctly transform column keys (N to - and remove "column")', () => {
    const input = {
      vCols: {
        columnN3: [{ statementNum: "1", psValue: 1 }],
        column2: [{ statementNum: "2", psValue: 0 }],
      },
    };

    const result = convertObjectToBaserowResults(input);

    // columnN3 becomes -3, column2 becomes 2
    // Statement 1 should be first because of the sort logic
    expect(result.r20).toBe("sort: -3|2");
  });

  it("should correctly assign presortVal (p, u, n) based on psValue", () => {
    const input = {
      vCols: {
        column1: [
          { statementNum: "1", psValue: 10 }, // p
          { statementNum: "2", psValue: 0 }, // u
          { statementNum: "3", psValue: -5 }, // n
        ],
      },
    };

    const result = convertObjectToBaserowResults(input);

    expect(result.r21).toContain("1*p*1");
    expect(result.r21).toContain("2*u*1");
    expect(result.r21).toContain("3*n*1");
  });

  it("should sort results by statement number ascending", () => {
    const input = {
      vCols: {
        column5: [{ statementNum: "10", psValue: 1 }],
        column1: [{ statementNum: "1", psValue: 1 }],
      },
    };

    const result = convertObjectToBaserowResults(input);

    // Even though column5 was processed first, statement 1 should appear first in the string
    expect(result.r20).toBe("sort: 1|5");
    expect(result.r21).toBe("presortTrace: 1*p*1|10*p*5");
  });

  it("should remove the trailing pipe character from results", () => {
    const input = {
      vCols: {
        column1: [{ statementNum: "1", psValue: 0 }],
      },
    };

    const result = convertObjectToBaserowResults(input);

    expect(result.r20).toBe("sort: 1");
  });
});
