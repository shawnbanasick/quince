import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Instructions from "../Instructions";
import useSettingsStore from "../../../globalState/useSettingsStore";
import decodeHTML from "../../../utilities/decodeHTML";

// Mock the dependencies
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../utilities/decodeHTML");
vi.mock("html-react-parser", () => ({
  default: vi.fn((str) => str),
}));

describe("Instructions Component", () => {
  const mockLangObj = {
    numStatementsToSelect: "Number of statements to select",
    currentlySelectedNumber: "Currently selected",
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    useSettingsStore.mockReturnValue(mockLangObj);
    decodeHTML.mockImplementation((str) => str);
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(
        <Instructions part1="Part 1" part2="Part 2" part3="Part 3" maxNum={5} selectedNum={0} />,
      );
    });

    it("renders all three instruction parts", () => {
      render(
        <Instructions
          part1={<div>First instruction</div>}
          part2={<div>Second instruction</div>}
          part3={<div>Third instruction</div>}
          maxNum={5}
          selectedNum={0}
        />,
      );

      expect(screen.getByText("First instruction")).toBeInTheDocument();
      expect(screen.getByText("Second instruction")).toBeInTheDocument();
      expect(screen.getByText("Third instruction")).toBeInTheDocument();
    });

    it("renders required statements text with correct values", () => {
      render(
        <Instructions part1="Part 1" part2="Part 2" part3="Part 3" maxNum={10} selectedNum={5} />,
      );

      expect(screen.getByText(/Number of statements to select: 10/)).toBeInTheDocument();
    });

    it("renders currently selected text with correct values", () => {
      render(
        <Instructions part1="Part 1" part2="Part 2" part3="Part 3" maxNum={10} selectedNum={7} />,
      );

      expect(screen.getByText(/Currently selected: 7/)).toBeInTheDocument();
    });
  });

  describe("Store Integration", () => {
    it("retrieves langObj from useSettingsStore", () => {
      render(
        <Instructions part1="Part 1" part2="Part 2" part3="Part 3" maxNum={5} selectedNum={2} />,
      );

      expect(useSettingsStore).toHaveBeenCalled();
    });

    it("handles missing langObj properties gracefully", () => {
      useSettingsStore.mockReturnValue({});

      const { container } = render(
        <Instructions part1="Part 1" part2="Part 2" part3="Part 3" maxNum={5} selectedNum={2} />,
      );

      expect(container).toBeInTheDocument();
    });

    it("decodes HTML entities in langObj values", () => {
      render(
        <Instructions part1="Part 1" part2="Part 2" part3="Part 3" maxNum={5} selectedNum={2} />,
      );

      expect(decodeHTML).toHaveBeenCalledWith(mockLangObj.numStatementsToSelect);
      expect(decodeHTML).toHaveBeenCalledWith(mockLangObj.currentlySelectedNumber);
    });
  });

  describe("Styled Components Background Colors", () => {
    it("renders yellow background when selectedNum is less than maxNum", () => {
      render(
        <Instructions part1="Part 1" part2="Part 2" part3="Part 3" maxNum={10} selectedNum={5} />,
      );

      const requiredText = screen.getByText(/Number of statements to select: 10/);
      const currentText = screen.getByText(/Currently selected: 5/);

      expect(requiredText).toHaveStyle({ backgroundColor: "rgb(249, 249, 0)" });
      expect(currentText).toHaveStyle({ backgroundColor: "rgb(249, 249, 0)" });
    });

    it("renders red background when selectedNum exceeds maxNum", () => {
      render(
        <Instructions part1="Part 1" part2="Part 2" part3="Part 3" maxNum={10} selectedNum={12} />,
      );

      const currentText = screen.getByText(/Currently selected: 12/);
      expect(currentText).toHaveStyle({ backgroundColor: "#ff8080" });
    });
  });

  describe("Edge Cases", () => {
    it("handles zero values for maxNum and selectedNum", () => {
      render(
        <Instructions part1="Part 1" part2="Part 2" part3="Part 3" maxNum={0} selectedNum={0} />,
      );

      expect(screen.getByText(/Number of statements to select: 0/)).toBeInTheDocument();
      expect(screen.getByText(/Currently selected: 0/)).toBeInTheDocument();
    });

    it("handles undefined part props", () => {
      const { container } = render(<Instructions maxNum={5} selectedNum={2} />);

      expect(container).toBeInTheDocument();
    });

    it("handles null part props", () => {
      const { container } = render(
        <Instructions part1={null} part2={null} part3={null} maxNum={5} selectedNum={2} />,
      );

      expect(container).toBeInTheDocument();
    });

    it("handles large numbers", () => {
      render(
        <Instructions
          part1="Part 1"
          part2="Part 2"
          part3="Part 3"
          maxNum={1000}
          selectedNum={999}
        />,
      );

      expect(screen.getByText(/Number of statements to select: 1000/)).toBeInTheDocument();
      expect(screen.getByText(/Currently selected: 999/)).toBeInTheDocument();
    });
  });

  describe("Props Validation", () => {
    it("accepts JSX elements for part props", () => {
      render(
        <Instructions
          part1={<strong>Bold part 1</strong>}
          part2={<em>Italic part 2</em>}
          part3={<span>Span part 3</span>}
          maxNum={5}
          selectedNum={2}
        />,
      );

      expect(screen.getByText("Bold part 1")).toBeInTheDocument();
      expect(screen.getByText("Italic part 2")).toBeInTheDocument();
      expect(screen.getByText("Span part 3")).toBeInTheDocument();
    });
  });
});
