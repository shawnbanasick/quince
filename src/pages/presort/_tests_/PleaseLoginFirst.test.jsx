import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PleaseLogInFirst from "../PleaseLogInFirst";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// Mock the utilities
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((text) => text), // Return text as-is for simplicity
}));

describe("PleaseLogInFirst Component", () => {
  const mockSetCurrentPage = vi.fn();

  const mockLangObj = {
    logInFirst: "Please log in to continue",
    titleBarText: "Access Denied",
  };

  const mockConfigObj = {
    headerBarColor: "rgb(255, 0, 0)",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup store mock returns
    useSettingsStore.mockImplementation((selector) => {
      const state = { langObj: mockLangObj, configObj: mockConfigObj };
      return selector(state);
    });

    useStore.mockImplementation((selector) => {
      const state = { setCurrentPage: mockSetCurrentPage };
      return selector(state);
    });
  });

  it("renders the title bar and main content with correct text", () => {
    render(<PleaseLogInFirst />);

    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.getByText("Please log in to continue")).toBeInTheDocument();
  });

  it("applies the correct background color from config to the title bar", () => {
    render(<PleaseLogInFirst />);

    const titleBar = screen.getByText("Access Denied");
    // Styled-components injects the style, we check the computed value
    expect(titleBar).toHaveStyle(`background-color: ${mockConfigObj.headerBarColor}`);
  });

  it("calls setCurrentPage with 'presort' on mount", () => {
    render(<PleaseLogInFirst />);

    expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentPage).toHaveBeenCalledWith("presort");
  });
});
