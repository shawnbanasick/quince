import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PresortPreventNavModal from "../PresortPreventNavModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom hooks/stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// 2. Mock the HTML decoder utility (optional, but ensures predictable output)
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((str) => str),
}));

describe("PresortPreventNavModal Component", () => {
  const mockSetTrigger = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default Mock implementation for useSettingsStore (langObj)
    useSettingsStore.mockImplementation((selector) =>
      selector({
        langObj: {
          presortPreventNavModalHead: "Warning Title",
          presortPreventNavModalText: "<p>Standard warning text</p>",
        },
      }),
    );
  });

  it("renders nothing when triggerModalOpen is false", () => {
    // Mock store to return false for open state
    useStore.mockImplementation((selector) => {
      const state = {
        triggerPresortPreventNavModal: false,
        setTriggerPresortPreventNavModal: mockSetTrigger,
      };
      return selector(state);
    });

    const { queryByText } = render(<PresortPreventNavModal />);
    expect(queryByText("Warning Title")).not.toBeInTheDocument();
  });

  it("renders modal with correct content when triggerModalOpen is true", () => {
    // Mock store to return true for open state
    useStore.mockImplementation((selector) => {
      const state = {
        triggerPresortPreventNavModal: true,
        setTriggerPresortPreventNavModal: mockSetTrigger,
      };
      return selector(state);
    });

    render(<PresortPreventNavModal />);

    // Check if Head and Content are present
    expect(screen.getByText("Warning Title")).toBeInTheDocument();
    expect(screen.getByText("Standard warning text")).toBeInTheDocument();
  });
});
