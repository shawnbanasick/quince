import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SortColGuides from "../SortColGuides";
import useSettingsStore from "../../../globalState/useSettingsStore";

// 1. Mock the Zustand store
vi.mock("../../../globalState/useSettingsStore");

// 2. Mock the SVG imports (since they use ?react syntax)
vi.mock("../../assets/emojiN5.svg?react", () => ({
  default: () => <svg data-testid="emoji-svg" />,
}));
vi.mock("../../assets/emoji0.svg?react", () => ({
  default: () => <svg data-testid="emoji-svg" />,
}));
// ... add others as needed, or use a generic mock if you have many

describe("SortColGuides Component", () => {
  const mockMapObj = {
    qSortHeaderNumbers: [1, 2, 3],
    columnHeadersColorsArray: ["#ff0000", "#00ff00", "#0000ff"],
    colTextLabelsArray: ["Label A", "Label B", "Label C"],
    emojiArrayType: ["emoji3Array"],
    useColLabelNums: [true],
    useColLabelText: [true],
    useColLabelEmoji: [true],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    useSettingsStore.mockImplementation((selector) => selector({ mapObj: mockMapObj }));
  });

  it("renders the correct number of columns based on qSortHeaderNumbers", () => {
    render(<SortColGuides columnWidth="100" />);

    const labels = screen.getAllByText(/Label/);
    expect(labels).toHaveLength(3);
  });

  it("displays header numbers when useColLabelNums is true", () => {
    render(<SortColGuides columnWidth="100" />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("hides header numbers when useColLabelNums is false", () => {
    const hiddenNumsMap = { ...mockMapObj, useColLabelNums: [false] };
    useSettingsStore.mockImplementation((selector) => selector({ mapObj: hiddenNumsMap }));

    render(<SortColGuides columnWidth="100" />);

    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("applies the correct background color to columns", () => {
    const { container } = render(<SortColGuides columnWidth="100" />);

    // We target the styled component by looking at the child of the container
    const columns = container.querySelectorAll("#colorBarDivContainer > div");

    // Check if the first column has the red color from our mock
    expect(columns[0]).toHaveStyle(`background-color: #ff0000`);
    expect(columns[1]).toHaveStyle(`background-color: #00ff00`);
  });

  it("handles string 'false' for visibility flags correctly", () => {
    const stringFalseMap = {
      ...mockMapObj,
      useColLabelText: ["false"],
    };
    useSettingsStore.mockImplementation((selector) => selector({ mapObj: stringFalseMap }));

    render(<SortColGuides columnWidth="100" />);

    expect(screen.queryByText("Label A")).not.toBeInTheDocument();
  });
});
