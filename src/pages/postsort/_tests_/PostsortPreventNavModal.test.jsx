import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PostsortPreventNavModal from "../PostsortPreventNavModal"; // Adjust path
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom hooks/stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the HTML parser/decoder to keep tests simple
vi.mock("html-react-parser", () => ({
  default: (html) => html,
}));

vi.mock("../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));

describe("PostsortPreventNavModal", () => {
  const mockSetTrigger = vi.fn();

  const mockLangObj = {
    postsortPreventNavModalHead: "Warning Head",
    postsortPreventNavModalText: "Are you sure you want to leave?",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render anything when triggerModalOpen is false", () => {
    // Setup store mocks for 'closed' state
    useSettingsStore.mockReturnValue(mockLangObj);
    useStore.mockImplementation((selector) => {
      if (selector.name === "getTriggerModalOpen") return false;
      if (selector.name === "getSetTrigPostPrevNavModal") return mockSetTrigger;
    });

    const { queryByText } = render(<PostsortPreventNavModal />);
    expect(queryByText("Warning Head")).not.toBeInTheDocument();
  });

  it("should render correctly when triggerModalOpen is true", () => {
    // Setup store mocks for 'open' state
    useSettingsStore.mockReturnValue(mockLangObj);
    useStore.mockImplementation((selector) => {
      // Logic to return different values based on which selector is called
      if (selector.name === "getTriggerModalOpen") return true;
      return mockSetTrigger;
    });

    render(<PostsortPreventNavModal />);

    expect(screen.getByText("Warning Head")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to leave?")).toBeInTheDocument();
  });
});
