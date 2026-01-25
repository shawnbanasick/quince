import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ImageDisplayModal from "../ImageDisplayModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the utilities (optional, but ensures clean output)
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("ImageDisplayModal Component", () => {
  const mockSetTriggerSurveyModal = vi.fn();

  const mockLangObj = {
    surveyModalHead: "Test Header Content",
    surveyModalText: "<p>Test Body Content</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock implementation for useSettingsStore (Language)
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));

    // Mock implementation for useStore (Modal Visibility)
    useStore.mockImplementation((selector) => {
      const state = {
        triggerSurveyModal: true,
        setTriggerSurveyModal: mockSetTriggerSurveyModal,
      };
      return selector(state);
    });
  });

  it("renders the modal when triggerSurveyModal is true", () => {
    render(<ImageDisplayModal />);

    expect(screen.getByText("Test Header Content")).toBeInTheDocument();
    expect(screen.getByText("Test Body Content")).toBeInTheDocument();
  });

  it("does not render content when triggerSurveyModal is false", () => {
    // Override the mock for this specific test
    useStore.mockImplementation((selector) => {
      const state = {
        triggerSurveyModal: false,
        setTriggerSurveyModal: mockSetTriggerSurveyModal,
      };
      return selector(state);
    });

    render(<ImageDisplayModal />);

    expect(screen.queryByText("Test Header Content")).not.toBeInTheDocument();
  });
});
