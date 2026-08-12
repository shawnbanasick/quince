import { useEffect, useRef } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PromptUnload from "../../utilities/PromptUnload";
import finishThinningSorts from "./finishThinningSorts";
import ConfirmationModal from "./ConfirmationModal";
import ThinningPreventNavModal from "./ThinningPreventNavModal";
import Instructions from "./Instructions";
import moveSelectedNegCards from "./moveSelectedNegCards";
import moveSelectedPosCards from "./moveSelectedPosCards";
import useLocalStorage from "../../utilities/useLocalStorage";
import ThinHelpModal from "./ThinHelpModal";

/* eslint react/prop-types: 0 */

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getSetProgressScore = (state) => state.setProgressScore;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetIsThinningFinished = (state) => state.setIsThinningFinished;
const getIsLeftSideFinished = (state) => state.isLeftSideFinished;
const getIsRightSideFinished = (state) => state.isRightSideFinished;
const getCardFontSizeThin = (state) => state.cardFontSizeThin;
const getCardHeightThin = (state) => state.cardHeightThin;

function safeParse(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.log(error);
    return fallback;
  }
}

const Thinning = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const setProgressScore = useStore(getSetProgressScore);
  const setCurrentPage = useStore(getSetCurrentPage);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  const setIsThinningFinished = useStore(getSetIsThinningFinished);
  const isLeftSideFinished = useStore(getIsLeftSideFinished);
  const isRightSideFinished = useStore(getIsRightSideFinished);
  const cardFontSizeThin = useStore(getCardFontSizeThin);
  const cardHeightThin = useStore(getCardHeightThin);

  // Get language object values
  let initialInstructionPart1 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPart1)) || "";
  let initialInstructionPartNeg1 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPartNeg1)) || "";
  let initialInstructionPartNeg2 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPartNeg2)) || "";
  let initialInstructionPart2 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPart2)) || "";
  let initialInstructionPart3 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPart3)) || "";
  let thinPageTitle = ReactHtmlParser(decodeHTML(langObj.thinPageTitle)) || "";
  let thinPageSubmitButton =
    ReactHtmlParser(decodeHTML(langObj.thinPageSubmitButton)) || "";
  let finalInstructions =
    ReactHtmlParser(decodeHTML(langObj.finalInstructions)) || "";

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isRightSideFinished === false || isLeftSideFinished === false) {
        event.preventDefault();
        event.returnValue = ""; // For legacy browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLeftSideFinished, isRightSideFinished]);

  // *******************************
  // **** Local State Variables *******************************************
  // *******************************

  let [selectedNegItems, setSelectedNegItems] = useLocalStorage(
    "selectedNegItems",
    safeParse("negSorted", []),
  );
  let [selectedPosItems, setSelectedPosItems] = useLocalStorage(
    "selectedPosItems",
    safeParse("posSorted", []),
  );

  let [displayControllerArray, setDisplayControllerArray] = useLocalStorage(
    "thinDisplayControllerArray",
    safeParse("thinDisplayControllerArray", []),
  );

  let instructionsRef = useRef({ part1: "", part2: "", part3: "" });

  let hasFinishedRef = useRef(false);

  // *******************************************************
  // *** Display ****************************************
  // *******************************************************
  let cards;

  // detect display side
  if (displayControllerArray[0]?.side === "right") {
    if (displayControllerArray[0]?.iteration === 1) {
      instructionsRef.current = {
        part1: initialInstructionPart1,
        part2: "",
        part3: initialInstructionPart3,
      };
    }
    if (displayControllerArray[0]?.iteration > 1) {
      instructionsRef.current = {
        part1: "",
        part2: initialInstructionPart2,
        part3: initialInstructionPart3,
      };
    }
    cards = [...selectedPosItems];
  }

  if (displayControllerArray[0]?.side === "left") {
    if (displayControllerArray[0]?.iteration === 1) {
      instructionsRef.current = {
        part1: initialInstructionPartNeg1,
        part2: "",
        part3: initialInstructionPart3,
      };
    }
    if (displayControllerArray[0]?.iteration > 1) {
      instructionsRef.current = {
        part1: "",
        part2: initialInstructionPartNeg2,
        part3: initialInstructionPart3,
      };
    }
    cards = [...selectedNegItems];
  }

  // *** if display finished
  // showMain is now purely derived from state, no side effects here.
  let showMain = displayControllerArray.length > 0;

  // ********************************************************
  // *** EVENT HANDLING *************************************
  // ********************************************************

  // todo *** HANDLE BOX CLICK ***
  //
  const handleClick = (e) => {
    let targetcol = e.currentTarget.getAttribute("data-targetcol");
    let clickedId = e.currentTarget.dataset.id;

    let updatedCards = cards.map((item) =>
      item.id === clickedId
        ? { ...item, targetcol, selected: !item.selected }
        : item,
    );

    if (displayControllerArray[0]?.side === "right") {
      setSelectedPosItems(updatedCards);
    }
    if (displayControllerArray[0]?.side === "left") {
      setSelectedNegItems(updatedCards);
    }
  };

  const handleConfirm = () => {
    if (displayControllerArray[0]?.side === "right") {
      let currentSelectedPosItems = selectedPosItems.filter(
        (item) => item.selected === true,
      );
      let nextSelectedPosItemsSet = selectedPosItems.filter(
        (item) => item.selected !== true,
      );
      localStorage.setItem(
        "posSorted",
        JSON.stringify(nextSelectedPosItemsSet),
      );
      moveSelectedPosCards(currentSelectedPosItems);
      let nextDisplayControllerArray = displayControllerArray.slice(1);
      setDisplayControllerArray(nextDisplayControllerArray);
      setSelectedPosItems(nextSelectedPosItemsSet);
      return;
    }

    if (displayControllerArray[0]?.side === "left") {
      let currentSelectedNegItems = selectedNegItems.filter(
        (item) => item.selected === true,
      );
      let nextSelectedNegItemsSet = selectedNegItems.filter(
        (item) => item.selected !== true,
      );
      localStorage.setItem(
        "negSorted",
        JSON.stringify(nextSelectedNegItemsSet),
      );
      moveSelectedNegCards(currentSelectedNegItems);
      let nextDisplayControllerArray = displayControllerArray.slice(1);
      setDisplayControllerArray(nextDisplayControllerArray);
      setSelectedNegItems(nextSelectedNegItemsSet);
      return;
    }
  };

  let selectedStatementsNum = 0;

  let requiredNum = Math.min(
    displayControllerArray[0]?.maxNum ?? 0,
    (cards || []).length,
  );

  // set TIME-ON-PAGE records
  const startTimeRef = useRef(null);
  useEffect(() => {
    startTimeRef.current = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("thin");
      localStorage.setItem("currentPage", "thin");
      await setProgressScore(35);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTimeRef.current, "thinningPage", "thinningPage");
    };
  }, [setCurrentPage, setProgressScore]);

  useEffect(() => {
    setDisplayNextButton(true);
  }, [displayControllerArray, setDisplayNextButton]);

  useEffect(() => {
    if (displayControllerArray.length === 0 && !hasFinishedRef.current) {
      hasFinishedRef.current = true;

      let finalSortColData = safeParse("finalSortColData", null);
      let newCols = safeParse("newCols", null);
      let completedCols = finishThinningSorts(newCols, finalSortColData);
      localStorage.setItem("columnStatements", JSON.stringify(completedCols));

      const timer = setTimeout(() => {
        setIsThinningFinished(true);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [displayControllerArray, setIsThinningFinished]);

  let assessedStatements = (cards || []).map((item) => {
    if (item.selected === true) {
      selectedStatementsNum = selectedStatementsNum + 1;
    }
    return (
      <Card
        onClick={handleClick}
        id={item.id}
        key={item.id}
        side={displayControllerArray[0]?.side}
        fontSize={cardFontSizeThin}
        cardHeight={cardHeightThin}
        color={item.color}
        selected={item.selected}
        data-targetcol={displayControllerArray[0]?.targetCol}
        data-max={requiredNum}
        data-selected={item.selected}
        data-id={item.id}
      >
        {item.statement}
      </Card>
    );
  });

  if (showMain === true) {
    return (
      <>
        <PromptUnload />
        <ConfirmationModal />
        <ThinningPreventNavModal />
        <ThinHelpModal />
        <Header background={configObj.headerBarColor}>
          <HeaderTitle>{thinPageTitle}</HeaderTitle>
        </Header>
        <MainContent>
          <ContentContainer>
            <InstructionsSection>
              <Instructions
                part1={instructionsRef.current.part1}
                part2={instructionsRef.current.part2}
                part3={instructionsRef.current.part3}
                maxNum={requiredNum}
                selectedNum={selectedStatementsNum}
              />
              <ActionButton
                onClick={handleConfirm}
                disabled={selectedStatementsNum !== requiredNum}
                isActive={selectedStatementsNum === requiredNum}
              >
                {thinPageSubmitButton}
              </ActionButton>
            </InstructionsSection>
            <CardsGrid>{assessedStatements}</CardsGrid>
          </ContentContainer>
        </MainContent>
      </>
    );
  } else {
    return (
      <>
        <PromptUnload />
        <ConfirmationModal />
        <ThinningPreventNavModal />
        <ThinHelpModal />
        <Header background={configObj.headerBarColor}>
          <HeaderTitle>{thinPageTitle}</HeaderTitle>
        </Header>
        <MainContent>
          <FinalInstructionsContainer>
            <FinalInstructionsText>{finalInstructions}</FinalInstructionsText>
          </FinalInstructionsContainer>
        </MainContent>
      </>
    );
  }
};

export default Thinning;

const sideTheme = {
  right: {
    accent: "#16a34a",
    accentSoft: "#22c55e",
    bg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
  },
  left: {
    accent: "#dc2626",
    accentSoft: "#f97316",
    bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
  },
  neutral: {
    accent: "#94a3b8",
    accentSoft: "#cbd5e1",
    bg: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  },
};

const getTheme = (side) => sideTheme[side] || sideTheme.neutral;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${(props) => props.background};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05);
  }
`;

const HeaderTitle = styled.h1`
  color: white;
  font-weight: 700;
  font-size: clamp(1.2rem, 4vw, 1.75rem);
  margin: 0;
  padding: 1rem 1.5rem;
  text-align: center;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const MainContent = styled.main`
  padding-top: 60px; /* Account for fixed header */
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);

  @media (max-width: 768px) {
    padding-top: 70px;
  }
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

const InstructionsSection = styled.section`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }
`;

const ActionButton = styled.button`
  background: ${(props) =>
    props.isActive
      ? "linear-gradient(135deg, #367ab7 0%, #367ab7 100%)"
      : "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)"};
  color: ${(props) => (props.isActive ? "white" : "#6b7280")};
  border: none;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${(props) => (props.isActive ? "pointer" : "not-allowed")};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 140px;
  box-shadow: ${(props) =>
    props.isActive
      ? "0 4px 14px 0 rgba(54,122,183,1, 0.3)"
      : "0 2px 4px 0 rgba(0, 0, 0, 0.05)"};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.isActive
        ? "0 8px 25px 0 rgba(54,122,183,1, 0.4)"
        : "0 4px 12px 0 rgba(0, 0, 0, 0.1)"};
  }

  /* FIX: give :active a distinct, "pressed" feel instead of repeating
     the same translateY(-2px) used on :hover. */
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.97);
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.5rem;
    font-size: 1rem;
    min-width: 120px;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 0;
  margin-bottom: 100px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }
`;

const Card = styled.div`
  background: ${(props) =>
    props.selected ? "#fef9c3" : getTheme(props.side).bg};
  border: 2px solid
    ${(props) => (props.selected ? "#eab308" : getTheme(props.side).accentSoft)};
  border-radius: 12px;
  padding: 1rem;
  height: ${(props) => Math.max(props.cardHeight || 120, 120)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: ${(props) => props.fontSize || 14}px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
  overflow: hidden;
  position: relative;

  /* Selected state reads as a colored ring + soft fill rather than a
     flat saturated yellow block, so it stays legible against the
     pastel side colors instead of clashing with them. */
  box-shadow: ${(props) =>
    props.selected ? "0 0 0 2px rgba(234, 179, 8, 0.35)" : "none"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${(props) =>
      props.selected ? "#ca8a04" : getTheme(props.side).accent};
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    height: ${(props) => Math.max((props.cardHeight || 120) * 0.9, 100)}px;
    border-radius: 8px;

    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const FinalInstructionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FinalInstructionsText = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: #1f2937;
  line-height: 1.6;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 12px;
  }
`;
