import { expect, test } from "vitest";
import { sum } from "./sum.js";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

// import React from "react";
// import { render, screen } from "@testing-library/react";
// import PresortPage from "../Presort";
// import * as useSettingsStoreModule from "../../../globalState/useSettingsStore";
// import * as useStoreModule from "../../../globalState/useStore";

// // Mock dependencies
// jest.mock("../PresortDndImages", () => () => <div data-testid="PresortDndImages" />);
// jest.mock("../PresortDND", () => () => <div data-testid="PresortDND" />);
// jest.mock("../PresortModal", () => () => <div data-testid="PresortModal" />);
// jest.mock("../PresortFinishedModal", () => () => <div data-testid="PresortFinishedModal" />);
// jest.mock("../PresortPreventNavModal", () => () => <div data-testid="PresortPreventNavModal" />);
// jest.mock("../PresortIsComplete", () => () => <div data-testid="PresortIsComplete" />);
// jest.mock("../PleaseLogInFirst", () => () => <div data-testid="PleaseLogInFirst" />);
// jest.mock("../../utilities/PromptUnload", () => () => <div data-testid="PromptUnload" />);

// describe("PresortPage", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   function setup({
//     isLoggedIn = true,
//     presortNoReturn = false,
//     initialScreen = "anonymous",
//     useImages = false,
//   } = {}) {
//     jest.spyOn(useSettingsStoreModule, "default").mockImplementation((selector) =>
//       selector({
//         langObj: { titleBarText: "Test Title" },
//         configObj: {
//           headerBarColor: "#123456",
//           initialScreen,
//           useImages,
//           setupTarget: "remote",
//         },
//         statementsObj: {
//           columnStatements: { statementList: ["a", "b"] },
//         },
//         isLoggedIn,
//         resetColumnStatements: { statementList: ["x", "y"] },
//       })
//     );
//     jest.spyOn(useStoreModule, "default").mockImplementation((selector) =>
//       selector({
//         cardFontSizePresort: 16,
//         setCurrentPage: jest.fn(),
//         setProgressScore: jest.fn(),
//         presortNoReturn,
//         setDisplayNextButton: jest.fn(),
//         getPresortNoReturn: presortNoReturn,
//       })
//     );
//     localStorage.setItem("fontSizePresort", "16");
//   }

//   it("renders PresortDND when useImages is false", () => {
//     setup({ useImages: false });
//     render(<PresortPage />);
//     expect(screen.getByTestId("PresortDND")).toBeInTheDocument();
//     expect(screen.getByText("Test Title")).toBeInTheDocument();
//   });

//   it("renders PresortDndImages when useImages is true", () => {
//     setup({ useImages: true });
//     render(<PresortPage />);
//     expect(screen.getByTestId("PresortDndImages")).toBeInTheDocument();
//   });

//   it("renders PleaseLogInFirst if not logged in and initialScreen is not anonymous", () => {
//     setup({ isLoggedIn: false, initialScreen: "login" });
//     render(<PresortPage />);
//     expect(screen.getByTestId("PleaseLogInFirst")).toBeInTheDocument();
//   });

//   it("renders PresortIsComplete if presortNoReturn is true", () => {
//     setup({ presortNoReturn: true });
//     render(<PresortPage />);
//     expect(screen.getByTestId("PresortIsComplete")).toBeInTheDocument();
//   });
// });
