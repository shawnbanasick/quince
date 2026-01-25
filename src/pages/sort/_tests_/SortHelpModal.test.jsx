import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SortHelpModal from "../SortHelpModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the external stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the utilities
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (val) => val, // Return as-is for testing
}));

describe("SortHelpModal Component", () => {
  const mockSetTriggerSortModal = vi.fn();

  const mockLangObj = {
    sortHelpModalHead: "Test Header Content",
    sortHelpModalText: "<p>Test body content</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default store behavior: Modal is open
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));

    useStore.mockImplementation((selector) => {
      const state = {
        triggerSortModal: true,
        setTriggerSortModal: mockSetTriggerSortModal,
      };
      return selector(state);
    });
  });

  it("renders the modal with correct content when triggerSortModal is true", () => {
    render(<SortHelpModal />);

    expect(screen.getByText("Test Header Content")).toBeInTheDocument();
    expect(screen.getByText("Test body content")).toBeInTheDocument();
  });

  it("does not render the modal content when triggerSortModal is false", () => {
    // Override store for this specific test
    useStore.mockImplementation((selector) =>
      selector({
        triggerSortModal: false,
        setTriggerSortModal: mockSetTriggerSortModal,
      }),
    );

    render(<SortHelpModal />);

    expect(screen.queryByText("Test Header Content")).not.toBeInTheDocument();
  });

  it("decodes and parses HTML content correctly", () => {
    const complexLang = {
      sortHelpModalHead: "<strong>Bold Title</strong>",
      sortHelpModalText: "<ul><li>Item 1</li></ul>",
    };
    useSettingsStore.mockImplementation((selector) => selector({ langObj: complexLang }));

    render(<SortHelpModal />);

    // Check if the HTML was parsed into actual elements
    const boldTitle = screen.getByText("Bold Title");
    expect(boldTitle.tagName).toBe("STRONG");

    expect(screen.getByRole("listitem")).toHaveTextContent("Item 1");
  });
});
