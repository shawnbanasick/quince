import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider } from "styled-components";
import SelectionNumberDisplay from "../SelectedNumberDisplay";
import useSettingsStore from "../../../globalState/useSettingsStore";

// 1. Mock the store
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the utility (optional, but keeps tests clean)
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

const mockTheme = {
  mobileText: "#000000",
};

const renderWithTheme = (ui) => {
  return render(<ThemeProvider theme={mockTheme}>{ui}</ThemeProvider>);
};

describe("SelectedNumberDisplay", () => {
  beforeEach(() => {
    // Default mock return for the store
    useSettingsStore.mockReturnValue({
      mobileThinSelectedText: "Selected",
    });
  });

  it("renders the correct text and numbers", () => {
    renderWithTheme(<SelectionNumberDisplay selected={2} required={5} />);

    expect(screen.getByText("Selected: 2 / 5")).toBeInTheDocument();
  });

  it("defaults to 0 / 0 if props are missing", () => {
    renderWithTheme(<SelectionNumberDisplay />);

    expect(screen.getByText("Selected: 0 / 0")).toBeInTheDocument();
  });

  it("shows green background (#BCF0DA) when selection equals required", () => {
    const { container } = renderWithTheme(<SelectionNumberDisplay selected={5} required={5} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle("background-color: #BCF0DA");
  });

  it("shows red background (#FFC5D3) when selection exceeds required", () => {
    const { container } = renderWithTheme(<SelectionNumberDisplay selected={6} required={5} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle("background-color: #FFC5D3");
  });
});
