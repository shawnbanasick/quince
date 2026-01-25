import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import NumberCardsSortedMessage from "../NumberCardsSortedMessage";
import useStore from "../../../globalState/useStore";

// Mock the module
vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

describe("NumberCardsSortedMessage", () => {
  const totalStatements = 10;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the correct message when isSortingCards is true", () => {
    // 1st call: numSortedStatements (5)
    // 2nd call: isSortingCards (true)
    vi.mocked(useStore).mockReturnValueOnce(5).mockReturnValueOnce(true);

    render(<NumberCardsSortedMessage totalStatements={totalStatements} />);

    expect(screen.getByText(/5 of 10 cards sorted/i)).toBeInTheDocument();
  });

  it("returns null when isSortingCards is false", () => {
    // 1st call: numSortedStatements (0)
    // 2nd call: isSortingCards (false)
    vi.mocked(useStore).mockReturnValueOnce(0).mockReturnValueOnce(false);

    const { container } = render(<NumberCardsSortedMessage totalStatements={totalStatements} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders correctly with different props", () => {
    vi.mocked(useStore).mockReturnValueOnce(2).mockReturnValueOnce(true);

    render(<NumberCardsSortedMessage totalStatements={20} />);

    expect(screen.getByText(/2 of 20 cards sorted/i)).toBeInTheDocument();
  });
});
