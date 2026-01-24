import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Thinning from "../Thinning";
import { MemoryRouter } from "react-router-dom";

// 1. Mock the Global Stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn((selector) =>
    selector({
      langObj: {
        initialInstructionPart1: "Step 1",
        thinPageTitle: "Thinning Title",
        thinPageSubmitButton: "Submit",
        finalInstructions: "All Done!",
      },
      configObj: { headerBarColor: "#000" },
    }),
  ),
}));

vi.mock("../../globalState/useStore", () => ({
  default: vi.fn((selector) => {
    // Return dummy values based on what the component expects
    const state = {
      setProgressScore: vi.fn(),
      setCurrentPage: vi.fn(),
      setDisplayNextButton: vi.fn(),
      setIsThinningFinished: vi.fn(),
      isLeftSideFinished: false,
      isRightSideFinished: false,
      cardFontSizeThin: 14,
      cardHeightThin: 120,
    };
    return selector(state);
  }),
}));

// 2. Mock Utilities and Modals (to avoid rendering complex sub-trees)
vi.mock("../../../utilities/decodeHTML", () => ({ default: (val) => val }));
vi.mock("html-react-parser", () => ({ default: (val) => val }));
vi.mock("../finishThinningSorts", () => ({ default: vi.fn() }));
vi.mock("../moveSelectedPosCards", () => ({ default: vi.fn() }));
vi.mock("../moveSelectedNegCards", () => ({ default: vi.fn() }));

describe("Thinning Component", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();

    // Setup initial localStorage state required by the component logic
    localStorage.setItem(
      "posSorted",
      JSON.stringify([{ id: "1", statement: "Card 1", selected: false }]),
    );
    localStorage.setItem(
      "negSorted",
      JSON.stringify([{ id: "2", statement: "Card 2", selected: false }]),
    );
    localStorage.setItem(
      "thinDisplayControllerArray",
      JSON.stringify([{ side: "right", iteration: 1, maxNum: 1, targetCol: "col1" }]),
    );
  });

  it("renders the title and instructions correctly", () => {
    render(
      <MemoryRouter>
        <Thinning />
      </MemoryRouter>,
    );
    expect(screen.getByText("Thinning Title")).toBeDefined();
    expect(screen.getByText("Step 1")).toBeDefined();
  });

  it("disables the submit button if the required number of cards isn't selected", () => {
    render(
      <MemoryRouter>
        <Thinning />
      </MemoryRouter>,
    );
    const submitBtn = screen.getByText("Submit");
    expect(submitBtn).toBeDisabled();
  });

  it("selects a card when clicked and enables the submit button", async () => {
    render(
      <MemoryRouter>
        <Thinning />
      </MemoryRouter>,
    );

    const card = screen.getByText("Card 1");
    fireEvent.click(card);

    const submitBtn = screen.getByText("Submit");
    // In our beforeEach, maxNum is set to 1. Selecting 1 card should enable it.
    expect(submitBtn).not.toBeDisabled();
  });

  it("calls the handleConfirm logic when the submit button is clicked", () => {
    render(
      <MemoryRouter>
        <Thinning />
      </MemoryRouter>,
    );

    const card = screen.getByText("Card 1");
    fireEvent.click(card);

    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);

    // After clicking confirm, it should attempt to update the displayControllerArray
    // We check if localStorage was updated or if specific mocks were called
    const updatedArray = JSON.parse(localStorage.getItem("thinDisplayControllerArray"));
    // The component calls .shift() on the array and saves it
    expect(updatedArray.length).toBe(0);
  });

  it("shows final instructions when the display array is empty", () => {
    localStorage.setItem("thinDisplayControllerArray", JSON.stringify([]));
    render(
      <MemoryRouter>
        <Thinning />
      </MemoryRouter>,
    );

    expect(screen.getByText("All Done!")).toBeDefined();
  });
});
