import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Headers from "../Headers";
import useStore from "../../../globalState/useStore";
import headersDivStyle from "../headersDivStyle";

// 1. Mock the custom hook
vi.mock("../../../globalState/useStore");

// 2. Mock the style function to track calls or return specific values
vi.mock("../headersDivStyle", () => ({
  default: vi.fn(() => ({ backgroundColor: "red" })),
}));

describe("Headers Component", () => {
  const defaultProps = {
    qSortHeaders: ["Header A", "Header B"],
    qSortHeaderNumbers: [1, 2],
    headerColorsArray: ["#fff", "#000"],
    columnWidth: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the correct number of header divs", () => {
    // Mock store return value
    useStore.mockReturnValue({ useColLabelNumsDesktop: true });

    render(<Headers {...defaultProps} />);

    const headers = screen.getAllByText(/^[0-9]+$/);
    expect(headers).toHaveLength(defaultProps.qSortHeaderNumbers.length);
  });

  it("displays numbers when useColLabelNumsDesktop is true", () => {
    useStore.mockImplementation((selector) => {
      const state = { mapObj: { useColLabelNumsDesktop: true }, draggingOverColumnId: null };
      return selector(state);
    });

    render(<Headers {...defaultProps} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("hides numbers when useColLabelNumsDesktop is false", () => {
    useStore.mockImplementation((selector) => {
      const state = { mapObj: { useColLabelNumsDesktop: false }, draggingOverColumnId: null };
      return selector(state);
    });

    const { container } = render(<Headers {...defaultProps} />);

    // Check that the text content inside the header divs is empty
    const headerDivs = container.querySelectorAll(".headersContainer > div");
    headerDivs.forEach((div) => {
      expect(div.textContent).toBe("");
    });
  });

  it("calls headersDivStyle with the correct arguments", () => {
    const highlightedId = "col-5";
    useStore.mockImplementation((selector) => {
      const state = { mapObj: {}, draggingOverColumnId: highlightedId };
      return selector(state);
    });

    render(<Headers {...defaultProps} />);

    // Check if the style helper was called for the first item
    expect(headersDivStyle).toHaveBeenCalledWith(
      0,
      defaultProps.columnWidth,
      defaultProps.headerColorsArray,
      defaultProps.qSortHeaders,
      highlightedId,
    );
  });
});
