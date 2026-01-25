import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PresortPreventNavModal from "../PreventSortNavModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the Global Stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock external utilities
vi.mock("../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("PresortPreventNavModal", () => {
  const mockSetTrigger = vi.fn();

  const mockLangObj = {
    sortPreventNavModalHead: "Warning Title",
    sortPreventNavModalText: "<p>Warning Content</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default Store implementations
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));
    useStore.mockImplementation((selector) => {
      const state = {
        triggerSortPreventNavModal: true,
        setTriggerSortPreventNavModal: mockSetTrigger,
      };
      return selector(state);
    });
  });

  it("renders the modal with correct content when triggerModalOpen is true", () => {
    render(<PresortPreventNavModal />);

    expect(screen.getByText("Warning Title")).toBeInTheDocument();
    expect(screen.getByText("Warning Content")).toBeInTheDocument();
  });

  it("does not render the content when triggerModalOpen is false", () => {
    // Override store for this specific test
    useStore.mockImplementation((selector) =>
      selector({
        triggerSortPreventNavModal: false,
        setTriggerSortPreventNavModal: mockSetTrigger,
      }),
    );

    render(<PresortPreventNavModal />);

    expect(screen.queryByText("Warning Title")).not.toBeInTheDocument();
  });
});
