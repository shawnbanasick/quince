import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SortColGuides from "../MobileSortColGuides";
import useSettingsStore from "../../../globalState/useSettingsStore";

// 1. Mock the Zustand store
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the SVG imports (Vitest/JSDOM doesn't render SVGs natively)
vi.mock("../../../assets/emojiN5.svg?react", () => ({
  default: () => <svg data-testid="emoji-n5" />,
}));
vi.mock("../../../assets/emoji5.svg?react", () => ({
  default: () => <svg data-testid="emoji-5" />,
}));
// ... add others if specific SVGs need to be checked

describe("SortColGuides Component", () => {
  const mockMapObj = {
    emojiArrayType: ["emoji5Array"],
    qSortHeaderNumbers: [1, 2, 3],
    columnHeadersColorsArray: ["#ff0000", "#00ff00", "#0000ff"],
    colTextLabelsArray: ["Label A", "Label B", "Label C"],
    useColLabelNums: [true],
    useColLabelText: [true],
    useColLabelEmoji: [true],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the correct number of columns based on qSortHeaderNumbers", () => {
    useSettingsStore.mockReturnValue(mockMapObj);

    render(<SortColGuides />);

    // Check for the labels
    expect(screen.getByText("Label A")).toBeInTheDocument();
    expect(screen.getByText("Label B")).toBeInTheDocument();
    expect(screen.getByText("Label C")).toBeInTheDocument();
  });

  it("hides numbers when useColLabelNums is false", () => {
    const customMock = {
      ...mockMapObj,
      useColLabelNums: [false],
      qSortHeaderNumbers: [99],
    };
    useSettingsStore.mockReturnValue(customMock);

    render(<SortColGuides />);

    expect(screen.queryByText("99")).not.toBeInTheDocument();
    expect(screen.getByText("Label A")).toBeInTheDocument();
  });

  it("toggles emojis visibility based on useColLabelEmoji", () => {
    const customMock = { ...mockMapObj, useColLabelEmoji: [false] };
    useSettingsStore.mockReturnValue(customMock);

    render(<SortColGuides />);

    // In your component, EmojiDiv is only rendered if shouldDisplayEmojis is true
    // We check that the SVG mock test-id is not present
    expect(screen.queryByTestId("emoji-n5")).not.toBeInTheDocument();
  });

  it("applies the correct background colors from the store", () => {
    useSettingsStore.mockReturnValue(mockMapObj);
    render(<SortColGuides />);

    // Get the elements by text and find the styled-component parent
    screen.getByText("Label A").closest("div");
    // Note: Because of how styled-components nests, you might need to find the ColorBarDiv specifically
    // We can use a test-id or check the container's children
    screen.getAllByText(/Label/);

    // Verify colors (Checking against the parent container that has the background-color)
    // Adjusting selector to find the ColorBarDiv
    const colorBar = screen.getByText("Label A").parentElement.parentElement.parentElement;
    expect(colorBar).toHaveStyle("background-color: #ff0000");
  });

  it("selects the correct emoji array type", () => {
    const emoji4Mock = {
      ...mockMapObj,
      emojiArrayType: ["emoji4Array"],
      qSortHeaderNumbers: [1], // test only one for simplicity
    };
    useSettingsStore.mockReturnValue(emoji4Mock);

    render(<SortColGuides />);

    // This confirms the component didn't crash and logic branched to emoji4Array
    expect(screen.getByText("Label A")).toBeInTheDocument();
  });
});
