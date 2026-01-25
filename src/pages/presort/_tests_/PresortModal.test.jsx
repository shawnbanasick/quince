import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PresortModal from "../PresortModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock html-react-parser and decodeHTML (optional, but keeps tests clean)
vi.mock("html-react-parser", () => ({
  default: (html) => html,
}));

vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));

describe("PresortModal Component", () => {
  const mockSetTriggerPresortModal = vi.fn();

  const mockLangObj = {
    presortModalHead: "Test Header",
    presortModalText: "Test Modal Content",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default Store implementations
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));
  });

  it("should not render the modal content when triggerPresortModal is false", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerPresortModal: false,
        setTriggerPresortModal: mockSetTriggerPresortModal,
      };
      return selector(state);
    });

    render(<PresortModal />);

    // react-responsive-modal usually removes content from DOM when closed
    expect(screen.queryByText("Test Header")).not.toBeInTheDocument();
  });

  it("should render the modal with correct content when triggerPresortModal is true", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerPresortModal: true,
        setTriggerPresortModal: mockSetTriggerPresortModal,
      };
      return selector(state);
    });

    render(<PresortModal />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
  });
});
