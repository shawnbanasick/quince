import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import LogInScreen from "../LogInScreen";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((text) => text),
}));
vi.mock("html-react-parser", () => ({
  default: vi.fn((text) => text),
}));

// Mock LogInSubmitButton
vi.mock("../LogInSubmitButton", () => ({
  default: vi.fn(({ onClick, children, ...props }) => (
    <button onClick={onClick} {...props}>
      {children || "Submit"}
    </button>
  )),
}));

// Mock theme
const mockTheme = {
  primary: "#337ab7",
  secondary: "#286090",
  focus: "#204d74",
};

// Helper to render with theme
const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

window.localStorage = localStorageMock;

describe("LogInScreen (PartId + Access Code)", () => {
  let mockSetUserInputPartId;
  let mockSetUserInputAccessCode;
  let mockSetDisplayLandingContent;
  let mockSetPartId;
  let mockSetDisplayNextButton;
  let mockSetIsLoggedIn;
  let mockSetDisplayAccessCodeWarning;
  let mockSetDisplayPartIdWarning;
  let consoleLogSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    localStorageMock.clear();

    // Spy on console.log
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Setup mock functions
    mockSetUserInputPartId = vi.fn();
    mockSetUserInputAccessCode = vi.fn();
    mockSetDisplayLandingContent = vi.fn();
    mockSetPartId = vi.fn();
    mockSetDisplayNextButton = vi.fn();
    mockSetIsLoggedIn = vi.fn();
    mockSetDisplayAccessCodeWarning = vi.fn();
    mockSetDisplayPartIdWarning = vi.fn();

    // Mock useSettingsStore
    useSettingsStore.mockReturnValue({
      langObj: {
        loginWelcomeText: "Welcome to the study",
        loginHeaderText: "Please Log In",
        loginPartIdText: "Enter Participant ID",
        partIdWarning: "Invalid Participant ID",
        accessCodeWarning: "Invalid Access Code",
        accessInputText: "Enter Access Code",
      },
      configObj: {
        accessCode: "SECRET123",
      },
    });

    // Mock useStore
    useStore.mockImplementation((selector) => {
      const mockState = {
        displayAccessCodeWarning: false,
        displayPartIdWarning: false,
        setUserInputPartId: mockSetUserInputPartId,
        setUserInputAccessCode: mockSetUserInputAccessCode,
        userInputPartId: "",
        userInputAccessCode: "",
        setDisplayLandingContent: mockSetDisplayLandingContent,
        setPartId: mockSetPartId,
        setDisplayNextButton: mockSetDisplayNextButton,
        setIsLoggedIn: mockSetIsLoggedIn,
        setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
      };
      return selector(mockState);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    consoleLogSpy.mockRestore();
  });

  describe("Rendering", () => {
    it("should render participant ID input field", () => {
      renderWithTheme(<LogInScreen />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(2);
    });

    it("should render submit button", () => {
      renderWithTheme(<LogInScreen />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should not display warnings initially", () => {
      renderWithTheme(<LogInScreen />);

      expect(screen.queryByText("Invalid Participant ID")).not.toBeInTheDocument();
      expect(screen.queryByText("Invalid Access Code")).not.toBeInTheDocument();
    });
  });

  describe("Input Handling", () => {
    it("should call setUserInputPartId when participant ID changes", () => {
      renderWithTheme(<LogInScreen />);

      const inputs = screen.getAllByRole("textbox");
      fireEvent.change(inputs[0], { target: { value: "PART001" } });

      expect(mockSetUserInputPartId).toHaveBeenCalledWith("PART001");
    });

    it("should call setUserInputAccessCode when access code changes", () => {
      renderWithTheme(<LogInScreen />);

      const inputs = screen.getAllByRole("textbox");
      fireEvent.change(inputs[1], { target: { value: "SECRET123" } });

      expect(mockSetUserInputAccessCode).toHaveBeenCalledWith("SECRET123");
    });

    it("should handle multiple input changes for participant ID", () => {
      renderWithTheme(<LogInScreen />);

      const inputs = screen.getAllByRole("textbox");
      fireEvent.change(inputs[0], { target: { value: "P" } });
      fireEvent.change(inputs[0], { target: { value: "PA" } });
      fireEvent.change(inputs[0], { target: { value: "PART" } });

      expect(mockSetUserInputPartId).toHaveBeenCalledTimes(3);
      expect(mockSetUserInputPartId).toHaveBeenLastCalledWith("PART");
    });
  });

  describe("Submit Button - Valid Credentials", () => {
    it("should grant access with valid participant ID and access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "PART001",
          userInputAccessCode: "SECRET123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledTimes(3);
    });

    it("should be case-sensitive for access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "PART001",
          userInputAccessCode: "secret123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
    });
  });

  describe("Input Attributes", () => {
    it("should have autoCapitalize none on both inputs", () => {
      renderWithTheme(<LogInScreen />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveAttribute("autoCapitalize", "none");
      expect(inputs[1]).toHaveAttribute("autoCapitalize", "none");
    });

    it("should have text type on both inputs", () => {
      renderWithTheme(<LogInScreen />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveAttribute("type", "text");
      expect(inputs[1]).toHaveAttribute("type", "text");
    });
  });

  describe("Priority of Warnings", () => {
    it("should show access code warning before participant ID warning", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "",
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      // Access code is checked first in the if-else chain
      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
      expect(mockSetDisplayPartIdWarning).not.toHaveBeenCalledWith(true);
    });
  });

  describe("LocalStorage Integration", () => {
    it("should not store participant ID on failed login", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "USER12345",
          userInputAccessCode: "WRONG",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      expect(localStorage.setItem).not.toHaveBeenCalledWith("partId", expect.anything());
    });
  });

  describe("Submit Button - Invalid Access Code", () => {
    it("should deny access with wrong access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "PART001",
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    it("should display access code warning with wrong code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "PART001",
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(false);
      expect(consoleLogSpy).toHaveBeenCalledWith("no access code");
    });

    it("should hide access code warning after 5 seconds", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "PART001",
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);

      vi.advanceTimersByTime(5000);

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(false);
    });
  });

  describe("Enter Key Press - Invalid Credentials", () => {
    it("should display warning when Enter pressed with invalid access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "PART001",
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
    });
  });

  describe("Keyboard Event Handling", () => {
    it("should not trigger on other key presses", () => {
      renderWithTheme(<LogInScreen />);

      fireEvent.keyUp(window, { key: "a" });
      fireEvent.keyUp(window, { key: "Space" });
      fireEvent.keyUp(window, { key: "Tab" });

      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });
  });

  describe("UseEffect Initialization", () => {
    it("should call setDisplayNextButton(false) on mount", () => {
      renderWithTheme(<LogInScreen />);

      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(false);
    });

    it("should add keyup event listener on mount", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      renderWithTheme(<LogInScreen />);

      expect(addEventListenerSpy).toHaveBeenCalledWith("keyup", expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it("should remove keyup event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderWithTheme(<LogInScreen />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("keyup", expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Validation Rules", () => {
    it("should require exact match for access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "PART001",
          userInputAccessCode: "SECRET12",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle errors in submit gracefully", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          userInputPartId: "PART001",
          userInputAccessCode: "SECRET123",
          setDisplayLandingContent: vi.fn(() => {
            throw new Error("Test error");
          }),
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByRole("button");

      expect(() => fireEvent.click(submitButton)).not.toThrow();
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });
});
