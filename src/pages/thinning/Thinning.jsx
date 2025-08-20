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
import { v4 as uuid } from "uuid";
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
  let initialInstructionPart1 = ReactHtmlParser(decodeHTML(langObj.initialInstructionPart1)) || "";
  let initialInstructionPartNeg1 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPartNeg1)) || "";
  let initialInstructionPartNeg2 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPartNeg2)) || "";
  let initialInstructionPart2 = ReactHtmlParser(decodeHTML(langObj.initialInstructionPart2)) || "";
  let initialInstructionPart3 = ReactHtmlParser(decodeHTML(langObj.initialInstructionPart3)) || "";
  let thinPageTitle = ReactHtmlParser(decodeHTML(langObj.thinPageTitle)) || "";
  let thinPageSubmitButton = ReactHtmlParser(decodeHTML(langObj.thinPageSubmitButton)) || "";
  let finalInstructions = ReactHtmlParser(decodeHTML(langObj.finalInstructions)) || "";

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

  let showMain = true;

  let [selectedNegItems, setSelectedNegItems] = useLocalStorage(
    "selectedNegItems",
    JSON.parse(localStorage.getItem("negSorted"))
  );
  let [selectedPosItems, setSelectedPosItems] = useLocalStorage(
    "selectedPosItems",
    JSON.parse(localStorage.getItem("posSorted"))
  );

  let [displayControllerArray, setDisplayControllerArray] = useLocalStorage(
    "thinDisplayControllerArray",
    JSON.parse(localStorage.getItem("thinDisplayControllerArray"))
  );

  let instructionsRef = useRef({ part1: "", part2: "", part3: "" });

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
  if (displayControllerArray.length === 0) {
    showMain = false;
    setTimeout(() => {
      setIsThinningFinished(true);
    }, 50);
    let finalSortColData = JSON.parse(localStorage.getItem("finalSortColData"));

    let newCols = JSON.parse(localStorage.getItem("newCols"));
    let completedCols = finishThinningSorts(newCols, finalSortColData);
    localStorage.setItem("columnStatements", JSON.stringify(completedCols));
  }

  // ********************************************************
  // *** EVENT HANDLING *************************************
  // ********************************************************

  // todo *** HANDLE BOX CLICK ***
  const handleClick = (e) => {
    let targetcol = e.target.getAttribute("data-targetcol");

    cards.forEach((item) => {
      if (item.id === e.target.dataset.id) {
        item.targetcol = targetcol;
        item.selected = !item.selected;
      }
    });
    if (displayControllerArray[0]?.side === "right") {
      setSelectedPosItems([...cards]);
    }
    if (displayControllerArray[0]?.side === "left") {
      setSelectedNegItems([...cards]);
    }
  };

  const handleConfirm = () => {
    if (displayControllerArray[0]?.side === "right") {
      let currentSelectedPosItems = selectedPosItems.filter((item) => item.selected === true);
      let nextSelectedPosItemsSet = selectedPosItems.filter((item) => item.selected !== true);
      localStorage.setItem("posSorted", JSON.stringify(nextSelectedPosItemsSet));
      moveSelectedPosCards(currentSelectedPosItems);
      displayControllerArray.shift();
      setDisplayControllerArray([...displayControllerArray]);
      setSelectedPosItems([...nextSelectedPosItemsSet]);
      return;
    }

    if (displayControllerArray[0]?.side === "left") {
      let currentSelectedNegItems = selectedNegItems.filter((item) => item.selected === true);
      let nextSelectedNegItemsSet = selectedNegItems.filter((item) => item.selected !== true);
      moveSelectedNegCards(currentSelectedNegItems);
      displayControllerArray.shift();
      setDisplayControllerArray([...displayControllerArray]);
      setSelectedNegItems([...nextSelectedNegItemsSet]);
      return;
    }
  };

  setDisplayNextButton(true);

  let selectedStatementsNum = 0;

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

  let assessedStatements = (cards || []).map((item) => {
    if (item.selected === true) {
      selectedStatementsNum = selectedStatementsNum + 1;
    }
    return (
      <Card
        onClick={handleClick}
        id={item.id}
        key={uuid()}
        side={displayControllerArray[0]?.side}
        fontSize={cardFontSizeThin}
        cardHeight={cardHeightThin}
        color={item.color}
        selected={item.selected}
        data-targetcol={displayControllerArray[0]?.targetCol}
        data-max={displayControllerArray[0]?.maxNum}
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
                maxNum={displayControllerArray[0]?.maxNum}
                selectedNum={selectedStatementsNum}
              />
              <ActionButton
                onClick={handleConfirm}
                disabled={selectedStatementsNum !== displayControllerArray[0]?.maxNum}
                isActive={selectedStatementsNum === displayControllerArray[0]?.maxNum}
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

// Styled Components with Improved CSS

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
  padding-top: 80px; /* Account for fixed header */
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
      ? "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)"
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
    props.isActive ? "0 4px 14px 0 rgba(59, 130, 246, 0.25)" : "0 2px 4px 0 rgba(0, 0, 0, 0.05)"};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.isActive ? "0 8px 25px 0 rgba(59, 130, 246, 0.35)" : "0 4px 12px 0 rgba(0, 0, 0, 0.1)"};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
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
  background: ${(props) => {
    if (props.selected && props.side === "right")
      return "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)";
    if (props.selected && props.side === "left")
      return "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)";
    return "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
  }};
  border: 2px solid
    ${(props) => {
      if (props.selected && props.side === "right") return "#22c55e";
      if (props.selected && props.side === "left") return "#ef6944";
      return "#e2e8f0";
    }};
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
  font-size: clamp(0.875rem, ${(props) => (props.fontSize || 14) / 16}rem + 0.2vw, 1.125rem);
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => {
      if (props.selected && props.side === "right") return "rgba(34, 197, 94, 0.05)";
      if (props.selected && props.side === "left") return "rgba(239, 68, 68, 0.05)";
      return "transparent";
    }};
    border-radius: 10px;
    transition: all 0.2s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => {
      if (props.selected && props.side === "right") return "#16a34a";
      if (props.selected && props.side === "left") return "#dc2626";
      return "#94a3b8";
    }};
  }

  &:active {
    transform: translateY(-2px);
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
