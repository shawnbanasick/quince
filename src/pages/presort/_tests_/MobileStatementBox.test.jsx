import { render, screen } from "@testing-library/react";
import MobileStatementBox from "../MobileStatementBox";
import { it, expect, describe, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));
vi.mock("html-react-parser", () => ({
  default: (str) => str,
}));

describe("MobileStatementBox", () => {
  it("renders the provided statement", () => {
    render(<MobileStatementBox backgroundColor="#fff" fontSize={12} statement="Test statement" />);
    expect(screen.getByTestId("MobileStatementBoxDiv")).toBeInTheDocument();
  });

  it("renders the default statement if statement prop is not provided", () => {
    render(<MobileStatementBox backgroundColor="#eee" fontSize={2} />);
    expect(screen.getByTestId("MobileStatementBoxDiv")).toBeInTheDocument();
  });

  it("applies the background color and font size", () => {
    render(
      <MobileStatementBox backgroundColor="#83cafe" fontSize={3} statement="Styled statement" />
    );
    const container = screen.getByTestId("MobileStatementBoxDiv");
    expect(container).toHaveStyle({ backgroundColor: "#83cafe" });
    expect(container).toHaveStyle({ fontSize: "3" });
  });
});
