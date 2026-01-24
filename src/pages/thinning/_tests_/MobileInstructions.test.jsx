import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Instructions from "../MobileInstructions";

describe("Instructions Component", () => {
  describe("when agree is true", () => {
    it("renders part1 and part3 props", () => {
      const props = {
        agree: true,
        part1: "First instruction text",
        part3: "Third instruction text",
      };

      render(<Instructions {...props} />);

      expect(screen.getByText(/First instruction text/)).toBeInTheDocument();
      expect(screen.getByText(/Third instruction text/)).toBeInTheDocument();
    });

    it("does not render agreeLeastText when agree is true", () => {
      const props = {
        agree: true,
        part1: "Part 1",
        part3: "Part 3",
        agreeLeastText: "Least agree text",
      };

      render(<Instructions {...props} />);

      expect(screen.queryByText("Least agree text")).not.toBeInTheDocument();
    });

    it("renders both part1 and part3 together", () => {
      const props = {
        agree: true,
        part1: "Start",
        part3: "End",
      };

      const { container } = render(<Instructions {...props} />);

      expect(container.textContent).toBe("StartEnd");
    });
  });

  describe("when agree is false", () => {
    it("renders agreeLeastText prop", () => {
      const props = {
        agree: false,
        agreeLeastText: "Select statements you least agree with",
      };

      render(<Instructions {...props} />);

      expect(screen.getByText("Select statements you least agree with")).toBeInTheDocument();
    });

    it("does not render part1 and part3 when agree is false", () => {
      const props = {
        agree: false,
        part1: "Part 1",
        part3: "Part 3",
        agreeLeastText: "Least text",
      };

      render(<Instructions {...props} />);

      expect(screen.queryByText("Part 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Part 3")).not.toBeInTheDocument();
    });
  });

  describe("styled component rendering", () => {
    it("renders InstructionsText wrapper when agree is true", () => {
      const props = {
        agree: true,
        part1: "Test",
        part3: "Content",
      };

      const { container } = render(<Instructions {...props} />);
      const wrapper = container.firstChild;

      expect(wrapper).toBeInTheDocument();
      expect(wrapper.tagName).toBe("DIV");
    });

    it("renders InstructionsText wrapper when agree is false", () => {
      const props = {
        agree: false,
        agreeLeastText: "Test content",
      };

      const { container } = render(<Instructions {...props} />);
      const wrapper = container.firstChild;

      expect(wrapper).toBeInTheDocument();
      expect(wrapper.tagName).toBe("DIV");
    });
  });

  describe("edge cases", () => {
    it("handles empty string props", () => {
      const props = {
        agree: true,
        part1: "",
        part3: "",
      };

      const { container } = render(<Instructions {...props} />);

      expect(container.textContent).toBe("");
    });

    it("handles undefined agree prop (falsy)", () => {
      const props = {
        agreeLeastText: "Fallback text",
      };

      render(<Instructions {...props} />);

      expect(screen.getByText("Fallback text")).toBeInTheDocument();
    });

    it("handles null agree prop (falsy)", () => {
      const props = {
        agree: null,
        agreeLeastText: "Null test",
      };

      render(<Instructions {...props} />);

      expect(screen.getByText("Null test")).toBeInTheDocument();
    });
  });
});
