import { describe, it, expect } from "vitest";
import createColumnData from "../createColumnData";

describe("createColumnData", () => {
  it("should create column data from headers and sort patterns", () => {
    const headers = ["name", "age", "email"];
    const qSortPattern = [1, 0, -1];

    const result = createColumnData(headers, qSortPattern);

    expect(result).toEqual([
      ["columnname", 1],
      ["columnage", 0],
      ["columnemail", -1],
    ]);
  });

  it("should handle empty arrays", () => {
    const headers = [];
    const qSortPattern = [];

    const result = createColumnData(headers, qSortPattern);

    expect(result).toEqual([]);
  });

  it("should handle single element arrays", () => {
    const headers = ["id"];
    const qSortPattern = [1];

    const result = createColumnData(headers, qSortPattern);

    expect(result).toEqual([["columnid", 1]]);
  });

  it("should preserve sort pattern values correctly", () => {
    const headers = ["field1", "field2", "field3"];
    const qSortPattern = [2, -2, 0];

    const result = createColumnData(headers, qSortPattern);

    expect(result[0][1]).toBe(2);
    expect(result[1][1]).toBe(-2);
    expect(result[2][1]).toBe(0);
  });

  it("should handle headers with special characters", () => {
    const headers = ["user-name", "email_address", "phone.number"];
    const qSortPattern = [1, 1, 1];

    const result = createColumnData(headers, qSortPattern);

    expect(result).toEqual([
      ["columnuser-name", 1],
      ["columnemail_address", 1],
      ["columnphone.number", 1],
    ]);
  });

  it("should handle numeric header values", () => {
    const headers = [1, 2, 3];
    const qSortPattern = [0, 1, -1];

    const result = createColumnData(headers, qSortPattern);

    expect(result).toEqual([
      ["column1", 0],
      ["column2", 1],
      ["column3", -1],
    ]);
  });

  it("should return a new array (not mutate inputs)", () => {
    const headers = ["test"];
    const qSortPattern = [1];

    const result = createColumnData(headers, qSortPattern);

    expect(result).not.toBe(headers);
    expect(result).not.toBe(qSortPattern);
  });

  it("should handle mismatched array lengths by using available indices", () => {
    const headers = ["a", "b", "c"];
    const qSortPattern = [1, 2];

    const result = createColumnData(headers, qSortPattern);

    // Third element will have undefined from qSortPattern
    expect(result).toEqual([
      ["columna", 1],
      ["columnb", 2],
      ["columnc", undefined],
    ]);
  });

  it("should create correct number of columns", () => {
    const headers = ["col1", "col2", "col3", "col4"];
    const qSortPattern = [1, 0, -1, 1];

    const result = createColumnData(headers, qSortPattern);

    expect(result).toHaveLength(4);
  });

  it("should maintain order of headers", () => {
    const headers = ["z", "a", "m", "b"];
    const qSortPattern = [1, 2, 3, 4];

    const result = createColumnData(headers, qSortPattern);

    expect(result[0][0]).toBe("columnz");
    expect(result[1][0]).toBe("columna");
    expect(result[2][0]).toBe("columnm");
    expect(result[3][0]).toBe("columnb");
  });
});
