// src/__mocks__/globalState/useSettingsStore.js
import { vi } from "vitest";

// Default language object for testing
const defaultLangObj = {
  moveTopMobileHead: "Move to Top",
  moveAllTopMobileText: "Are you sure you want to move all items to the top?",
  moveTopMobileButtonOK: "OK",
  mobileModalButtonCancel: "Cancel",
  // Add other common language keys that might be used
  closeButton: "Close",
  confirmAction: "Confirm",
  warning: "Warning",
  success: "Success",
  error: "Error",
};

// Create a mock implementation that can be customized
const createMockUseSettingsStore = () => {
  const mockStore = vi.fn();

  // Default implementation returns the langObj when selector is called
  mockStore.mockImplementation((selector) => {
    // Handle different selector patterns
    if (typeof selector === "function") {
      const selectorName = selector.toString();

      // Check if selector is asking for langObj
      if (selectorName.includes("langObj") || selectorName.includes("getLangObj")) {
        return defaultLangObj;
      }

      // Handle other potential selectors
      if (selectorName.includes("theme")) {
        return "light";
      }

      if (selectorName.includes("language")) {
        return "en";
      }

      // Default fallback
      return defaultLangObj;
    }

    // If selector is a string (direct property access)
    if (selector === "langObj") {
      return defaultLangObj;
    }

    return defaultLangObj;
  });

  return mockStore;
};

// Export the mock
const mockUseSettingsStore = createMockUseSettingsStore();

// Helper functions for test customization
export const setMockLangObj = (customLangObj) => {
  const mergedLangObj = { ...defaultLangObj, ...customLangObj };
  mockUseSettingsStore.mockImplementation((selector) => {
    if (typeof selector === "function") {
      const selectorName = selector.toString();
      if (selectorName.includes("langObj") || selectorName.includes("getLangObj")) {
        return mergedLangObj;
      }
    }
    return mergedLangObj;
  });
};

export const resetMockSettingsStore = () => {
  mockUseSettingsStore.mockClear();
  mockUseSettingsStore.mockImplementation((selector) => {
    if (typeof selector === "function") {
      const selectorName = selector.toString();
      if (selectorName.includes("langObj") || selectorName.includes("getLangObj")) {
        return defaultLangObj;
      }
    }
    return defaultLangObj;
  });
};

export const mockEmptyLangObj = () => {
  mockUseSettingsStore.mockImplementation((selector) => {
    return {};
  });
};

export const mockPartialLangObj = (partialObj) => {
  mockUseSettingsStore.mockImplementation((selector) => {
    return partialObj;
  });
};

export const mockLangObjWithHtml = () => {
  const htmlLangObj = {
    moveTopMobileHead: "<strong>Move to Top</strong>",
    moveAllTopMobileText: "Are you sure you want to <em>move all items</em> to the top?",
    moveTopMobileButtonOK: "<span>OK</span>",
    mobileModalButtonCancel: "<span>Cancel</span>",
  };

  mockUseSettingsStore.mockImplementation((selector) => {
    if (typeof selector === "function") {
      const selectorName = selector.toString();
      if (selectorName.includes("langObj") || selectorName.includes("getLangObj")) {
        return htmlLangObj;
      }
    }
    return htmlLangObj;
  });
};

export const mockNullLangObj = () => {
  mockUseSettingsStore.mockImplementation((selector) => {
    return null;
  });
};

// Export default mock
export default mockUseSettingsStore;

// Alternative export pattern if your project uses named exports
export { mockUseSettingsStore as useSettingsStore };

// For manual mock setup in test files
export const createCustomMockSettingsStore = (customImplementation) => {
  const customMock = vi.fn();

  if (typeof customImplementation === "function") {
    customMock.mockImplementation(customImplementation);
  } else {
    // If customImplementation is an object, return it directly
    customMock.mockImplementation(() => customImplementation);
  }

  return customMock;
};

// Test scenarios helper
export const getMockScenarios = () => ({
  default: () => defaultLangObj,
  empty: () => ({}),
  null: () => null,
  undefined: () => undefined,
  partial: () => ({
    moveTopMobileHead: "Move to Top",
    // Missing other properties
  }),
  withHtml: () => ({
    moveTopMobileHead: "<strong>Move to Top</strong>",
    moveAllTopMobileText: "Are you sure you want to <em>move all items</em> to the top?",
    moveTopMobileButtonOK: "<span>OK</span>",
    mobileModalButtonCancel: "<span>Cancel</span>",
  }),
  differentLanguage: () => ({
    moveTopMobileHead: "Mover al Superior",
    moveAllTopMobileText: "¿Estás seguro de que quieres mover todos los elementos arriba?",
    moveTopMobileButtonOK: "Aceptar",
    mobileModalButtonCancel: "Cancelar",
  }),
  longText: () => ({
    moveTopMobileHead: "Move All Items to the Top Position",
    moveAllTopMobileText:
      "This is a very long text that explains in detail what will happen when you move all the items to the top position. Are you absolutely sure you want to proceed with this action?",
    moveTopMobileButtonOK: "Yes, I am sure",
    mobileModalButtonCancel: "No, cancel this action",
  }),
});
