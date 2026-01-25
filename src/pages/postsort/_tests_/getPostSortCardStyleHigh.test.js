import { describe, it, expect } from "vitest";
import getPostSortCardStyleHigh from "../getPostSortCardStyleHigh";

describe("getPostSortCardStyleHigh", () => {
  it("should return a style object with the correct dynamic values", () => {
    const height = 100;
    const width = 200;
    const fontSize = "16px";

    const result = getPostSortCardStyleHigh(height, width, fontSize);

    // Check dynamic properties
    expect(result.height).toBe("100px");
    expect(result.maxWidth).toBe("200px");
    expect(result.fontSize).toBe("16px");
  });

  it("should contain the expected static style properties", () => {
    const result = getPostSortCardStyleHigh(50, 150, "12px");

    // Check a few static properties to ensure the object structure is intact
    expect(result.display).toBe("flex");
    expect(result.userSelect).toBe("none");
    expect(result.background).toBe("#f6f6f6");
    expect(result.border).toBe("2px solid black");
  });

  it("should handle different units for font size (e.g., rem)", () => {
    const result = getPostSortCardStyleHigh(100, 200, "1.5rem");

    expect(result.fontSize).toBe("1.5rem");
  });

  it("should match the full snapshot for regression testing", () => {
    const result = getPostSortCardStyleHigh(150, 300, "14px");

    // Snapshots are great for style objects to catch accidental changes
    expect(result).toMatchSnapshot();
  });
});
