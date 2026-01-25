import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LogInScreen from "../PartIdScreen";
import useStore from "../../../globalState/useStore";
import useSettingsStore from "../../../globalState/useSettingsStore";

// 1. Mock the custom hooks/stores
vi.mock("../../../globalState/useStore");
vi.mock("../../../globalState/useSettingsStore");

// 2. Mock external utilities that might interfere with DOM testing
vi.mock("html-react-parser", () => ({
  default: (html) => html,
}));
vi.mock("../../utilities/decodeHTML", () => ({
  default: (text) => text,
}));

describe("LogInScreen Component", () => {
  // Mock store functions
  const setUserInputPartId = vi.fn();
  const setDisplayLandingContent = vi.fn();
  const setPartId = vi.fn();
  const setDisplayNextButton = vi.fn();
  const setIsLoggedIn = vi.fn();
  const setDisplayPartIdWarning = vi.fn();

  const mockLangObj = {
    loginHeaderText: "Welcome",
    loginPartIdText: "Enter ID",
    partIdWarning: "Invalid ID",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Setup store implementation
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));
    useStore.mockImplementation((selector) => {
      const state = {
        displayPartIdWarning: false,
        userInputPartId: "",
        setUserInputPartId,
        setDisplayLandingContent,
        setPartId,
        setDisplayNextButton,
        setIsLoggedIn,
        setDisplayPartIdWarning,
      };
      return selector(state);
    });

    // Clear localStorage
    Storage.prototype.setItem = vi.fn();
  });

  it("renders the correct translated text", () => {
    render(<LogInScreen />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("Enter ID")).toBeInTheDocument();
  });

  it("calls setUserInputPartId when typing in the input", () => {
    render(<LogInScreen />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "12345" } });
    expect(setUserInputPartId).toHaveBeenCalledWith("12345");
  });

  it("successful login: updates state and localStorage when ID is present", () => {
    // Override mock to return a value for userInputPartId
    useStore.mockImplementation((selector) => {
      const state = {
        userInputPartId: "USER_123",
        setUserInputPartId,
        setDisplayLandingContent,
        setPartId,
        setDisplayNextButton,
        setIsLoggedIn,
      };
      return selector(state);
    });

    render(<LogInScreen />);
    const submitBtn = screen.getByRole("button");

    fireEvent.click(submitBtn);

    expect(setPartId).toHaveBeenCalledWith("USER_123");
    expect(setIsLoggedIn).toHaveBeenCalledWith(true);
    expect(localStorage.setItem).toHaveBeenCalledWith("partId", "USER_123");
  });

  it("failed login: shows warning and hides it after 5 seconds", () => {
    render(<LogInScreen />);
    const submitBtn = screen.getByRole("button");

    fireEvent.click(submitBtn);

    expect(setDisplayPartIdWarning).toHaveBeenCalledWith(true);

    // Fast-forward time to test the setTimeout
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(setDisplayPartIdWarning).toHaveBeenCalledWith(false);
  });

  it("triggers login when 'Enter' key is pressed", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        userInputPartId: "ENTER_KEY_TEST",
        setUserInputPartId,
        setDisplayLandingContent,
        setPartId,
        setDisplayNextButton,
        setIsLoggedIn,
      };
      return selector(state);
    });

    render(<LogInScreen />);

    fireEvent.keyUp(window, { key: "Enter", code: "Enter" });

    expect(setIsLoggedIn).toHaveBeenCalledWith(true);
    expect(setPartId).toHaveBeenCalledWith("ENTER_KEY_TEST");
  });
});
