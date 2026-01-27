import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VerticalList from "../VerticalList";

vi.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }) => <div>{children}</div>,
  Droppable: ({ children }) =>
    children({
      draggableProps: {},
      innerRef: vi.fn(),
      placeholder: <div data-testid="placeholder" />,
    }),
  Draggable: ({ children }) =>
    children({
      draggableProps: {},
      dragHandleProps: {},
      innerRef: vi.fn(),
    }),
}));

const mockItems = [
  { id: "1", statement: "Test Item 1", color: "red" },
  { id: "2", statement: "Test Item 2", color: "blue" },
];

describe("VerticalList Component", () => {
  it("renders the correct number of items based on props", () => {
    render(<VerticalList items={mockItems} />);

    expect(screen.getByText("Test Item 1")).toBeInTheDocument();
    expect(screen.getByText("Test Item 2")).toBeInTheDocument();
  });

  it("calls the onClick handler when an item is clicked", () => {
    const handleClick = vi.fn();
    render(<VerticalList items={mockItems} onClick={handleClick} />);

    const firstItem = screen.getByText("Test Item 1");
    fireEvent.click(firstItem);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("logs the first item to the console on render", () => {
    const consoleSpy = vi.spyOn(console, "log");
    render(<VerticalList items={mockItems} />);

    expect(consoleSpy).toHaveBeenCalled();
    // Verify it logged the JSON stringified version of the first item
    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(mockItems[0], null, 2));

    consoleSpy.mockRestore();
  });
});
