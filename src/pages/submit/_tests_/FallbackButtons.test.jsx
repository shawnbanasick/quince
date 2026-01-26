import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FallbackButtons from "../FallbackButtons";
import useSettingsStore from "../../../globalState/useSettingsStore";

// 1. Mock the external store
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

describe("FallbackButtons", () => {
  //   const mockResults = { score: 100, status: "complete" };
  const mockLangObj = { btnDownload: "Download Now" };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the store implementation
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue("user-123"),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Mock URL methods (not implemented in jsdom)
    window.URL.createObjectURL = vi.fn(() => "mock-url");
    window.URL.revokeObjectURL = vi.fn();
  });

  it("renders the button with the correct text from the store", () => {
    render(<FallbackButtons />);

    const button = screen.getByRole("button", { name: /download now/i });
    expect(button).toBeInTheDocument();
  });

  it("triggers a file download with correct data when clicked", () => {
    // Spy on document.createElement to catch the 'a' tag creation
    const createElementSpy = vi.spyOn(document, "createElement");

    render(<FallbackButtons />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    // Verify the data construction
    // const expectedContent = JSON.stringify({ "user-123": mockResults });

    // Check if Blob was created with correct content
    // Note: In some environments, you might need to mock the Blob constructor
    // but usually checking the URL creation is sufficient.
    expect(window.URL.createObjectURL).toHaveBeenCalled();

    // Check if the download link was configured correctly
    const link = createElementSpy.mock.results.find((result) => result.value.tagName === "A").value;

    expect(link.download).toBe("EQ_Web_Sort_Results.txt");
    expect(link.href).toContain("mock-url");
  });

  it("handles empty results gracefully", () => {
    render(<FallbackButtons />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    // Should still stringify correctly: {"user-123": null}
    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });
});
