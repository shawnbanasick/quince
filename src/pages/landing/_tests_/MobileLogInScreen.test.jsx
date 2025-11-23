import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogInScreen from "../LogInScreen";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// Mock the child component
vi.mock("./LogInSubmitButton", () => ({
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

vi.mock("../../utilities/decodeHTML", () => ({
  default: (text) => text,
}));

describe("LogInScreen", () => {
  // Mock state values
  const mockSetUserInputPartId = vi.fn();
  const mockSetUserInputAccessCode = vi.fn();
  const mockSetDisplayLandingContent = vi.fn();
  const mockSetPartId = vi.fn();
  const mockSetDisplayNextButton = vi.fn();
  const mockSetIsLoggedIn = vi.fn();
  const mockSetDisplayAccessCodeWarning = vi.fn();
  const mockSetDisplayPartIdWarning = vi.fn();

  const defaultLangObj = {
    loginWelcomeText: "Welcome to the study",
    loginHeaderText: "Please Log In",
    loginPartIdText: "Enter your Participant ID",
    partIdWarning: "Please enter a valid Participant ID",
    accessCodeWarning: "Invalid access code",
    accessInputText: "Enter Access Code",
  };

  const defaultConfigObj = {
    accessCode: "TESTCODE123",
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Setup default mock implementations
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: defaultLangObj,
        configObj: defaultConfigObj,
      };
      return selector(state);
    });

    useStore.mockImplementation((selector) => {
      const state = {
        displayAccessCodeWarning: false,
        displayPartIdWarning: false,
        userInputPartId: "",
        userInputAccessCode: "",
        setUserInputPartId: mockSetUserInputPartId,
        setUserInputAccessCode: mockSetUserInputAccessCode,
        setDisplayLandingContent: mockSetDisplayLandingContent,
        setPartId: mockSetPartId,
        setDisplayNextButton: mockSetDisplayNextButton,
        setIsLoggedIn: mockSetIsLoggedIn,
        setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
      };
      return selector(state);
    });

    // Mock localStorage
    Storage.prototype.setItem = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render welcome text", () => {
      render(<LogInScreen />);
      expect(screen.getByText("Welcome to the study")).toBeInTheDocument();
    });

    it("should render login header text", () => {
      render(<LogInScreen />);
      expect(screen.getByText("Please Log In")).toBeInTheDocument();
    });

    it("should render participant ID label", () => {
      render(<LogInScreen />);
      expect(screen.getByText("Enter your Participant ID")).toBeInTheDocument();
    });

    it("should render access code label", () => {
      render(<LogInScreen />);
      expect(screen.getByText("Enter Access Code")).toBeInTheDocument();
    });

    it("should render two input fields", () => {
      render(<LogInScreen />);
      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(2);
    });
  });

  describe("Warning Display", () => {
    it("should display participant ID warning when flag is true", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: true,
          userInputPartId: "",
          userInputAccessCode: "",
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<LogInScreen />);
      expect(screen.getByText("Please enter a valid Participant ID")).toBeInTheDocument();
    });

    it("should display access code warning when flag is true", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayAccessCodeWarning: true,
          displayPartIdWarning: false,
          userInputPartId: "",
          userInputAccessCode: "",
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<LogInScreen />);
      expect(screen.getByText("Invalid access code")).toBeInTheDocument();
    });
  });

  describe("Enter Key Press - Successful Login", () => {
    it("should successfully log in when Enter key is pressed with valid credentials", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          userInputPartId: "PART123",
          userInputAccessCode: "TESTCODE123",
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayLandingContent).toHaveBeenCalledWith(true);
      expect(mockSetPartId).toHaveBeenCalledWith("PART123");
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      expect(localStorage.setItem).toHaveBeenCalledWith("partId", "PART123");
    });
  });

  describe("Enter Key Press - Invalid Credentials", () => {
    it("should show access code warning when Enter is pressed with invalid access code", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          userInputPartId: "PART123",
          userInputAccessCode: "WRONGCODE",
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(false);
    });

    it("should show participant ID warning when Enter is pressed with short ID", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          userInputPartId: "A",
          userInputAccessCode: "TESTCODE123",
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayPartIdWarning).toHaveBeenCalledWith(true);
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(false);
    });

    it("should not trigger login when non-Enter key is pressed", () => {
      useStore.mockImplementation((selector) => {
        const state = {
          displayAccessCodeWarning: false,
          displayPartIdWarning: false,
          userInputPartId: "PART123",
          userInputAccessCode: "TESTCODE123",
          setUserInputPartId: mockSetUserInputPartId,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setPartId: mockSetPartId,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
          setDisplayPartIdWarning: mockSetDisplayPartIdWarning,
        };
        return selector(state);
      });

      render(<LogInScreen />);

      fireEvent.keyUp(window, { key: "a" });

      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });
  });

  describe("Event Listener Cleanup", () => {
    it("should remove keyup event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = render(<LogInScreen />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("keyup", expect.any(Function));
    });
  });
});
