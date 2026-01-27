import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobileModal from "../MobileModal";

// 1. Static Mock of the store
vi.mock("../../globalState/useStore", () => ({
  default: vi.fn((selector) => {
    // We return a default fallback so the component doesn't crash on render
    if (selector.name === "getSetHasScrolledToBottom") return vi.fn();
    return false;
  }),
}));

describe("MobileModal Component", () => {
  const setTriggerMock = vi.fn();

  const defaultProps = {
    trigger: true,
    setTrigger: setTriggerMock,
    head: "Test Header",
    text: "Test content that is quite long...",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("renders the modal correctly", () => {
    render(<MobileModal {...defaultProps} />);
    expect(screen.getByText("Test Header")).toBeInTheDocument();
  });

  it("calls setTrigger(false) when close button is clicked", () => {
    render(<MobileModal {...defaultProps} />);

    fireEvent.click(screen.getByText("X"));
    expect(setTriggerMock).toHaveBeenCalledWith(false);
  });
});
