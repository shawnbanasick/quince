import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConsentModal from "../ConsentModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the external dependencies
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (text) => text || "",
}));
vi.mock("html-react-parser", () => ({
  default: (html) => html || "",
}));
vi.mock("react-responsive-modal/styles.css", () => ({}));

describe("ConsentModal", () => {
  // Mock functions
  const mockSetTriggerConsentModal = vi.fn();
  const mockOnClose = vi.fn();
  const mockOpen = vi.fn();

  // Mock language object
  const mockLangObj = {
    consentHelpModalHead: "Contact Information",
    consentHelpModalText: "Here is the information",
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    useSettingsStore.mockReturnValue(mockLangObj);
    useStore.mockImplementation((selector) => {
      if (selector.name === "getTriggerConsentModal") {
        return true; // Modal is open by default for testing
      }
      if (selector.name === "getSetTriggerConsentModal") {
        return mockSetTriggerConsentModal;
      }
      return null;
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("Component Rendering", () => {
    it("renders the modal when triggered", () => {
      render(<ConsentModal onClose={mockOnClose} open={mockOpen} />);

      expect(screen.getByTestId("root")).toBeInTheDocument();
      expect(screen.getByText("Here is the information")).toBeInTheDocument();
      expect(screen.getByText("Contact Information")).toBeInTheDocument();
    });
  });
});
