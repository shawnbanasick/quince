import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ScrollIndicator from "../ScrollIndicator";

describe("ScrollIndicator Component", () => {
  describe("Default Rendering", () => {
    it("renders the default bouncing arrow", () => {
      render(<ScrollIndicator />);
      const arrow = screen.getByText("↓");
      expect(arrow).toBeDefined();
    });
  });

  describe("Style Variations", () => {
    it("renders the pulsing-dot style", () => {
      const { container } = render(<ScrollIndicator style="pulsing-dot" />);
      const dot = container.querySelector('div[style*="border-radius: 50%"]');
      expect(dot).toBeDefined();
      expect(dot?.style.animation).toContain("pulse");
    });

    it("renders the chevron style", () => {
      const { container } = render(<ScrollIndicator style="chevron" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeDefined();
      expect(container.firstChild).toHaveStyle("animation: slideDown 2s infinite");
    });
  });

  describe("Props and Configuration", () => {
    it.each([
      ["small", "24px"],
      ["medium", "32px"],
      ["large", "40px"],
    ])("scales correctly for size: %s", (size, expectedPx) => {
      const { container } = render(<ScrollIndicator size={size} />);
      expect(container.firstChild).toHaveStyle(`width: ${expectedPx}`);
    });

    it("positions correctly based on the position prop", () => {
      const { container } = render(<ScrollIndicator position="bottom-left" />);
      const element = container.firstChild;
      expect(element).toHaveStyle("bottom: 20px");
      expect(element).toHaveStyle("left: 20px");
    });
  });
});
