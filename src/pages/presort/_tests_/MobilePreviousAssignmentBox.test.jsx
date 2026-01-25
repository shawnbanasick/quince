import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobilePreviousAssignmentBox from "../MobilePreviousAssignmentBox";
import useStore from "../../../globalState/useStore";

// 1. Mock the Store
vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the SVG import (Vitest/Vite specific)
vi.mock("../../../assets/redoArrow.svg?react", () => ({
  default: () => <svg data-testid="redo-arrow" />,
}));

describe("MobilePreviousAssignmentBox", () => {
  const mockOnClick = vi.fn();
  const mockStatements = [
    { id: "1", statement: "Test Statement 1", color: "red" },
    { id: "2", statement: "Test Statement 2", color: "blue" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // 3. Mock LocalStorage
    const mockStorage = {
      m_FontSizeObject: JSON.stringify({ presort: 2 }),
      m_ViewSizeObject: JSON.stringify({ presort: 50 }),
    };

    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => mockStorage[key]);

    // 4. Mock Store implementation
    useStore.mockImplementation((selector) => {
      const state = { mobilePresortFontSize: 2, mobilePresortViewSize: 50 };
      return selector(state);
    });
  });

  it("renders the correct number of statements", () => {
    render(<MobilePreviousAssignmentBox statements={mockStatements} onClick={mockOnClick} />);

    expect(screen.getByText("Test Statement 1")).toBeInTheDocument();
    expect(screen.getByText("Test Statement 2")).toBeInTheDocument();
  });

  it("correctly handles font size from store vs localStorage", () => {
    // Force a mismatch between store and localStorage
    useStore.mockImplementation((selector) => {
      const state = { mobilePresortFontSize: 5, mobilePresortViewSize: 50 };
      return selector(state);
    });

    render(<MobilePreviousAssignmentBox statements={mockStatements} onClick={mockOnClick} />);

    // The component logic says: if store !== localStorage, use localStorage value
    // Note: Testing styled-components props usually requires checking computed styles
    // or ensuring the logic passed to the styled component is correct.
    const statementDiv = screen.getByText("Test Statement 1").closest("div").parentElement;
    // The persisted value in our beforeEach is 2
    expect(statementDiv).toHaveStyle(`font-size: 2vh`);
  });
});
