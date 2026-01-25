import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ThemeProvider } from "styled-components";
import SortColumn from "../mobileSortComponents/SortColumn";

// Mocking SortItem to isolate SortColumn tests
vi.mock("../mobileSortComponents/SortItem", () => ({
  default: ({ item, fontSize }) => (
    <div data-testid="sort-item" data-fontsize={fontSize}>
      {item.name}
    </div>
  ),
}));

// Mock theme for styled-components
const theme = {
  mobileText: "#000000",
};

const defaultProps = {
  items: [{ name: "Item 1" }, { name: "Item 2" }],
  header: "Rankings",
  color: "rgb(255, 0, 0)",
  mobileSortFontSize: 16,
  persistedMobileSortFontSize: 16,
  onCardSelected: vi.fn(),
  onClickUp: vi.fn(),
  onClickDown: vi.fn(),
};

const renderWithTheme = (ui) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("SortColumn Component", () => {
  it("renders the header twice (top and bottom)", () => {
    renderWithTheme(<SortColumn {...defaultProps} />);
    const labels = screen.getAllByText(defaultProps.header);
    expect(labels).toHaveLength(2);
  });

  it("renders the correct number of SortItem components", () => {
    renderWithTheme(<SortColumn {...defaultProps} />);
    const items = screen.getAllByTestId("sort-item");
    expect(items).toHaveLength(defaultProps.items.length);
  });

  it("applies the background color passed via props", () => {
    const { container } = renderWithTheme(<SortColumn {...defaultProps} />);
    // The first child of the render output is the Column styled-div
    const column = container.firstChild;
    expect(column).toHaveStyle(`background-color: ${defaultProps.color}`);
  });

  describe("Font Size Logic", () => {
    it("uses mobileSortFontSize when it matches persistedMobileSortFontSize", () => {
      renderWithTheme(
        <SortColumn {...defaultProps} mobileSortFontSize={20} persistedMobileSortFontSize={20} />,
      );
      const item = screen.getAllByTestId("sort-item")[0];
      expect(item.getAttribute("data-fontsize")).toBe("20");
    });

    it("uses persistedMobileSortFontSize when mobileSortFontSize does not match", () => {
      renderWithTheme(
        <SortColumn {...defaultProps} mobileSortFontSize={20} persistedMobileSortFontSize={12} />,
      );
      const item = screen.getAllByTestId("sort-item")[0];
      // Note: your component logic says if they aren't equal, use persistedMobileSortFontSize
      expect(item.getAttribute("data-fontsize")).toBe("12");
    });
  });
});
