import { describe, it, expect } from "vitest";
import getItemStyleHoriImages from "../getItemStyleHoriImages"; // Adjust path as needed

describe("getItemStyleHoriImages", () => {
  const defaultArgs = [
    false, // isDragging
    { top: 10 }, // draggableStyle
    "1", // sortValue
    "yellowSortCard", // cardColor
    "200px", // columnWidth
    "100px", // cardHeight
    "14px", // cardFontSize
    "green", // greenCardColor
    "yellow", // yellowCardColor
    "pink", // pinkCardColor
    "black", // fontColor
  ];

  it("should apply the correct dimensions and typography from arguments", () => {
    const styles = getItemStyleHoriImages(...defaultArgs);

    expect(styles.fontSize).toBe("14px");
    expect(styles.height).toBe("100px");
    expect(styles.minWidth).toBe("200px");
    expect(styles.color).toBe("black");
  });

  // Logic Checks: Sorting and Colors

  it("should default sortValue to 999 if it is not a number", () => {
    const args = [...defaultArgs];
    args[2] = "not-a-number"; // sortValue index
    const styles = getItemStyleHoriImages(...args);

    expect(styles.order).toBe(999);
  });

  it("should map color strings to their hex/color variable equivalents", () => {
    // Test Pink mapping
    const pinkStyles = getItemStyleHoriImages(
      false,
      {},
      "1",
      "pinkSortCard",
      ...defaultArgs.slice(4),
    );
    expect(pinkStyles.background).toBe("pink");

    // Test Green mapping
    const greenStyles = getItemStyleHoriImages(
      false,
      {},
      "1",
      "greenSortCard",
      ...defaultArgs.slice(4),
    );
    expect(greenStyles.background).toBe("green");

    // Test Undefined/Yellow mapping
    const yellowStyles = getItemStyleHoriImages(
      false,
      {},
      "1",
      "undefined",
      ...defaultArgs.slice(4),
    );
    expect(yellowStyles.background).toBe("yellow");
  });

  // UI State: Dragging

  it("should change filter brightness when dragging", () => {
    const draggingStyles = getItemStyleHoriImages(true, ...defaultArgs.slice(1));
    const staticStyles = getItemStyleHoriImages(false, ...defaultArgs.slice(1));

    expect(draggingStyles.filter).toBe("brightness(0.85)");
    expect(staticStyles.filter).toBe("brightness(1.00)");
  });

  it("should merge and prioritize draggableStyle properties", () => {
    const customDraggableStyle = { position: "absolute", margin: "10px" };
    const styles = getItemStyleHoriImages(false, customDraggableStyle, ...defaultArgs.slice(2));

    expect(styles.position).toBe("absolute");
    // Margin is specifically overwritten by the spread at the end of the function
    expect(styles.margin).toBe("10px");
  });
});
