import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import MobileThinGuidanceModal from "../MobileThinGuidanceModal";

// Mock the stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// Mock react-responsive-modal
vi.mock("react-responsive-modal", () => ({
  Modal: ({ children, open, onClose, id, className }) => {
    if (!open) return null;
    return (
      <div data-testid="modal" id={id} className={className}>
        <button onClick={onClose} data-testid="close-button">
          Close
        </button>
        {children}
      </div>
    );
  },
}));

import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

const mockTheme = {
  mobileText: "#333333",
};

describe("MobileThinGuidanceModal", () => {
  const mockSetTriggerModal = vi.fn();
  const mockLangObj = { test: "language object" };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    useSettingsStore.mockImplementation((selector) => {
      const state = { langObj: mockLangObj };
      return selector(state);
    });

    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinGuidanceModal: false,
        setTriggerMobileThinGuidanceModal: mockSetTriggerModal,
      };
      return selector(state);
    });
  });

  const renderWithTheme = (component) => {
    return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
  };

  it("should not render modal when triggerModal is false", () => {
    renderWithTheme(<MobileThinGuidanceModal />);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should render modal when triggerModal is true", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinGuidanceModal: true,
        setTriggerMobileThinGuidanceModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    renderWithTheme(<MobileThinGuidanceModal />);
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should render with custom modalHead prop", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinGuidanceModal: true,
        setTriggerMobileThinGuidanceModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    const testHead = "Test Modal Header";
    renderWithTheme(<MobileThinGuidanceModal modalHead={testHead} />);

    expect(screen.getByText(testHead)).toBeInTheDocument();
  });

  it("should render with custom modalText prop", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinGuidanceModal: true,
        setTriggerMobileThinGuidanceModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    const testText = "Test modal content text";
    renderWithTheme(<MobileThinGuidanceModal modalText={testText} />);

    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it("should render with both modalHead and modalText props", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinGuidanceModal: true,
        setTriggerMobileThinGuidanceModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    const testHead = "Test Header";
    const testText = "Test Content";
    renderWithTheme(<MobileThinGuidanceModal modalHead={testHead} modalText={testText} />);

    expect(screen.getByText(testHead)).toBeInTheDocument();
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it("should use empty strings as defaults when props are not provided", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinGuidanceModal: true,
        setTriggerMobileThinGuidanceModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    const { container } = renderWithTheme(<MobileThinGuidanceModal />);
    expect(container).toBeInTheDocument();
  });

  it("should call setTriggerModal with false when modal is closed", async () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinGuidanceModal: true,
        setTriggerMobileThinGuidanceModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    const user = userEvent.setup();
    renderWithTheme(<MobileThinGuidanceModal />);

    const closeButton = screen.getByTestId("close-button");
    await user.click(closeButton);

    expect(mockSetTriggerModal).toHaveBeenCalledWith(false);
    expect(mockSetTriggerModal).toHaveBeenCalledTimes(1);
  });

  it("should have correct modal id and className", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinGuidanceModal: true,
        setTriggerMobileThinGuidanceModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    renderWithTheme(<MobileThinGuidanceModal />);

    const modal = screen.getByTestId("modal");
    expect(modal).toHaveAttribute("id", "thinHelpModal");
    expect(modal).toHaveClass("thinCustomModal");
  });

  it("should render hr separator", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinGuidanceModal: true,
        setTriggerMobileThinGuidanceModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    const { container } = renderWithTheme(<MobileThinGuidanceModal modalHead="Test" />);

    const hr = container.querySelector("hr");
    expect(hr).toBeInTheDocument();
  });
});
