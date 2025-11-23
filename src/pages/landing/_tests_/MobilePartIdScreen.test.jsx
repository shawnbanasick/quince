import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobilePartIdScreen from "../MobilePartIdScreen";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// Mock the child component
vi.mock("../LogInSubmitButton", () => ({
  default: ({ onClick, size, width, height }) => (
    <button onClick={onClick} data-testid="submit-button">
      Submit
    </button>
  ),
}));

// Mock utilities
vi.mock("html-react-parser", () => ({
  default: (text) => text,
}));

vi.mock("../../../utilities/decodeHTML", () => ({
  default: (text) => text,
}));

describe("MobilePartIdScreen", () => {
  // Mock state values
  const mockSetUserInputPartId = vi.fn();
  const mockSetDisplayLandingContent = vi.fn();
  const mockSetPartId = vi.fn();
  const mockSetDisplayNextButton = vi.fn();
  const mockSetIsLoggedIn = vi.fn();
  const mockSetDisplayPartIdWarning = vi.fn();

  const defaultLangObj = {
    loginHeaderText: "Mobile Login",
    loginPartIdText: "Enter Participant ID",
    partIdWarning: "Participant ID is required",
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Setup default mock implementations
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: defaultLangObj,
      };
      return selector(state);
    });

    useStore.mockImplementation((selector) => {
      const state = {
        displayPartIdWarning: false,
        userInputPartId: "",
        setUserInputPartId: mockSetUserInputPartId,
        setDisplayLandingContent: mockSetDisplayLandingContent,
        setPartId: mockSetPartId,
        setDisplayNextButton: mockSetDisplayNextButton,
        setIsLoggedIn: mockSetIsLoggedIn,
        setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
      };
      return selector(state);
    });

    // Mock localStorage
    Storage.prototype.setItem = vi.fn();

    // Mock console.log
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render login header text", () => {
      render(<MobilePartIdScreen />);
      expect(screen.getByText("Mobile Login")).toBeInTheDocument();
    });

    it("should render participant ID label", () => {
      render(<MobilePartIdScreen />);
      expect(screen.getByText("Enter Participant ID")).toBeInTheDocument();
    });

    it("should render input field", () => {
      render(<MobilePartIdScreen />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should render submit button", () => {
      render(<MobilePartIdScreen />);
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("should have input with autoCapitalize none", () => {
      render(<MobilePartIdScreen />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("autoCapitalize", "none");
    });

    it("should render horizontal rule separator", () => {
      const { container } = render(<MobilePartIdScreen />);
      const hr = container.querySelector("hr");
      expect(hr).toBeInTheDocument();
    });
  });

  describe("Initial State", () => {
    it("should call setDisplayNextButton(false) on mount", () => {
      render(<MobilePartIdScreen />);
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(false);
    });

    it("should not display warning initially", () => {
      render(<MobilePartIdScreen />);
      expect(screen.queryByText("Participant ID is required")).not.toBeInTheDocument();
    });
  });

  describe("Warning Display", () => {
    it("should display participant ID warning when flag is true", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: true,
          userInputPartId: "",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      expect(screen.getByText("Participant ID is required")).toBeInTheDocument();
    });

    it("should not display warning when flag is false", () => {
      render(<MobilePartIdScreen />);
      expect(screen.queryByText("Participant ID is required")).not.toBeInTheDocument();
    });
  });

  describe("Submit Button Click - Successful Login", () => {
    it("should successfully log in with valid participant ID", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "MOBILE123",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(mockSetDisplayLandingContent).toHaveBeenCalledWith(true);
      expect(mockSetPartId).toHaveBeenCalledWith("MOBILE123");
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      expect(localStorage.setItem).toHaveBeenCalledWith("partId", "MOBILE123");
    });

    it("should accept single character participant ID", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "A",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(mockSetDisplayLandingContent).toHaveBeenCalledWith(true);
      expect(mockSetPartId).toHaveBeenCalledWith("A");
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    });

    it("should set all login state correctly on successful submission", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "VALID_ID",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      // Verify the sequence and values
      expect(mockSetDisplayLandingContent).toHaveBeenCalledWith(true);
      expect(mockSetPartId).toHaveBeenCalledWith("VALID_ID");
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      expect(localStorage.setItem).toHaveBeenCalledWith("partId", "VALID_ID");
    });
  });

  describe("Submit Button Click - Invalid Input", () => {
    it("should show warning when participant ID is empty", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(mockSetDisplayPartIdWarning).toHaveBeenCalledWith(true);
      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    it("should hide warning after 5 seconds", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(mockSetDisplayPartIdWarning).toHaveBeenCalledWith(true);

      vi.advanceTimersByTime(5000);

      expect(mockSetDisplayPartIdWarning).toHaveBeenCalledWith(false);
    });

    it("should not set login state when validation fails", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
      expect(mockSetPartId).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("Enter Key Press - Successful Login", () => {
    it("should successfully log in when Enter key is pressed with valid ID", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "MOBILE123",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(console.log).toHaveBeenCalledWith("Enter");
      expect(mockSetDisplayLandingContent).toHaveBeenCalledWith(true);
      expect(mockSetPartId).toHaveBeenCalledWith("MOBILE123");
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      expect(localStorage.setItem).toHaveBeenCalledWith("partId", "MOBILE123");
    });

    it("should accept single character ID on Enter press", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "X",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayLandingContent).toHaveBeenCalledWith(true);
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    });

    it("should log Enter keypress to console", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "TEST",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(console.log).toHaveBeenCalledWith("Enter");
    });
  });

  describe("Enter Key Press - Invalid Input", () => {
    it("should show warning when Enter is pressed with empty ID", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayPartIdWarning).toHaveBeenCalledWith(true);
      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
    });

    it("should hide warning after 5 seconds on Enter press", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayPartIdWarning).toHaveBeenCalledWith(true);

      vi.advanceTimersByTime(5000);

      expect(mockSetDisplayPartIdWarning).toHaveBeenCalledWith(false);
    });

    it("should not trigger login when non-Enter key is pressed", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "VALID_ID",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);

      fireEvent.keyUp(window, { key: "Tab" });

      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    it("should not log to console when non-Enter key is pressed", () => {
      render(<MobilePartIdScreen />);

      fireEvent.keyUp(window, { key: "a" });

      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe("Event Listener Cleanup", () => {
    it("should remove keyup event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = render(<MobilePartIdScreen />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("keyup", expect.any(Function));
    });

    it("should add keyup event listener on mount", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      render(<MobilePartIdScreen />);

      expect(addEventListenerSpy).toHaveBeenCalledWith("keyup", expect.any(Function));
    });
  });

  describe("localStorage Integration", () => {
    it("should store participant ID in localStorage on successful submit", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "STORED_ID",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(localStorage.setItem).toHaveBeenCalledWith("partId", "STORED_ID");
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it("should store participant ID in localStorage on Enter press", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "ENTER_ID",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(localStorage.setItem).toHaveBeenCalledWith("partId", "ENTER_ID");
    });

    it("should not store to localStorage when validation fails", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("Validation Logic", () => {
    it("should validate that length > 0 is required", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(mockSetDisplayPartIdWarning).toHaveBeenCalledWith(true);
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    it("should accept any non-empty string as valid", () => {
      const testIds = ["1", "a", " ", "!@#$%", "很长的参与者ID"];

      testIds.forEach((testId) => {
        vi.clearAllMocks();

        useStore.mockImplementation((selector) => {
          const state = {
            displayPartIdWarning: false,
            userInputPartId: testId,
            setUserInputPartId: mockSetUserInputPartId,
            setDisplayLandingContent: mockSetDisplayLandingContent,
            setPartId: mockSetPartId,
            setDisplayNextButton: mockSetDisplayNextButton,
            setIsLoggedIn: mockSetIsLoggedIn,
            setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
          };
          return selector(state);
        });

        const { unmount } = render(<MobilePartIdScreen />);
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.click(submitButton);

        expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
        expect(mockSetDisplayPartIdWarning).not.toHaveBeenCalledWith(true);

        unmount();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle whitespace-only participant ID as valid", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "   ",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    });

    it("should handle very long participant ID", () => {
      const longId = "A".repeat(1000);

      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: longId,
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(mockSetPartId).toHaveBeenCalledWith(longId);
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    });

    it("should handle special characters in participant ID", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "!@#$%^&*()",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);

      expect(mockSetPartId).toHaveBeenCalledWith("!@#$%^&*()");
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    });
  });

  describe("Component Integration", () => {
    it("should pass correct props to LogInSubmitButton", () => {
      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      expect(submitButton).toBeInTheDocument();
      // Button component is mocked, so we verify it renders
    });

    it("should handle rapid Enter key presses", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "RAPID",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);

      fireEvent.keyUp(window, { key: "Enter" });
      fireEvent.keyUp(window, { key: "Enter" });
      fireEvent.keyUp(window, { key: "Enter" });

      // Should be called multiple times
      expect(mockSetIsLoggedIn).toHaveBeenCalledTimes(3);
    });

    it("should handle rapid button clicks", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayPartIdWarning: false,
          userInputPartId: "CLICK",
          setUserInputPartId: mockSetUserInputPartId,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<MobilePartIdScreen />);
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);

      expect(mockSetIsLoggedIn).toHaveBeenCalledTimes(3);
    });
  });
});
