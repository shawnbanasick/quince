import { describe, it, expect } from "vitest";
import getListStyleHori from "../getListStyleHori";

describe("getListStyleHori", () => {
  it("should return the correct background color when isDraggingOver is true", () => {
    const style = getListStyleHori(true, "200px", "ltr");
    expect(style.background).toBe("lightblue");
  });

  it("should return the default background color when isDraggingOver is false", () => {
    const style = getListStyleHori(false, "200px", "ltr");
    expect(style.background).toBe("#e4e4e4");
  });

  it("should apply the provided minHeight and sortDirection", () => {
    const minHeight = "500px";
    const direction = "rtl";
    const style = getListStyleHori(false, minHeight, direction);

    expect(style.minHeight).toBe(minHeight);
    expect(style.direction).toBe(direction);
  });

  it("should maintain static layout properties", () => {
    const style = getListStyleHori(false, "100px", "ltr");

    expect(style.display).toBe("flex");
    expect(style.flexDirection).toBe("row");
    expect(style.overflowX).toBe("scroll");
    expect(style.width).toBe("100vw");
  });

  it("should match the snapshot for consistent styling", () => {
    const style = getListStyleHori(true, "150px", "ltr");
    expect(style).toMatchSnapshot();
  });
});
