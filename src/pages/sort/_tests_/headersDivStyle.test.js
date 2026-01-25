import { describe, it, expect } from "vitest";
import headersDivStyle from "../headersDivStyle"; // Adjust path as needed

describe("headersDivStyle", () => {
  const mockQSortHeaders = [10, 20, 30, 40];
  const mockColors = ["red", "blue", "green", "yellow"];
  const columnWidth = 100;

  it("returns the default color from the array when not highlighted", () => {
    const result = headersDivStyle(
      1,
      columnWidth,
      mockColors,
      mockQSortHeaders,
      "column99", // index 1 in qSortHeaders is 20, so 'column20' would match
    );

    expect(result.background).toBe("blue");
    expect(result.minWidth).toBe(117);
  });

  it('returns "lightblue" when the column matches the highlighted index', () => {
    // "column20" -> slice(6) -> "20" -> location is index 1 in qSortHeaders
    const result = headersDivStyle(1, columnWidth, mockColors, mockQSortHeaders, "column20");

    expect(result.background).toBe("lightblue");
  });

  it("handles non-numeric sliced IDs correctly", () => {
    const customHeaders = ["alpha", "beta"];
    const result = headersDivStyle(0, columnWidth, mockColors, customHeaders, "columnalpha");

    expect(result.background).toBe("lightblue");
  });

  it("returns the correct static layout properties", () => {
    const result = headersDivStyle(0, 100, mockColors, mockQSortHeaders, "column0");

    expect(result).toMatchObject({
      height: 50,
      fontSize: 25,
      textAlign: "center",
      display: "inline-block",
      border: "solid 2px black",
    });
  });
});
