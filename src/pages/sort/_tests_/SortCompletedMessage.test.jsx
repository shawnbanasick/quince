import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SortCompletedMessageBox from "../SortCompletedMessage";
import useStore from "../../../globalState/useStore";

// 1. Mock the useStore hook
vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

describe("SortCompletedMessageBox", () => {
  const mockSetDisplayPostsort = vi.fn();
  const mockSetDisplaySort = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when sortCompleted is false", () => {
    // Mock store state
    useStore.mockImplementation((selector) => {
      if (selector.name === "getSortCompleted") return false;
      return null;
    });

    const { container } = render(<SortCompletedMessageBox sortCompleteText="All done!" />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the message and button when sortCompleted is true", () => {
    // Mock store state
    useStore.mockImplementation((selector) => {
      if (selector.name === "getSortCompleted") return true;
      return null;
    });

    render(<SortCompletedMessageBox sortCompleteText="All done!" />);

    expect(screen.getByText("All done!")).toBeDefined();
    expect(screen.getByRole("button", { name: /next/i })).toBeDefined();
  });

  it("calls the correct store actions when the button is clicked", () => {
    // Mock store state and actions
    useStore.mockImplementation((selector) => {
      if (selector.name === "getSortCompleted") return true;
      if (selector.name === "getSetDisplayPostsort") return mockSetDisplayPostsort;
      if (selector.name === "getSetDisplaySort") return mockSetDisplaySort;
      return null;
    });

    render(<SortCompletedMessageBox sortCompleteText="Success" />);

    const button = screen.getByRole("button", { name: /next/i });
    fireEvent.click(button);

    expect(mockSetDisplayPostsort).toHaveBeenCalledWith(true);
    expect(mockSetDisplaySort).toHaveBeenCalledWith(false);
  });
});
