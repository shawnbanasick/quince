import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import LogInScreen from "../AccessCodeScreen";
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

describe("AccessCodeScreen", () => {
  let mockSetDisplayLandingContent;
  let mockSetDisplayNextButton;
  let mockSetIsLoggedIn;
  let mockSetUserInputAccessCode;
  let mockSetDisplayAccessCodeWarning;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Setup mock functions
    mockSetDisplayLandingContent = vi.fn();
    mockSetDisplayNextButton = vi.fn();
    mockSetIsLoggedIn = vi.fn();
    mockSetUserInputAccessCode = vi.fn();
    mockSetDisplayAccessCodeWarning = vi.fn();

    // Mock useSettingsStore
    // useSettingsStore.mockReturnValue({
    //   langObj: {
    //     loginHeaderText: "Welcome",
    //     accessInputText: "Enter Access Code",
    //     accessCodeWarning: "Invalid access code",
    //   },
    //   configObj: {
    //     accessCode: "SECRET123",
    //   },
    // });

    // Mock useStore
    useStore.mockImplementation((selector) => {
      const mockState = {
        displayAccessCodeWarning: false,
        userInputAccessCode: "",
        setDisplayLandingContent: mockSetDisplayLandingContent,
        setDisplayNextButton: mockSetDisplayNextButton,
        setIsLoggedIn: mockSetIsLoggedIn,
        setUserInputAccessCode: mockSetUserInputAccessCode,
        setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
      };
      return selector(mockState);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render the login screen", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            loginHeaderText: "Welcome",
            accessInputText: "Enter Access Code",
            accessCodeWarning: "Invalid access code",
          },
          configObj: {
            accessCode: "SECRET123",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      expect(screen.getByText("Welcome")).toBeInTheDocument();
      expect(screen.getByText("Enter Access Code")).toBeInTheDocument();
    });

    it("should render the access code input field", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            loginHeaderText: "Welcome",
            accessInputText: "Enter Access Code",
            accessCodeWarning: "Invalid access code",
          },
          configObj: {
            accessCode: "SECRET123",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const input = screen.getByTestId("accessCodeInputDiv");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
    });

    it("should render the submit button", () => {
      renderWithTheme(<LogInScreen />);

      expect(screen.getByTestId("submitButtonAccess")).toBeInTheDocument();
    });

    it("should not display warning initially", () => {
      renderWithTheme(<LogInScreen />);

      expect(screen.queryByText("Invalid access code")).not.toBeInTheDocument();
    });
  });

  describe("Input Handling", () => {
    it("should call setUserInputAccessCode when input changes", () => {
      renderWithTheme(<LogInScreen />);

      const input = screen.getByTestId("accessCodeInputDiv");
      fireEvent.change(input, { target: { value: "TEST123" } });

      expect(mockSetUserInputAccessCode).toHaveBeenCalledWith("TEST123");
    });

    it("should handle multiple input changes", () => {
      renderWithTheme(<LogInScreen />);

      const input = screen.getByTestId("accessCodeInputDiv");
      fireEvent.change(input, { target: { value: "T" } });
      fireEvent.change(input, { target: { value: "TE" } });
      fireEvent.change(input, { target: { value: "TES" } });

      expect(mockSetUserInputAccessCode).toHaveBeenCalledTimes(3);
      expect(mockSetUserInputAccessCode).toHaveBeenLastCalledWith("TES");
    });

    // it("should handle empty input", () => {
    //   renderWithTheme(<LogInScreen />);

    //   const input = screen.getByTestId("accessCodeInputDiv");
    //   fireEvent.change(input, { target: { value: "" } });

    //   expect(mockSetUserInputAccessCode).toHaveBeenCalledWith("");
    // });
  });

  describe("Submit Button Click - Valid Access Code", () => {
    it("should grant access with correct access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "SECRET123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });
      renderWithTheme(<LogInScreen />);
      const submitButton = screen.getByTestId("submitButtonAccess");
      fireEvent.click(submitButton);
      expect(mockSetDisplayLandingContent).toHaveBeenCalledWith(true);
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    });
    it("should not display warning with correct access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "SECRET123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });
      renderWithTheme(<LogInScreen />);
      const submitButton = screen.getByTestId("submitButtonAccess");
      fireEvent.click(submitButton);
      expect(mockSetDisplayAccessCodeWarning).not.toHaveBeenCalledWith(true);
    });
  });

  describe("Submit Button Click - Invalid Access Code", () => {
    it("should deny access with incorrect access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByTestId("submitButtonAccess");
      fireEvent.click(submitButton);

      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
      // expect(mockSetDisplayNextButton).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    it("should display warning with incorrect access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByTestId("submitButtonAccess");
      fireEvent.click(submitButton);

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
    });

    it("should hide warning after 5 seconds on button click", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByTestId("submitButtonAccess");
      fireEvent.click(submitButton);

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);

      vi.advanceTimersByTime(5000);

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(false);
    });

    it("should deny access with empty access code", () => {
      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByTestId("submitButtonAccess");
      fireEvent.click(submitButton);

      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
    });
  });

  describe("Enter Key Press - Valid Access Code", () => {
    it("should grant access when Enter is pressed with correct code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "SECRET123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });
      renderWithTheme(<LogInScreen />);
      fireEvent.keyUp(window, { key: "Enter" });
      expect(mockSetDisplayLandingContent).toHaveBeenCalledWith(true);
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    });
    it("should not display warning when Enter pressed with correct code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "SECRET123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });
      renderWithTheme(<LogInScreen />);
      fireEvent.keyUp(window, { key: "Enter" });
      expect(mockSetDisplayAccessCodeWarning).not.toHaveBeenCalledWith(true);
    });
  });

  describe("Enter Key Press - Invalid Access Code", () => {
    it("should deny access when Enter pressed with incorrect code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayLandingContent).not.toHaveBeenCalled();
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    it("should display warning when Enter pressed with incorrect code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
    });

    it("should hide warning after 3 seconds on Enter key", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "WRONG123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);

      vi.advanceTimersByTime(3000);

      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(false);
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

    it("should only respond to Enter key", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "SECRET123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Escape" });
      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();

      fireEvent.keyUp(window, { key: "Enter" });
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
    });
  });

  describe("Warning Display", () => {
    it("should display warning text when displayAccessCodeWarning is true", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: true,
          userInputAccessCode: "",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      expect(screen.getByText("Invalid access code")).toBeInTheDocument();
    });

    it("should not display warning text when displayAccessCodeWarning is false", () => {
      renderWithTheme(<LogInScreen />);

      expect(screen.queryByText("Invalid access code")).not.toBeInTheDocument();
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

  describe("Case Sensitivity", () => {
    it("should be case-sensitive for access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "secret123",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByTestId("submitButtonAccess");
      fireEvent.click(submitButton);

      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
      expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledWith(true);
    });

    it("should require exact match for access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: "SECRET12",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      fireEvent.keyUp(window, { key: "Enter" });

      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });
  });

  describe("Localization", () => {
    // it("should display localized text from langObj", () => {
    //   useSettingsStore.mockImplementation((selector) => {
    //     const mockState = {
    //       langObj: {
    //         loginHeaderText: "Bienvenido",
    //         accessInputText: "Ingrese el código de acceso",
    //         accessCodeWarning: "Código de acceso inválido",
    //       },
    //       configObj: {
    //         accessCode: "SECRET123",
    //       },
    //     };
    //     return selector(mockState);
    //   });

    //   renderWithTheme(<LogInScreen />);

    //   expect(screen.findByText("Bienvenido")).toBeInTheDocument();
    //   expect(screen.findByText("Ingrese el código de acceso")).toBeInTheDocument();
    // });

    it("should handle empty langObj values gracefully", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            loginHeaderText: null,
            accessInputText: null,
            accessCodeWarning: null,
          },
          configObj: {
            accessCode: "SECRET123",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const input = screen.getByTestId("accessCodeInputDiv");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle whitespace in access code", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          displayAccessCodeWarning: false,
          userInputAccessCode: " SECRET123 ",
          setDisplayLandingContent: mockSetDisplayLandingContent,
          setDisplayNextButton: mockSetDisplayNextButton,
          setIsLoggedIn: mockSetIsLoggedIn,
          setUserInputAccessCode: mockSetUserInputAccessCode,
          setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
        };
        return selector(mockState);
      });

      renderWithTheme(<LogInScreen />);

      const submitButton = screen.getByTestId("submitButtonAccess");
      fireEvent.click(submitButton);

      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    // it("should handle multiple submit attempts", () => {
    //   useStore.mockImplementation((selector) => {
    //     const mockState = {
    //       displayAccessCodeWarning: false,
    //       userInputAccessCode: "WRONG",
    //       setDisplayLandingContent: mockSetDisplayLandingContent,
    //       setDisplayNextButton: mockSetDisplayNextButton,
    //       setIsLoggedIn: mockSetIsLoggedIn,
    //       setUserInputAccessCode: mockSetUserInputAccessCode,
    //       setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
    //     };
    //     return selector(mockState);
    //   });

    //   renderWithTheme(<LogInScreen />);

    //   const submitButton = screen.getByTestId("submitButtonAccess");
    //   fireEvent.click(submitButton);
    //   fireEvent.click(submitButton);
    //   fireEvent.click(submitButton);

    //   expect(mockSetDisplayAccessCodeWarning).toHaveBeenCalledTimes(3);
    // });

    // it("should handle rapid Enter key presses", () => {
    //   useStore.mockImplementation((selector) => {
    //     const mockState = {
    //       displayAccessCodeWarning: false,
    //       userInputAccessCode: "SECRET123",
    //       setDisplayLandingContent: mockSetDisplayLandingContent,
    //       setDisplayNextButton: mockSetDisplayNextButton,
    //       setIsLoggedIn: mockSetIsLoggedIn,
    //       setUserInputAccessCode: mockSetUserInputAccessCode,
    //       setDisplayAccessCodeWarning: mockSetDisplayAccessCodeWarning,
    //     };
    //     return selector(mockState);
    //   });

    //   renderWithTheme(<LogInScreen />);

    //   fireEvent.keyUp(window, { key: "Enter" });
    //   fireEvent.keyUp(window, { key: "Enter" });

    //   expect(mockSetIsLoggedIn).toHaveBeenCalledTimes(2);
    // });
  });

  //   describe("Submit Button Props", () => {
  //     it("should pass correct props to LogInSubmitButton", async () => {
  //       const LogInSubmitButton = await import("../LogInSubmitButton").default;

  //       renderWithTheme(<LogInScreen />);

  //       expect(LogInSubmitButton).toHaveBeenCalledWith(
  //         expect.objectContaining({
  //           "data-testid": "submitButtonAccess",
  //           size: "1.5em",
  //           width: "200px",
  //           height: "50px",
  //           onClick: expect.any(Function),
  //         }),
  //         expect.anything()
  //       );
  //     });
  //   });
});
