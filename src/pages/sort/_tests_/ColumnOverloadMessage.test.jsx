import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ColumnOverloadMessage from "../ColumnOverloadMessage";
import useStore from "../../../globalState/useStore";

// 1. Mock the useStore hook
vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

describe("ColumnOverloadMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the message when columnOverload is true", () => {
    // 2. Setup mock return values for the 'overloaded' state
    useStore.mockImplementation((selector) => {
      const mockState = {
        columnOverload: true,
        overloadedColumn: "In Progress",
      };
      return selector(mockState);
    });

    render(<ColumnOverloadMessage />);

    // 3. Assertions
    const message = screen.getByText(/Column In Progress has too many cards/i);
    expect(message).toBeInTheDocument();
  });

  it("should return null (render nothing) when columnOverload is false", () => {
    // 2. Setup mock return values for the 'normal' state
    useStore.mockImplementation((selector) => {
      const mockState = {
        columnOverload: false,
        overloadedColumn: null,
      };
      return selector(mockState);
    });

    const { container } = render(<ColumnOverloadMessage />);

    // 3. Assertions
    expect(container.firstChild).toBeNull();
  });
});
