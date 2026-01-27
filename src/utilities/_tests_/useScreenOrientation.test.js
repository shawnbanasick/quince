import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useScreenOrientation from "../useScreenOrientation";

describe("useScreenOrientation", () => {
  // 1. Mock the window.screen.orientation object
  beforeEach(() => {
    Object.defineProperty(window, "screen", {
      writable: true,
      value: {
        orientation: {
          type: "portrait-primary",
        },
      },
    });
  });

  it("should return the initial orientation", () => {
    const { result } = renderHook(() => useScreenOrientation());
    expect(result.current).toBe("portrait-primary");
  });

  it("should update orientation when the orientationchange event fires", () => {
    const { result } = renderHook(() => useScreenOrientation());

    // 2. Change the mock value
    window.screen.orientation.type = "landscape-primary";

    // 3. Manually dispatch the event
    act(() => {
      window.dispatchEvent(new Event("orientationchange"));
    });

    expect(result.current).toBe("landscape-primary");
  });

  it("should clean up the event listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScreenOrientation());

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("orientationchange", expect.any(Function));
    removeSpy.mockRestore();
  });
});
