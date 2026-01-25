import { renderHook, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createPortal } from "react-dom";
import useDraggableInPortal from "../useDraggableInPortal";

// Mock react-dom's createPortal to verify it's being called correctly
vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    createPortal: vi.fn((children) => children),
  };
});

describe("useDraggableInPortal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should create and append a portal container to the body on mount", () => {
    renderHook(() => useDraggableInPortal());

    const portalDiv = document.body.querySelector("div");
    expect(portalDiv).toBeTruthy();
  });

  it("should remove the portal container from the body on unmount", () => {
    const { unmount } = renderHook(() => useDraggableInPortal());
    expect(document.body.innerHTML).not.toBe("");

    unmount();
    expect(document.body.innerHTML).toBe("<div></div>");
  });

  it("should return a portal when position is 'fixed'", () => {
    const { result } = renderHook(() => useDraggableInPortal());
    const renderInPortal = result.current;

    const mockElement = { type: "div", props: {} };
    const mockRender = vi.fn(() => mockElement);
    const provided = {
      draggableProps: {
        style: { position: "fixed" },
      },
    };

    const outcome = renderInPortal(mockRender)(provided);

    expect(createPortal).toHaveBeenCalled();
    expect(outcome).toBe(mockElement);
  });

  it("should return the original element when position is NOT 'fixed'", () => {
    const { result } = renderHook(() => useDraggableInPortal());
    const renderInPortal = result.current;

    const mockElement = { type: "div", props: {} };
    const mockRender = vi.fn(() => mockElement);
    const provided = {
      draggableProps: {
        style: { position: "absolute" }, // Not fixed
      },
    };

    const outcome = renderInPortal(mockRender)(provided);

    expect(createPortal).not.toHaveBeenCalled();
    expect(outcome).toBe(mockElement);
  });
});
