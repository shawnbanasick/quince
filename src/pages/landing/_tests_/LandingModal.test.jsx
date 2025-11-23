import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import LandingModal from "../LandingModal";
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

// Mock react-responsive-modal
vi.mock("react-responsive-modal", () => ({
  Modal: ({ open, onClose, children, center, className }) => {
    if (!open) return null;
    return (
      <div data-testid="modal" className={className} data-center={center}>
        <button data-testid="close-button" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    );
  },
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

describe("LandingModal", () => {
  let mockSetTriggerLandingModal;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock function
    mockSetTriggerLandingModal = vi.fn();

    // Mock useSettingsStore
    useSettingsStore.mockImplementation((selector) => {
      const mockState = {
        langObj: {
          landingHelpModalHead: "Help - Landing Page",
          landingHelpModalText: "This is helpful information about the landing page.",
        },
      };
      return selector(mockState);
    });

    // Mock useStore
    useStore.mockImplementation((selector) => {
      const mockState = {
        triggerLandingModal: false,
        setTriggerLandingModal: mockSetTriggerLandingModal,
      };
      return selector(mockState);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Modal Closed State", () => {
    it("should not render modal when triggerLandingModal is false", () => {
      renderWithTheme(<LandingModal />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should not display modal content when closed", () => {
      renderWithTheme(<LandingModal />);

      expect(screen.queryByText("Help - Landing Page")).not.toBeInTheDocument();
      expect(
        screen.queryByText("This is helpful information about the landing page.")
      ).not.toBeInTheDocument();
    });
  });

  describe("Modal Open State", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });
    });

    it("should render modal when triggerLandingModal is true", () => {
      renderWithTheme(<LandingModal />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should display modal header text", () => {
      renderWithTheme(<LandingModal />);

      expect(screen.getByText("Help - Landing Page")).toBeInTheDocument();
    });

    it("should display modal content text", () => {
      renderWithTheme(<LandingModal />);

      expect(
        screen.getByText("This is helpful information about the landing page.")
      ).toBeInTheDocument();
    });

    it("should render horizontal rule separator", () => {
      const { container } = renderWithTheme(<LandingModal />);

      const hr = container.querySelector("hr");
      expect(hr).toBeInTheDocument();
    });

    it("should have customModal className", () => {
      renderWithTheme(<LandingModal />);

      const modal = screen.getByTestId("modal");
      expect(modal).toHaveClass("customModal");
    });

    it("should be centered", () => {
      renderWithTheme(<LandingModal />);

      const modal = screen.getByTestId("modal");
      expect(modal).toHaveAttribute("data-center", "true");
    });
  });

  describe("Modal Close Functionality", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });
    });

    it("should call setTriggerLandingModal with false when close button clicked", () => {
      renderWithTheme(<LandingModal />);

      const closeButton = screen.getByTestId("close-button");
      fireEvent.click(closeButton);

      expect(mockSetTriggerLandingModal).toHaveBeenCalledWith(false);
      expect(mockSetTriggerLandingModal).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple close button clicks", () => {
      renderWithTheme(<LandingModal />);

      const closeButton = screen.getByTestId("close-button");
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      expect(mockSetTriggerLandingModal).toHaveBeenCalledTimes(3);
      expect(mockSetTriggerLandingModal).toHaveBeenCalledWith(false);
    });
  });

  describe("Text Content Variations", () => {
    it("should display custom header text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "Custom Header",
            landingHelpModalText: "Custom content",
          },
        };
        return selector(mockState);
      });

      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("Custom Header")).toBeInTheDocument();
      expect(screen.getByText("Custom content")).toBeInTheDocument();
    });

    it("should display very long content", () => {
      const longText =
        "This is a very long help text that explains in great detail how to use the landing page. It goes on for quite a while to test how the modal handles lengthy content and whether it displays properly with all the text visible.";
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "Help",
            landingHelpModalText: longText,
          },
        };
        return selector(mockState);
      });

      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle HTML content in header", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "<strong>Bold Header</strong>",
            landingHelpModalText: "Content",
          },
        };
        return selector(mockState);
      });

      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("<strong>Bold Header</strong>")).toBeInTheDocument();
    });

    it("should handle HTML content in modal text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "Help",
            landingHelpModalText: "<p>Paragraph content</p>",
          },
        };
        return selector(mockState);
      });

      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("<p>Paragraph content</p>")).toBeInTheDocument();
    });
  });

  describe("Empty or Null Values", () => {
    it("should handle empty string values", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          landingHelpModalHead: "",
          landingHelpModalText: "",
        },
      });

      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should handle both null values", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: null,
            landingHelpModalText: null,
          },
        };
        return selector(mockState);
      });

      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
  });

  describe("Localization", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });
    });

    it("should display Spanish text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "Ayuda - Página de Inicio",
            landingHelpModalText: "Esta es información útil sobre la página de inicio.",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("Ayuda - Página de Inicio")).toBeInTheDocument();
      expect(
        screen.getByText("Esta es información útil sobre la página de inicio.")
      ).toBeInTheDocument();
    });

    it("should display French text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "Aide - Page d'accueil",
            landingHelpModalText: "Ceci est une information utile sur la page d'accueil.",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("Aide - Page d'accueil")).toBeInTheDocument();
      expect(
        screen.getByText("Ceci est une information utile sur la page d'accueil.")
      ).toBeInTheDocument();
    });

    it("should display German text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "Hilfe - Startseite",
            landingHelpModalText: "Dies sind hilfreiche Informationen zur Startseite.",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("Hilfe - Startseite")).toBeInTheDocument();
      expect(
        screen.getByText("Dies sind hilfreiche Informationen zur Startseite.")
      ).toBeInTheDocument();
    });

    it("should display Chinese text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "帮助 - 登陆页面",
            landingHelpModalText: "这是关于登陆页面的有用信息。",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("帮助 - 登陆页面")).toBeInTheDocument();
      expect(screen.getByText("这是关于登陆页面的有用信息。")).toBeInTheDocument();
    });
  });

  describe("Special Characters", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });
    });

    it("should handle special characters in header", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "⚠️ Important Help ⚠️",
            landingHelpModalText: "Content",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("⚠️ Important Help ⚠️")).toBeInTheDocument();
    });

    it("should handle special characters in content", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "Help",
            landingHelpModalText: "Steps: 1️⃣ 2️⃣ 3️⃣",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("Steps: 1️⃣ 2️⃣ 3️⃣")).toBeInTheDocument();
    });

    it("should handle quotes in text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: '"Important" Information',
            landingHelpModalText: 'Use "quotes" when needed',
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText('"Important" Information')).toBeInTheDocument();
      expect(screen.getByText('Use "quotes" when needed')).toBeInTheDocument();
    });

    it("should handle apostrophes in text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "User's Guide",
            landingHelpModalText: "It's helpful",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("User's Guide")).toBeInTheDocument();
      expect(screen.getByText("It's helpful")).toBeInTheDocument();
    });
  });

  describe("Modal State Transitions", () => {
    it("should transition from closed to open", () => {
      const { rerender } = renderWithTheme(<LandingModal />);

      // Initially closed
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();

      // Update to open
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      rerender(
        <ThemeProvider theme={mockTheme}>
          <LandingModal />
        </ThemeProvider>
      );

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should transition from open to closed", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      const { rerender } = renderWithTheme(<LandingModal />);

      // Initially open
      expect(screen.getByTestId("modal")).toBeInTheDocument();

      // Update to closed
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: false,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      rerender(
        <ThemeProvider theme={mockTheme}>
          <LandingModal />
        </ThemeProvider>
      );

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });
    });

    it("should have hr element between header and content", () => {
      const { container } = renderWithTheme(<LandingModal />);

      const hr = container.querySelector("hr");
      expect(hr).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });
    });

    it("should be closeable", () => {
      renderWithTheme(<LandingModal />);

      const closeButton = screen.getByTestId("close-button");
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid open/close cycles", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      const closeButton = screen.getByTestId("close-button");

      // Rapid clicks
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      expect(mockSetTriggerLandingModal).toHaveBeenCalledTimes(3);
    });

    it("should handle whitespace-only text", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          landingHelpModalHead: "   ",
          landingHelpModalText: "   ",
        },
      });

      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should handle very short text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHelpModalHead: "H",
            landingHelpModalText: "T",
          },
        };
        return selector(mockState);
      });

      useStore.mockImplementation((selector) => {
        const mockState = {
          triggerLandingModal: true,
          setTriggerLandingModal: mockSetTriggerLandingModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingModal />);

      expect(screen.getByText("H")).toBeInTheDocument();
      expect(screen.getByText("T")).toBeInTheDocument();
    });
  });
});
