import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OverloadedColumnModal from "../OverloadedColumnModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom hooks
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the HTML decoder utility
vi.mock("../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("OverloadedColumnModal", () => {
  const mockSetTrigger = vi.fn();
  const mockLangObj = {
    sortOverloadedColumnModalHead: "Test Header",
    sortOverloadedColumnModalText: "<p>Test Content Body</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render the modal when triggerModalOpen is false", () => {
    // Setup store mocks for 'closed' state
    useSettingsStore.mockReturnValue(mockLangObj);
    useStore.mockImplementation((selector) => {
      if (selector.name === "getTriggerModalOpen") return false;
      if (selector.name === "getSetTrigOverColModal") return mockSetTrigger;
    });

    render(<OverloadedColumnModal />);

    // Check that the header text is not in the document
    expect(screen.queryByText("Test Header")).not.toBeInTheDocument();
  });

  it("should render correctly when triggerModalOpen is true", () => {
    // Setup store mocks for 'open' state
    useSettingsStore.mockReturnValue(mockLangObj);
    useStore.mockImplementation((selector) => {
      if (selector.name === "getTriggerModalOpen") return true;
      if (selector.name === "getSetTrigOverColModal") return mockSetTrigger;
    });

    render(<OverloadedColumnModal />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Content Body")).toBeInTheDocument();
  });
});
