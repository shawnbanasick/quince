import { describe, it, expect } from "vitest";
import getItemStyle from "../getItemStyle"; // Adjust the path as needed

describe("getItemStyle", () => {
  const defaultArgs = [
    false, // isDragging
    { top: 10 }, // draggableStyle
    "100px", // cardWidth
    "50px", // cardHeight
    "14px", // cardFontSize
    "blue", // cardColor
    "green", // greenCardColor
    "yellow", // yellowCardColor
    "pink", // pinkCardColor
    "black", // fontColor
  ];

  it("should return basic static styles regardless of state", () => {
    const style = getItemStyle(...defaultArgs);

    expect(style.display).toBe("flex");
    expect(style.userSelect).toBe("none");
    expect(style.justifyContent).toBe("center");
    expect(style.textAlign).toBe("center");
  });

  it("should apply dynamic dimensions and colors from arguments", () => {
    const style = getItemStyle(...defaultArgs);

    expect(style.width).toBe("100px");
    expect(style.height).toBe("50px");
    expect(style.fontSize).toBe("14px");
    expect(style.color).toBe("black");
  });

  it("should apply specific styles when isDragging is true", () => {
    // Override isDragging to true
    const draggingArgs = [true, ...defaultArgs.slice(1)];
    const style = getItemStyle(...draggingArgs);

    expect(style.filter).toBe("brightness(0.85)");
    expect(style.background).toBe("#ffffff");
  });

  it("should apply specific styles when isDragging is false", () => {
    const style = getItemStyle(...defaultArgs);

    expect(style.filter).toBe("brightness(1.00)");
    expect(style.background).toBe("transparent");
  });

  it("should spread and prioritize draggableStyle properties", () => {
    const customDraggableStyle = { transform: "translate(10px, 20px)", position: "absolute" };
    const style = getItemStyle(false, customDraggableStyle, ...defaultArgs.slice(2));

    expect(style.transform).toBe("translate(10px, 20px)");
    expect(style.position).toBe("absolute");
  });

  it("should handle missing fontColor gracefully", () => {
    const noColorArgs = [...defaultArgs];
    noColorArgs[9] = undefined; // Set fontColor to undefined

    const style = getItemStyle(...noColorArgs);
    expect(style.color).toBeUndefined();
  });
});
