import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OrientationMessage from "../mobileSortComponents/OrientationMessage";

describe("OrientationMessage Component", () => {
  it("renders the provided text correctly", () => {
    const testMessage = "Please rotate your device";

    render(<OrientationMessage text={testMessage} />);

    // Check if the h1 contains the correct text
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(testMessage);
  });

  it("is visible in the document", () => {
    render(<OrientationMessage text="Test" />);

    const container = screen.getByText("Test").parentElement;
    expect(container).toBeInTheDocument();
  });

  it("applies the correct layout styles", () => {
    render(<OrientationMessage text="Styled Test" />);

    // Grabbing the div by its child's parent
    const styledDiv = screen.getByText("Styled Test").parentElement;

    // Verifying the styled-component CSS
    expect(styledDiv).toHaveStyle({
      display: "flex",
      width: "100vw",
      height: "100vh",
    });
  });
});
