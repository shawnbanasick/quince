import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import LandingPage from "../Landing";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((text) => text),
}));
vi.mock("html-react-parser", () => ({
  default: vi.fn((text) => text),
}));
vi.mock("../../../utilities/calculateTimeOnPage", () => ({
  default: vi.fn(),
}));
vi.mock("../checkForIeBrowser", () => ({
  default: vi.fn(() => false),
}));
vi.mock("../../../utilities/detectMobileBrowser", () => ({
  default: vi.fn(() => false),
}));
vi.mock("../../../utilities/useScreenOrientation", () => ({
  default: vi.fn(() => "portrait-primary"),
}));
vi.mock("../parseParams", () => ({
  default: vi.fn(() => undefined),
}));
vi.mock("../../thinning/setMaxIterations", () => ({
  default: vi.fn(() => 5),
}));
vi.mock("../../thinning/createRightLeftArrays", () => ({
  default: vi.fn(() => [[], []]),
}));
vi.mock("../../thinning/createColumnData", () => ({
  default: vi.fn(() => []),
}));
vi.mock("lodash/shuffle", () => ({
  default: vi.fn((arr) => arr),
}));
vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid-1234-5678"),
}));

// Mock child components
vi.mock("../../landing/LandingModal", () => ({
  default: () => <div data-testid="landing-modal">Landing Modal</div>,
}));
vi.mock("../LogInScreen", () => ({
  default: () => <div data-testid="login-screen">Login Screen</div>,
}));
vi.mock("../MobileLogInScreen", () => ({
  default: () => <div data-testid="mobile-login-screen">Mobile Login Screen</div>,
}));
vi.mock("../MobilePartIdScreen", () => ({
  default: () => <div data-testid="mobile-partid-screen">Mobile PartId Screen</div>,
}));
vi.mock("../MobileAccessCodeScreen", () => ({
  default: () => <div data-testid="mobile-access-screen">Mobile Access Screen</div>,
}));
vi.mock("../PartIdScreen", () => ({
  default: () => <div data-testid="partid-screen">PartId Screen</div>,
}));
vi.mock("../AccessCodeScreen", () => ({
  default: () => <div data-testid="access-screen">Access Screen</div>,
}));
vi.mock("../InternetExplorerWarning", () => ({
  default: () => <div data-testid="ie-warning">IE Warning</div>,
}));
vi.mock("../LocalStart", () => ({
  default: () => <div data-testid="local-start">Local Start</div>,
}));

// Mock theme
const mockTheme = {
  primary: "#337ab7",
  secondary: "#286090",
  mobileText: "#000000",
};

// Helper to render with theme
const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

window.localStorage = localStorageMock;

describe("LandingPage", () => {
  let mockSetCurrentPage;
  let mockSetProgressScore;
  let mockSetUrlUsercode;
  let mockSetDisplayNextButton;
  let mockSetPostsortCommentCheckObj;
  let mockSetCardFontSizeSort;
  let mockSetCardFontSizePostsort;
  let mockSetMinCardHeightSort;
  let mockSetCardHeightSort;
  let mockSetMinCardHeightPostsort;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();

    // Setup mock functions
    mockSetCurrentPage = vi.fn();
    mockSetProgressScore = vi.fn();
    mockSetUrlUsercode = vi.fn();
    mockSetDisplayNextButton = vi.fn();
    mockSetPostsortCommentCheckObj = vi.fn();
    mockSetCardFontSizeSort = vi.fn();
    mockSetCardFontSizePostsort = vi.fn();
    mockSetMinCardHeightSort = vi.fn();
    mockSetCardHeightSort = vi.fn();
    mockSetMinCardHeightPostsort = vi.fn();

    // Mock useSettingsStore
    useSettingsStore.mockImplementation((selector) => {
      const mockState = {
        langObj: {
          landingHead: "Q-Sort Study",
          welcomeText: "Welcome to the study",
          mobileWelcomeText: "Mobile Welcome",
          screenOrientationText: "Please rotate your device",
        },
        configObj: {
          headerBarColor: "#337ab7",
          initialScreen: "anonymous",
          setupTarget: "server",
          useMobileMode: false,
          setDefaultFontSizePresort: false,
          setDefaultFontSizeSort: false,
          setMinCardHeightSort: false,
          setDefaultFontSizePostsort: false,
          setMinCardHeightPostsort: false,
          showSecondPosColumn: false,
          showSecondNegColumn: false,
        },
        mapObj: {
          qSortHeaders: ["-3", "-2", "-1", "0", "1", "2", "3"],
          qSortPattern: [2, 3, 4, 5, 4, 3, 2],
        },
        statementsObj: {
          totalStatements: 30,
          columnStatements: {
            statementList: [{ id: 1, statement: "Test" }],
          },
        },
      };
      return selector(mockState);
    });

    // Mock useStore
    useStore.mockImplementation((selector) => {
      const mockState = {
        dataLoaded: true,
        currentPage: "landing",
        setCurrentPage: mockSetCurrentPage,
        setProgressScore: mockSetProgressScore,
        setUrlUsercode: mockSetUrlUsercode,
        displayLandingContent: false,
        setDisplayNextButton: mockSetDisplayNextButton,
        setPostsortCommentCheckObj: mockSetPostsortCommentCheckObj,
        setCardFontSizeSort: mockSetCardFontSizeSort,
        setCardFontSizePostsort: mockSetCardFontSizePostsort,
        setMinCardHeightSort: mockSetMinCardHeightSort,
        setCardHeightSort: mockSetCardHeightSort,
        setMinCardHeightPostsort: mockSetMinCardHeightPostsort,
      };
      return selector(mockState);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render the component when data is loaded", () => {
      renderWithTheme(<LandingPage />);

      expect(screen.getByText("Q-Sort Study")).toBeInTheDocument();
    });

    it("should not render when data is not loaded", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          dataLoaded: false,
          setCurrentPage: mockSetCurrentPage,
          setProgressScore: mockSetProgressScore,
          setUrlUsercode: mockSetUrlUsercode,
          displayLandingContent: false,
          setDisplayNextButton: mockSetDisplayNextButton,
          setPostsortCommentCheckObj: mockSetPostsortCommentCheckObj,
          setCardFontSizeSort: mockSetCardFontSizeSort,
          setCardFontSizePostsort: mockSetCardFontSizePostsort,
          setMinCardHeightSort: mockSetMinCardHeightSort,
          setCardHeightSort: mockSetCardHeightSort,
          setMinCardHeightPostsort: mockSetMinCardHeightPostsort,
        };
        return selector(mockState);
      });

      const { container } = renderWithTheme(<LandingPage />);
      expect(container.firstChild).toBeNull();
    });

    it("should render the title bar with correct background color", () => {
      renderWithTheme(<LandingPage />);

      const titleBar = screen.getByText("Q-Sort Study");
      expect(titleBar).toBeInTheDocument();
    });

    it("should render landing modal", () => {
      renderWithTheme(<LandingPage />);

      expect(screen.getByTestId("landing-modal")).toBeInTheDocument();
    });
  });

  describe("Anonymous Access Mode", () => {
    it("should display landing content for anonymous mode", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          dataLoaded: true,
          displayLandingContent: true,
          setCurrentPage: mockSetCurrentPage,
          setProgressScore: mockSetProgressScore,
          setUrlUsercode: mockSetUrlUsercode,
          setDisplayNextButton: mockSetDisplayNextButton,
          setPostsortCommentCheckObj: mockSetPostsortCommentCheckObj,
          setCardFontSizeSort: mockSetCardFontSizeSort,
          setCardFontSizePostsort: mockSetCardFontSizePostsort,
          setMinCardHeightSort: mockSetMinCardHeightSort,
          setCardHeightSort: mockSetCardHeightSort,
          setMinCardHeightPostsort: mockSetMinCardHeightPostsort,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(screen.getByText("Welcome to the study")).toBeInTheDocument();
    });

    it("should set display next button for anonymous mode", () => {
      renderWithTheme(<LandingPage />);

      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
    });
  });

  describe("Login Screen Modes", () => {
    it("should display login screen for partId-access mode", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHead: "Q-Sort Study",
            welcomeText: "Welcome",
          },
          configObj: {
            headerBarColor: "#337ab7",
            initialScreen: "partId-access",
            setupTarget: "server",
            useMobileMode: false,
          },
          mapObj: {
            qSortHeaders: ["-3", "-2", "-1", "0", "1", "2", "3"],
            qSortPattern: [2, 3, 4, 5, 4, 3, 2],
          },
          statementsObj: {
            totalStatements: 30,
            columnStatements: { statementList: [] },
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(screen.getByTestId("login-screen")).toBeInTheDocument();
    });

    it("should display partId screen for partId mode", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHead: "Q-Sort Study",
            welcomeText: "Welcome",
          },
          configObj: {
            headerBarColor: "#337ab7",
            initialScreen: "partId",
            setupTarget: "server",
            useMobileMode: false,
          },
          mapObj: {
            qSortHeaders: ["-3", "-2", "-1", "0", "1", "2", "3"],
            qSortPattern: [2, 3, 4, 5, 4, 3, 2],
          },
          statementsObj: {
            totalStatements: 30,
            columnStatements: { statementList: [] },
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(screen.getByTestId("partid-screen")).toBeInTheDocument();
    });

    it("should display access code screen for access mode", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHead: "Q-Sort Study",
            welcomeText: "Welcome",
          },
          configObj: {
            headerBarColor: "#337ab7",
            initialScreen: "access",
            setupTarget: "server",
            useMobileMode: false,
          },
          mapObj: {
            qSortHeaders: ["-3", "-2", "-1", "0", "1", "2", "3"],
            qSortPattern: [2, 3, 4, 5, 4, 3, 2],
          },
          statementsObj: {
            totalStatements: 30,
            columnStatements: { statementList: [] },
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(screen.getByTestId("access-screen")).toBeInTheDocument();
    });
  });

  describe("Internet Explorer Detection", () => {
    it("should display IE warning when IE is detected", async () => {
      const checkForIeBrowser = await import("../checkForIeBrowser");
      vi.mocked(checkForIeBrowser.default).mockReturnValue(true);

      renderWithTheme(<LandingPage />);

      expect(screen.getByTestId("ie-warning")).toBeInTheDocument();
    });

    it("should hide other content when IE is detected", async () => {
      const checkForIeBrowser = await import("../checkForIeBrowser");
      vi.mocked(checkForIeBrowser.default).mockReturnValue(true);

      useStore.mockImplementation((selector) => {
        const mockState = {
          dataLoaded: true,
          displayLandingContent: true,
          setCurrentPage: mockSetCurrentPage,
          setProgressScore: mockSetProgressScore,
          setUrlUsercode: mockSetUrlUsercode,
          setDisplayNextButton: mockSetDisplayNextButton,
          setPostsortCommentCheckObj: mockSetPostsortCommentCheckObj,
          setCardFontSizeSort: mockSetCardFontSizeSort,
          setCardFontSizePostsort: mockSetCardFontSizePostsort,
          setMinCardHeightSort: mockSetMinCardHeightSort,
          setCardHeightSort: mockSetCardHeightSort,
          setMinCardHeightPostsort: mockSetMinCardHeightPostsort,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(screen.getByTestId("ie-warning")).toBeInTheDocument();
      expect(screen.queryByText("Welcome to the study")).not.toBeInTheDocument();
    });
  });

  describe("Local Setup Mode", () => {
    it("should display LocalStart component for local setup", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHead: "Q-Sort Study",
            welcomeText: "Welcome",
          },
          configObj: {
            headerBarColor: "#337ab7",
            initialScreen: "anonymous",
            setupTarget: "local",
            useMobileMode: false,
          },
          mapObj: {
            qSortHeaders: ["-3", "-2", "-1", "0", "1", "2", "3"],
            qSortPattern: [2, 3, 4, 5, 4, 3, 2],
          },
          statementsObj: {
            totalStatements: 30,
            columnStatements: { statementList: [] },
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(screen.getByTestId("local-start")).toBeInTheDocument();
    });

    it("should not display title bar for local setup", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHead: "Q-Sort Study",
          },
          configObj: {
            setupTarget: "local",
          },
          mapObj: {
            qSortHeaders: [],
            qSortPattern: [],
          },
          statementsObj: {
            totalStatements: 0,
            columnStatements: { statementList: [] },
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(screen.queryByText("Q-Sort Study")).not.toBeInTheDocument();
    });
  });

  //   describe("Mobile Mode", () => {
  //     beforeEach(async () => {
  //       const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
  //       vi.mocked(detectMobileBrowser.default).mockReturnValue(true);

  //       useSettingsStore.mockImplementation((selector) => {
  //         const mockState = {
  //           langObj: {
  //             landingHead: "Q-Sort Study",
  //             mobileWelcomeText: "Mobile Welcome",
  //             screenOrientationText: "Please rotate",
  //           },
  //           configObj: {
  //             headerBarColor: "#337ab7",
  //             initialScreen: "anonymous",
  //             setupTarget: "server",
  //             useMobileMode: true,
  //           },
  //           mapObj: {
  //             qSortHeaders: [],
  //             qSortPattern: [],
  //           },
  //           statementsObj: {
  //             totalStatements: 30,
  //             columnStatements: {
  //               statementList: [{ id: 1, statement: "Test" }],
  //             },
  //           },
  //         };
  //         return selector(mockState);
  //       });
  //     });

  // it("should display mobile login screen in mobile mode", () => {
  //   useSettingsStore.mockImplementation((selector) => {
  //     const mockState = {
  //       langObj: {
  //         landingHead: "Q-Sort Study",
  //         mobileWelcomeText: "Mobile Welcome",
  //       },
  //       configObj: {
  //         headerBarColor: "#337ab7",
  //         initialScreen: "partId-access",
  //         setupTarget: "server",
  //         useMobileMode: true,
  //       },
  //       mapObj: {
  //         qSortHeaders: [],
  //         qSortPattern: [],
  //       },
  //       statementsObj: {
  //         totalStatements: 30,
  //         columnStatements: { statementList: [] },
  //       },
  //     };
  //     return selector(mockState);
  //   });

  //   renderWithTheme(<LandingPage />);

  //   expect(screen.getByTestId("mobile-login-screen")).toBeInTheDocument();
  // });

  // it("should display mobile partId screen in mobile mode", () => {
  //   useSettingsStore.mockImplementation((selector) => {
  //     const mockState = {
  //       langObj: {
  //         landingHead: "Q-Sort Study",
  //         mobileWelcomeText: "Mobile Welcome",
  //       },
  //       configObj: {
  //         headerBarColor: "#337ab7",
  //         initialScreen: "partId",
  //         setupTarget: "server",
  //         useMobileMode: true,
  //       },
  //       mapObj: {
  //         qSortHeaders: [],
  //         qSortPattern: [],
  //       },
  //       statementsObj: {
  //         totalStatements: 30,
  //         columnStatements: { statementList: [] },
  //       },
  //     };
  //     return selector(mockState);
  //   });

  //   renderWithTheme(<LandingPage />);

  //   expect(screen.getByTestId("mobile-partid-screen")).toBeInTheDocument();
  // });

  // it("should display mobile access screen in mobile mode", () => {
  //   useSettingsStore.mockImplementation((selector) => {
  //     const mockState = {
  //       langObj: {
  //         landingHead: "Q-Sort Study",
  //         mobileWelcomeText: "Mobile Welcome",
  //       },
  //       configObj: {
  //         headerBarColor: "#337ab7",
  //         initialScreen: "access",
  //         setupTarget: "server",
  //         useMobileMode: true,
  //       },
  //       mapObj: {
  //         qSortHeaders: [],
  //         qSortPattern: [],
  //       },
  //       statementsObj: {
  //         totalStatements: 30,
  //         columnStatements: { statementList: [] },
  //       },
  //     };
  //     return selector(mockState);
  //   });

  //   renderWithTheme(<LandingPage />);

  //   expect(screen.getByTestId("mobile-access-screen")).toBeInTheDocument();
  // });

  //     it("should display mobile welcome content when logged in", () => {
  //       useStore.mockImplementation((selector) => {
  //         const mockState = {
  //           dataLoaded: true,
  //           displayLandingContent: true,
  //           setCurrentPage: mockSetCurrentPage,
  //           setProgressScore: mockSetProgressScore,
  //           setUrlUsercode: mockSetUrlUsercode,
  //           setDisplayNextButton: mockSetDisplayNextButton,
  //           setPostsortCommentCheckObj: mockSetPostsortCommentCheckObj,
  //           setCardFontSizeSort: mockSetCardFontSizeSort,
  //           setCardFontSizePostsort: mockSetCardFontSizePostsort,
  //           setMinCardHeightSort: mockSetMinCardHeightSort,
  //           setCardHeightSort: mockSetCardHeightSort,
  //           setMinCardHeightPostsort: mockSetMinCardHeightPostsort,
  //         };
  //         return selector(mockState);
  //       });

  //       renderWithTheme(<LandingPage />);

  //       expect(screen.getByText("Mobile Welcome")).toBeInTheDocument();
  //     });
  //   });

  describe("Screen Orientation", () => {
    it("should show orientation warning in landscape mode on mobile", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      const useScreenOrientation = await import("../../../utilities/useScreenOrientation");

      vi.mocked(detectMobileBrowser.default).mockReturnValue(true);
      vi.mocked(useScreenOrientation.default).mockReturnValue("landscape-primary");

      renderWithTheme(<LandingPage />);

      expect(screen.getByText("Please rotate your device")).toBeInTheDocument();
    });

    it("should not show orientation warning in portrait mode", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      const useScreenOrientation = await import("../../../utilities/useScreenOrientation");

      vi.mocked(detectMobileBrowser.default).mockReturnValue(true);
      vi.mocked(useScreenOrientation.default).mockReturnValue("portrait-primary");

      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            landingHead: "Q-Sort Study",
            mobileWelcomeText: "Mobile Welcome",
            screenOrientationText: "Please rotate",
          },
          configObj: {
            headerBarColor: "#337ab7",
            initialScreen: "anonymous",
            setupTarget: "server",
            useMobileMode: true,
          },
          mapObj: {
            qSortHeaders: [],
            qSortPattern: [],
          },
          statementsObj: {
            totalStatements: 30,
            columnStatements: { statementList: [] },
          },
        };
        return selector(mockState);
      });

      useStore.mockImplementation((selector) => {
        const mockState = {
          dataLoaded: true,
          displayLandingContent: true,
          setCurrentPage: mockSetCurrentPage,
          setProgressScore: mockSetProgressScore,
          setUrlUsercode: mockSetUrlUsercode,
          setDisplayNextButton: mockSetDisplayNextButton,
          setPostsortCommentCheckObj: mockSetPostsortCommentCheckObj,
          setCardFontSizeSort: mockSetCardFontSizeSort,
          setCardFontSizePostsort: mockSetCardFontSizePostsort,
          setMinCardHeightSort: mockSetMinCardHeightSort,
          setCardHeightSort: mockSetCardHeightSort,
          setMinCardHeightPostsort: mockSetMinCardHeightPostsort,
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(screen.queryByText("Please rotate your device")).not.toBeInTheDocument();
    });
  });

  describe("UseEffect Hooks", () => {
    it("should call setCurrentPage with landing on mount", () => {
      renderWithTheme(<LandingPage />);

      expect(mockSetCurrentPage).toHaveBeenCalledWith("landing");
    });

    it("should call setProgressScore with 10 on mount", () => {
      renderWithTheme(<LandingPage />);

      expect(mockSetProgressScore).toHaveBeenCalledWith(10);
    });

    it("should set currentPage in localStorage", () => {
      renderWithTheme(<LandingPage />);

      expect(localStorage.setItem).toHaveBeenCalledWith("currentPage", "landing");
    });

    it("should set random ID in localStorage", () => {
      renderWithTheme(<LandingPage />);

      expect(localStorage.setItem).toHaveBeenCalledWith("randomId", expect.any(String));
    });
  });

  describe("LocalStorage Cleanup", () => {
    it("should clear localStorage when landing is reload", () => {
      localStorage.setItem("currentPage", "landing");

      renderWithTheme(<LandingPage />);

      expect(localStorage.removeItem).toHaveBeenCalledWith("columns");
      expect(localStorage.removeItem).toHaveBeenCalledWith("sortColumns");
      expect(localStorage.removeItem).toHaveBeenCalledWith("resultsPresort");
    });

    it("should set default font size object in localStorage", () => {
      renderWithTheme(<LandingPage />);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "m_FontSizeObject",
        JSON.stringify({
          presort: 2,
          thin: 2,
          sort: 2,
          postsort: 2,
        })
      );
    });

    it("should set default view size object in localStorage", () => {
      renderWithTheme(<LandingPage />);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "m_ViewSizeObject",
        JSON.stringify({
          presort: 42,
          thin: 68,
          sort: 72,
          postsort: 72,
          survey: 72,
        })
      );
    });
  });

  describe("URL Parameter Handling", () => {
    it("should set urlUsercode from URL when available", async () => {
      const parseParams = await import("../parseParams");
      vi.mocked(parseParams.default).mockReturnValue("user123");

      renderWithTheme(<LandingPage />);

      expect(mockSetUrlUsercode).toHaveBeenCalledWith("user123");
      expect(localStorage.setItem).toHaveBeenCalledWith("urlUsercode", "user123");
    });

    it("should set urlUsercode to not_set when no URL param", async () => {
      const parseParams = await import("../parseParams");
      vi.mocked(parseParams.default).mockReturnValue(undefined);

      renderWithTheme(<LandingPage />);

      expect(mockSetUrlUsercode).toHaveBeenCalledWith("not_set");
    });
  });

  describe("Configuration Settings", () => {
    it("should set font size when configured", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: { landingHead: "Test" },
          configObj: {
            setupTarget: "server",
            initialScreen: "anonymous",
            setDefaultFontSizePostsort: true,
            defaultFontSizePostsort: "18px",
          },
          mapObj: {
            qSortHeaders: [],
            qSortPattern: [],
          },
          statementsObj: {
            totalStatements: 30,
            columnStatements: { statementList: [] },
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(mockSetCardFontSizePostsort).toHaveBeenCalledWith("18px");
    });

    it("should set min card height when configured", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: { landingHead: "Test" },
          configObj: {
            setupTarget: "server",
            initialScreen: "anonymous",
            setMinCardHeightPostsort: true,
            minCardHeightPostsort: "100px",
          },
          mapObj: {
            qSortHeaders: [],
            qSortPattern: [],
          },
          statementsObj: {
            totalStatements: 30,
            columnStatements: { statementList: [] },
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<LandingPage />);

      expect(mockSetMinCardHeightPostsort).toHaveBeenCalledWith("100px");
    });
  });

  //   describe("Postsort Comment Object Setup", () => {
  //     it("should create postsort comment check object", () => {
  //       useSettingsStore.mockImplementation((selector) => {
  //         const mockState = {
  //           langObj: { landingHead: "Test" },
  //           configObj: {
  //             setupTarget: "server",
  //             initialScreen: "anonymous",
  //             showSecondPosColumn: false,
  //             showSecondNegColumn: false,
  //           },
  //           mapObj: {
  //             qSortHeaders: [],
  //             qSortPattern: { "-3": 2, "-2": 3, 2: 3, 3: 2 },
  //           },
  //           statementsObj: {
  //             totalStatements: 30,
  //             columnStatements: { statementList: [] },
  //           },
  //         };
  //         return selector(mockState);
  //       });

  //       renderWithTheme(<LandingPage />);

  //       expect(mockSetPostsortCommentCheckObj).toHaveBeenCalled();
  //     });
  //   });
});
