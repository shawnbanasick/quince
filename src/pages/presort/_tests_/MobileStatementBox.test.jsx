import React from "react";
import { render, screen } from "@testing-library/react";
import MobileStatementBox from "../MobileStatementBox";
import { it, expect, mock, describe, fn, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock dependencies
// vi.mock("../../globalState/useStore", () => vi.fn(() => 2));
// vi.mock("../../globalState/useSettingsStore", () =>
//   vi.fn(() => ({
//     mobilePresortEvaluationsComplete: "All done!",
//   }))
// );
vi.mock("../../utilities/decodeHTML", () => vi.fn((str) => str));
vi.mock("html-react-parser", () => vi.fn((str) => str));

describe("MobileStatementBox", () => {
  it("renders the provided statement", () => {
    render(<MobileStatementBox backgroundColor="#fff" fontSize={12} statement="Test statement" />);
    expect(screen.getByText("Test statement")).toBeInTheDocument();
  });

  // it("renders the default statement if statement prop is not provided", () => {
  //   render(<MobileStatementBox backgroundColor="#eee" fontSize={2} />);
  //   expect(screen.getByText("All done!")).toBeInTheDocument();
  // });

  // it("applies the background color and font size", () => {
  //   render(
  //     <MobileStatementBox backgroundColor="#123456" fontSize={3} statement="Styled statement" />
  //   );
  //   const container = screen.getByText("Styled statement").parentElement;
  //   expect(container).toHaveStyle("background-color: #123456");
  //   expect(container).toHaveStyle("font-size: 2vh"); // mocked useStore returns 2
  // });
});
