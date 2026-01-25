import { describe, it, expect } from "vitest";
import mobileConvertObjectToBaserowResults from "../mobileConvertObjectToBaserowResults";

describe("mobileConvertObjectToBaserowResults", () => {
  it("should sort results by statementNum and format strings correctly", () => {
    const sortResults = [
      { statementNum: "2", psValue: 1 },
      { statementNum: "1", psValue: -1 },
    ];
    const sortCharacteristicsArray = [{ value: "+A" }, { value: "B" }];

    const result = mobileConvertObjectToBaserowResults(sortResults, sortCharacteristicsArray);

    // After sorting by statementNum, index 1 (B) comes first, then index 0 (+A -> A)
    // Note: The function mutates the original array and maps characteristics by index *before* sorting.
    expect(result.r20).toBe("sort: B|A");
    expect(result.r21).toBe("presortTrace: 1*n*B|2*p*A");
  });

  it("should correctly assign presortVal labels (p, u, n)", () => {
    const sortResults = [
      { statementNum: "1", psValue: 10 },
      { statementNum: "2", psValue: 0 },
      { statementNum: "3", psValue: -5 },
    ];
    const sortCharacteristicsArray = [{ value: "pos" }, { value: "neu" }, { value: "neg" }];

    const { r21 } = mobileConvertObjectToBaserowResults(sortResults, sortCharacteristicsArray);

    expect(r21).toContain("1*p*pos");
    expect(r21).toContain("2*u*neu");
    expect(r21).toContain("3*n*neg");
  });

  it("should remove the trailing pipe character from outputs", () => {
    const sortResults = [{ statementNum: "1", psValue: 1 }];
    const sortCharacteristicsArray = [{ value: "VAL" }];

    const result = mobileConvertObjectToBaserowResults(sortResults, sortCharacteristicsArray);

    expect(result.r20).not.toContain("|");
    expect(result.r21).not.toContain("|");
    expect(result.r20).toBe("sort: VAL");
  });

  it("should handle numeric conversion of statementNum correctly", () => {
    const sortResults = [
      { statementNum: "10", psValue: 1 },
      { statementNum: "2", psValue: 1 },
    ];
    const sortCharacteristicsArray = [{ value: "ten" }, { value: "two" }];

    const result = mobileConvertObjectToBaserowResults(sortResults, sortCharacteristicsArray);

    // '2' should come before '10' numerically
    expect(result.r20).toBe("sort: two|ten");
  });
});
