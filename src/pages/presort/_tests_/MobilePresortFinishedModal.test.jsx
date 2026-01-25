import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PresortFinishedModal from "../MobilePresortFinishedModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// 2. Mock decodeHTML utility
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (val) => val, // Simply return the string as-is for testing
}));

describe("PresortFinishedModal Component", () => {
  const mockSetTriggerModal = vi.fn();

  const mockLangObj = {
    mobilePresortFinishedModalHead: "Success!",
    mobilePresortFinishedModalText: "<p>Your presort is complete.</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default implementation for useSettingsStore (Language)
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));
  });

  it("should not render the modal when triggerModal is false", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobilePresortFinishedModal: false,
        setTriggerMobilePresortFinishedModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<PresortFinishedModal />);

    // react-responsive-modal usually doesn't render content to DOM if closed
    expect(screen.queryByText("Success!")).not.toBeInTheDocument();
  });

  it("should render correct header and content when open", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobilePresortFinishedModal: true,
        setTriggerMobilePresortFinishedModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<PresortFinishedModal />);

    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("Your presort is complete.")).toBeInTheDocument();
  });
});
