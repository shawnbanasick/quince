import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PresortIsComplete from "../PresortIsComplete";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom hooks
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// 2. Mock external utilities to simplify output
vi.mock("html-react-parser", () => ({
  default: vi.fn((html) => html),
}));
vi.mock("../../utilities/decodeHTML", () => ({
  default: vi.fn((html) => html),
}));

describe("PresortIsComplete Component", () => {
  const mockSetCurrentPage = vi.fn();

  const mockSettings = {
    langObj: {
      stepCompleteMessage: "Process Finished",
      titleBarText: "Completion Page",
    },
    configObj: {
      headerBarColor: "#ff0000",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup hook returns
    useSettingsStore.mockImplementation((selector) => selector(mockSettings));
    useStore.mockImplementation(() => {
      // Logic to return the mock function when the specific selector is called
      return mockSetCurrentPage;
    });
  });

  it("renders the title bar and main text from state", () => {
    render(<PresortIsComplete />);

    expect(screen.getByText("Completion Page")).toBeInTheDocument();
    expect(screen.getByText("Process Finished")).toBeInTheDocument();
  });

  it("applies the correct background color to the TitleBar", () => {
    render(<PresortIsComplete />);

    const titleBar = screen.getByText("Completion Page");
    // Checking styled-components prop injection
    expect(titleBar).toHaveStyle(`background-color: #ff0000`);
  });

  it("calls setCurrentPage with 'presort' on mount", () => {
    render(<PresortIsComplete />);

    expect(mockSetCurrentPage).toHaveBeenCalledWith("presort");
    expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
  });
});
