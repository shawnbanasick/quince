import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SortingFinishedModal from "../SortingFinishedModal";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

// 1. Mock the custom hooks/stores
vi.mock("../../globalState/useSettingsStore");
vi.mock("../../globalState/useStore");

// 2. Mock the decodeHTML utility
vi.mock("../../decodeHTML", () => ({
  default: (val) => val,
}));

describe("SortingFinishedModal Component", () => {
  const mockSetTrigger = vi.fn();

  const mockLangObj = {
    sortingCompleteModalHead: "Task Finished!",
    sortingCompleteModalText: "<p>You have successfully sorted the items.</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default store implementations
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));

    // Handle the two different selectors used from useStore
    useStore.mockImplementation((selector) => {
      const state = {
        triggerSortingFinishedModal: true,
        setTriggerSortingFinishedModal: mockSetTrigger,
      };
      return selector(state);
    });
  });

  it("renders the modal with correct content when trigger is true", () => {
    render(<SortingFinishedModal />);

    expect(screen.getByText("Task Finished!")).toBeDefined();
    expect(screen.getByText("You have successfully sorted the items.")).toBeDefined();
  });

  it("does not show content if triggerSortingFinishedModal is false", () => {
    // Override the store mock for this specific test
    useStore.mockImplementation((selector) => {
      const state = {
        triggerSortingFinishedModal: false,
        setTriggerSortingFinishedModal: mockSetTrigger,
      };
      return selector(state);
    });

    render(<SortingFinishedModal />);

    // React-responsive-modal usually removes content from DOM when closed
    expect(screen.queryByText("Task Finished!")).toBeNull();
  });
});
