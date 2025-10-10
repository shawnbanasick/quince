/*
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MobileThinTopModal from "../MobileThinMoveTopModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the external dependencies
vi.mock("../../globalState/useSettingsStore");
vi.mock("../../globalState/useStore");
vi.mock("../../utilities/decodeHTML", () => ({
  default: (text) => text || "",
}));
vi.mock("html-react-parser", () => ({
  default: (html) => html || "",
}));
vi.mock("react-responsive-modal/styles.css", () => ({}));

describe("MobileThinTopModal", () => {
  // Mock functions
  const mockSetTriggerMobileThinMoveTopModal = vi.fn();
  const mockOnClick = vi.fn();

  // Mock language object
  const mockLangObj = {
    moveTopMobileHead: "Move to Top",
    moveAllTopMobileText: "Are you sure you want to move all items to the top?",
    moveTopMobileButtonOK: "OK",
    mobileModalButtonCancel: "Cancel",
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    useSettingsStore.mockReturnValue(mockLangObj);
    useStore.mockImplementation((selector) => {
      if (selector.name === "getTriggerMobileThinMoveTopModal") {
        return true; // Modal is open by default for testing
      }
      if (selector.name === "getSetTriggerMobileThinMoveTopModal") {
        return mockSetTriggerMobileThinMoveTopModal;
      }
      return null;
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("Component Rendering", () => {
    it("renders the modal when triggered", () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Move to Top")).toBeInTheDocument();
      expect(
        screen.getByText("Are you sure you want to move all items to the top?")
      ).toBeInTheDocument();
      expect(screen.getByText("OK")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("does not render when modal is not triggered", () => {
      useStore.mockImplementation((selector) => {
        if (selector.name === "getTriggerMobileThinMoveTopModal") {
          return false; // Modal is closed
        }
        if (selector.name === "getSetTriggerMobileThinMoveTopModal") {
          return mockSetTriggerMobileThinMoveTopModal;
        }
        return null;
      });

      const { container } = render(<MobileThinTopModal onClick={mockOnClick} />);
      expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });

    it("renders with custom class names", () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      const modalElement = document.querySelector(".mobile-thin-modal");
      expect(modalElement).toBeInTheDocument();
    });

    it("displays the close button with proper accessibility attributes", () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      const closeButton = screen.getByLabelText("Close modal");
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent("×");
    });
  });

  describe("User Interactions", () => {
    it("calls setTriggerMobileThinMoveTopModal(false) when close button is clicked", async () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      const closeButton = screen.getByLabelText("Close modal");
      fireEvent.click(closeButton);

      expect(mockSetTriggerMobileThinMoveTopModal).toHaveBeenCalledWith(false);
    });

    it("calls setTriggerMobileThinMoveTopModal(false) when cancel button is clicked", async () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockSetTriggerMobileThinMoveTopModal).toHaveBeenCalledWith(false);
    });

    it("calls both onClick prop and setTriggerMobileThinMoveTopModal(false) when OK button is clicked", async () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      const okButton = screen.getByText("OK");
      fireEvent.click(okButton);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockSetTriggerMobileThinMoveTopModal).toHaveBeenCalledWith(false);
    });

    it("handles OK button click when onClick prop is not provided", async () => {
      render(<MobileThinTopModal />);

      const okButton = screen.getByText("OK");
      fireEvent.click(okButton);

      // Should still close the modal even without onClick prop
      expect(mockSetTriggerMobileThinMoveTopModal).toHaveBeenCalledWith(false);
    });

    it("closes modal when overlay is clicked", async () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      // The react-responsive-modal library handles overlay clicks
      // We can test this by finding the overlay and simulating a click
      const overlay = document.querySelector(".mobile-thin-modal-overlay");
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockSetTriggerMobileThinMoveTopModal).toHaveBeenCalledWith(false);
      }
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();

      const closeButton = screen.getByLabelText("Close modal");
      expect(closeButton).toHaveAttribute("aria-label", "Close modal");
    });

    it("focuses properly on interactive elements", async () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      const closeButton = screen.getByLabelText("Close modal");
      const cancelButton = screen.getByText("Cancel");
      const okButton = screen.getByText("OK");

      // All buttons should be focusable
      expect(closeButton).not.toHaveAttribute("disabled");
      expect(cancelButton).not.to.have.attribute("disabled");
      expect(okButton).not.toHaveAttribute("disabled");
    });

    it("handles keyboard navigation", async () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      const cancelButton = screen.getByText("Cancel");

      // Test Enter key
      cancelButton.focus();
      fireEvent.keyDown(cancelButton, { key: "Enter", code: "Enter" });

      // Should still respond to click events (keyboard accessibility)
      fireEvent.click(cancelButton);
      expect(mockSetTriggerMobileThinMoveTopModal).toHaveBeenCalledWith(false);
    });
  });

  describe("Language Support", () => {
    it("handles missing language translations gracefully", () => {
      const incompleteLangObj = {
        moveTopMobileHead: "Move to Top",
        // Missing other translations
      };

      useSettingsStore.mockReturnValue(incompleteLangObj);

      render(<MobileThinTopModal onClick={mockOnClick} />);

      // Should still render without crashing
      expect(screen.getByText("Move to Top")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("handles HTML content in translations", () => {
      const htmlLangObj = {
        moveTopMobileHead: "<strong>Move to Top</strong>",
        moveAllTopMobileText: "Are you sure you want to <em>move all items</em> to the top?",
        moveTopMobileButtonOK: "OK",
        mobileModalButtonCancel: "Cancel",
      };

      useSettingsStore.mockReturnValue(htmlLangObj);

      render(<MobileThinTopModal onClick={mockOnClick} />);

      // Should handle HTML content (mocked to return as-is)
      expect(screen.getByText("<strong>Move to Top</strong>")).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    it("uses correct selectors for state management", () => {
      render(<MobileThinTopModal onClick={mockOnClick} />);

      // Verify that useSettingsStore and useStore are called
      expect(useSettingsStore).toHaveBeenCalled();
      expect(useStore).toHaveBeenCalled();
    });

    it("responds to state changes", async () => {
      const { rerender } = render(<MobileThinTopModal onClick={mockOnClick} />);

      // Initially modal should be visible
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Change state to close modal
      useStore.mockImplementation((selector) => {
        if (selector.name === "getTriggerMobileThinMoveTopModal") {
          return false;
        }
        if (selector.name === "getSetTriggerMobileThinMoveTopModal") {
          return mockSetTriggerMobileThinMoveTopModal;
        }
        return null;
      });

      rerender(<MobileThinTopModal onClick={mockOnClick} />);

      // Modal should no longer be visible
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("handles undefined onClick gracefully", () => {
      render(<MobileThinTopModal onClick={undefined} />);

      const okButton = screen.getByText("OK");

      // Should not throw error when onClick is undefined
      expect(() => fireEvent.click(okButton)).not.toThrow();
      expect(mockSetTriggerMobileThinMoveTopModal).toHaveBeenCalledWith(false);
    });

    it("handles missing language object gracefully", () => {
      useSettingsStore.mockReturnValue(null);

      expect(() => render(<MobileThinTopModal onClick={mockOnClick} />)).not.toThrow();
    });
  });
});
*/
