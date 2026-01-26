import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CopyToClipboardButton from "../CopyToClipboardButton";
import useSettingsStore from "../../../globalState/useSettingsStore";

// 1. Mock the Global Store
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));
// 2. Mock Clipboard API
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe("CopyToClipboardButton", () => {
  const mockLangObj = {
    copiedText: "Copied!",
    copyTextError: "Failed to copy",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup the mock store implementation
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));
    // Mock timers for the result clearing (3000ms)
    vi.useFakeTimers();
  });

  it("renders the button with provided text", () => {
    render(<CopyToClipboardButton text="Copy Results" content="Test Content" />);
    expect(screen.getByText("Copy Results")).toBeInTheDocument();
  });

  it("formats object content correctly when type is 'results'", async () => {
    const complexContent = { Score: 10, Time: "5ms" };
    render(<CopyToClipboardButton type="results" text="Copy" content={complexContent} />);

    fireEvent.click(screen.getByRole("button"));

    // Check specific formatting logic from the component
    expect(mockWriteText).toHaveBeenCalledWith("Score: 10 * Time: 5ms * ");
  });
});
