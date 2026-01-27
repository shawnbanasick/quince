import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NoPageFound from "../NoPageFound";

describe("NoPageFound Component", () => {
  it("renders the 404 heading", () => {
    render(<NoPageFound />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("404");
  });

  it('renders the "Page doesn\'t exist" message', () => {
    render(<NoPageFound />);

    const message = screen.getByText(/page doesn't exist/i);
    expect(message).toBeInTheDocument();
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(<NoPageFound />);
    expect(asFragment()).toMatchSnapshot();
  });
});
