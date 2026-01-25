import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import DebouncedTextArea from "../DebouncedTextArea";
import useLocalStorage from "../../../utilities/useLocalStorage";

// 1. Mock the custom hook
vi.mock("../../../utilities/useLocalStorage", () => ({
  default: vi.fn(),
}));

describe("DebouncedTextArea", () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    id: "test-id",
    statementId: "s1",
    placeholder: "Type here...",
    highlightObject: {},
    onChange: mockOnChange,
    delay: 100,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    // Default mock implementation: returns [value, setValue]
    useLocalStorage.mockReturnValue(["", vi.fn()]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("renders correctly with initial value from local storage", () => {
    useLocalStorage.mockReturnValue(["stored text", vi.fn()]);

    render(<DebouncedTextArea {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Type here...");
    expect(textarea.value).toBe("stored text");
  });

  it("updates local storage value immediately on change", () => {
    const setStorageValue = vi.fn();
    useLocalStorage.mockReturnValue(["", setStorageValue]);

    render(<DebouncedTextArea {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Type here...");

    fireEvent.change(textarea, { target: { value: "new input" } });

    // setValue (from useLocalStorage) should be called immediately
    expect(setStorageValue).toHaveBeenCalledWith("new input");
  });

  it("calls onChange only after the specified debounce delay", () => {
    render(<DebouncedTextArea {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Type here...");

    // Simulate typing
    fireEvent.change(textarea, { target: { value: "Hello" } });

    // Should not have been called yet due to debounce
    expect(mockOnChange).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "" }), // Based on the useEffect initial run logic
      }),
    );
  });

  it("applies correct background color based on highlighting props", () => {
    render(
      <DebouncedTextArea
        {...defaultProps}
        required={true}
        highlight={true}
        highlightObject={{ s1: false }}
      />,
    );

    const textarea = screen.getByPlaceholderText("Type here...");

    // Check computed style for the highlight logic
    // rgba(253, 224, 71, .5) is the expected color for required + highlighting
    expect(textarea).toHaveStyle("background-color: rgba(253, 224, 71, .5)");
  });
});
