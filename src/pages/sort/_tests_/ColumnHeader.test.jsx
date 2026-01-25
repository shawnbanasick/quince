import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ColumnHeader from "../mobileSortComponents/ColumnHeader";
import "@testing-library/jest-dom";

describe("ColumnHeader Component", () => {
  const defaultProps = {
    color: "rgb(255, 0, 0)",
    value: "10",
    textHeader: "Test Header",
    emoji: "🚀",
  };

  it("renders with the correct background color", () => {
    const { container } = render(<ColumnHeader {...defaultProps} />);
    // The first child should be our ColorBarDiv
    expect(container.firstChild).toHaveStyle(`background-color: ${defaultProps.color}`);
  });

  it("renders emojis when shouldDisplayEmojis is true", () => {
    render(<ColumnHeader {...defaultProps} shouldDisplayEmojis={true} />);

    // There are two EmojiDivs in your component
    const emojis = screen.getAllByText("🚀");
    expect(emojis).toHaveLength(2);
  });

  it("does not render emojis when shouldDisplayEmojis is false", () => {
    render(<ColumnHeader {...defaultProps} shouldDisplayEmojis={false} />);

    const emoji = screen.queryByText("🚀");
    expect(emoji).not.toBeInTheDocument();
  });

  it("renders the number when shouldDisplayNums is true", () => {
    render(<ColumnHeader {...defaultProps} shouldDisplayNums={true} />);

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders the text header when shouldDisplayText is true", () => {
    render(<ColumnHeader {...defaultProps} shouldDisplayText={true} />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
  });

  it("handles empty or missing props gracefully", () => {
    render(<ColumnHeader shouldDisplayNums={true} value={null} shouldDisplayText={false} />);

    // Check that the Number div exists but is empty (or contains null)
    const numberDiv = screen.queryByText("Test Header");
    expect(numberDiv).not.toBeInTheDocument();
  });
});
