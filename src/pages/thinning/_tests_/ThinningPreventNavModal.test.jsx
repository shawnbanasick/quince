import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ThinningPreventNavModal from "../ThinningPreventNavModal";
import useStore from "../../../globalState/useStore";
import useSettingsStore from "../../../globalState/useSettingsStore";

// 1. Mock the external stores
vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the HTML decoder utility
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str, // Return string as-is for testing
}));

describe("ThinningPreventNavModal", () => {
  const mockSetTrigger = vi.fn();

  const mockLangObj = {
    thinningPreventNavModalHead: "Warning Header",
    thinningPreventNavModalText: "This is the modal body text.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the modal with correct content when open is true", () => {
    // Setup mocks for 'open' state
    useSettingsStore.mockReturnValue(mockLangObj);
    useStore.mockImplementation((selector) => {
      if (selector.name === "getTriggerThinningPreventNavModal") return true;
      if (selector.name === "getSetTriggerThinningPreventNavModal") return mockSetTrigger;
    });

    render(<ThinningPreventNavModal />);

    // Check if header and content are in the document
    expect(screen.getByText("Warning Header")).toBeInTheDocument();
    expect(screen.getByText("This is the modal body text.")).toBeInTheDocument();
  });

  it("should not be visible when open is false", () => {
    // Setup mocks for 'closed' state
    useSettingsStore.mockReturnValue(mockLangObj);
    useStore.mockImplementation((selector) => {
      if (selector.name === "getTriggerThinningPreventNavModal") return false;
      return mockSetTrigger;
    });

    render(<ThinningPreventNavModal />);

    // In react-responsive-modal, if 'open' is false, content is usually not in DOM
    expect(screen.queryByText("Warning Header")).not.toBeInTheDocument();
  });
});
