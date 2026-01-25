import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SortStatementsContainer from "../mobileSortComponents/SortStatementContainer";

// 1. Mock the child component to isolate the container logic
vi.mock("../mobileSortComponents/SortColumn", () => ({
  default: ({ items, header, color }) => (
    <div data-testid="mock-sort-column">
      <span data-testid="column-header">{header}</span>
      <span data-testid="column-color">{color}</span>
      <ul data-testid="item-list">
        {items.map((item) => (
          <li key={item.externalIndex}>{item.text}</li>
        ))}
      </ul>
    </div>
  ),
}));

describe("SortStatementsContainer", () => {
  const defaultProps = {
    partitionArray: [[{ text: "Item 1" }, { text: "Item 2" }], [{ text: "Item 3" }]],
    characteristicsArray: [{ color: "red" }, { color: "blue" }, { color: "green" }],
    mobileColHeaders: ["Header A", "Header B"],
    mobileSortFontSize: "16px",
    mobileSortViewSize: 50,
    persistedMobileSortFontSize: "16px",
    persistedMobileSortViewSize: 50,
    onCardSelected: vi.fn(),
    onClickUp: vi.fn(),
    onClickDown: vi.fn(),
    onScroll: vi.fn(),
  };

  it("renders the correct number of SortColumn components", () => {
    render(<SortStatementsContainer {...defaultProps} />);
    const columns = screen.getAllByTestId("mock-sort-column");
    expect(columns).toHaveLength(defaultProps.partitionArray.length);
  });

  it("correctly maps characteristics and externalIndex to items", () => {
    render(<SortStatementsContainer {...defaultProps} />);

    // Check first column items
    const lists = screen.getAllByTestId("item-list");
    expect(lists[0].children).toHaveLength(2); // Item 1 and 2
    expect(lists[1].children).toHaveLength(1); // Item 3
  });

  it("passes the correct header and color to each SortColumn", () => {
    render(<SortStatementsContainer {...defaultProps} />);

    const headers = screen.getAllByTestId("column-header");
    const colors = screen.getAllByTestId("column-color");

    expect(headers[0].textContent).toBe("Header A");
    expect(headers[1].textContent).toBe("Header B");

    // In your code, color is derived from characteristicsArray[externalIndex]
    // where externalIndex is the last index of that sub-array.
    expect(colors[0].textContent).toBe("blue"); // index 1 (end of first sub-array)
    expect(colors[1].textContent).toBe("green"); // index 2 (end of second sub-array)
  });

  it("uses mobileSortViewSize when it matches persistedMobileSortViewSize", () => {
    const { container } = render(
      <SortStatementsContainer
        {...defaultProps}
        mobileSortViewSize={60}
        persistedMobileSortViewSize={60}
      />,
    );
    // Check the styled component's height (which is dynamic based on viewSize)
    const styledDiv = container.firstChild;
    expect(styledDiv).toHaveStyle("height: 60vh");
  });

  it("uses persistedMobileSortViewSize when sizes do not match", () => {
    const { container } = render(
      <SortStatementsContainer
        {...defaultProps}
        mobileSortViewSize={40}
        persistedMobileSortViewSize={80}
      />,
    );
    const styledDiv = container.firstChild;
    expect(styledDiv).toHaveStyle("height: 80vh");
  });
});
