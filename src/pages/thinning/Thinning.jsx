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

/* eslint react/prop-types: 0 */

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getSetProgressScore = (state) => state.setProgressScore;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetIsThinningFinished = (state) => state.setIsThinningFinished;
const getIsLeftSideFinished = (state) => state.isLeftSideFinished;
const getIsRightSideFinished = (state) => state.isRightSideFinished;

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
  useEffect(() => {
    let startTime = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("thin");
      localStorage.setItem("currentPage", "thin");
      await setProgressScore(15);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTime, "thinningPage", "thinningPage");
    };
  }, [setCurrentPage, setProgressScore]);

  let assessedStatements = (cards || []).map((item) => {
    if (item.selected === true) {
      selectedStatementsNum = selectedStatementsNum + 1;
    }
    return (
      <Box
        onClick={handleClick}
        id={item.id}
        key={uuid()}
        side={displayControllerArray[0]?.side}
        color={item.color}
        selected={item.selected}
        data-targetcol={displayControllerArray[0]?.targetCol}
        data-max={displayControllerArray[0]?.maxNum}
        data-selected={item.selected}
        data-id={item.id}
      >
        {item.statement}
      </Box>
    );
  });

  if (showMain === true) {
    return (
      <>
        <PromptUnload />
        <ConfirmationModal />
        <ThinningPreventNavModal />
        <SortTitleBar background={configObj.headerBarColor}>{thinPageTitle}</SortTitleBar>
        <div>
          <ContainerDiv>
            <InstructionsDiv>
              <Instructions
                part1={instructionsRef.current.part1}
                part2={instructionsRef.current.part2}
                part3={instructionsRef.current.part3}
                maxNum={displayControllerArray[0]?.maxNum}
                selectedNum={selectedStatementsNum}
              />
              <ConfirmButton
                onClick={handleConfirm}
                disabled={selectedStatementsNum !== displayControllerArray[0]?.maxNum}
                fontColor={
                  selectedStatementsNum === displayControllerArray[0]?.maxNum ? "black" : "darkgray"
                }
                border={
                  selectedStatementsNum === displayControllerArray[0]?.maxNum ? "black" : "gray"
                }
                color={
                  selectedStatementsNum === displayControllerArray[0]?.maxNum
                    ? "#fca70893"
                    : "lightgray"
                }
              >
                {thinPageSubmitButton}
              </ConfirmButton>
            </InstructionsDiv>
            <BoxesDiv>{assessedStatements}</BoxesDiv>
          </ContainerDiv>
        </div>
      </>
    );
  } else {
    return (
      <>
        <PromptUnload />
        <ConfirmationModal />
        <ThinningPreventNavModal />
        <SortTitleBar background={configObj.headerBarColor}>{thinPageTitle}</SortTitleBar>
        <ContainerDiv>
          <FinalInstructions>{finalInstructions}</FinalInstructions>
        </ContainerDiv>
      </>
    );
  }
};

export default Thinning;

const SortTitleBar = styled.div`
  width: 100vw;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 50px;
  background-color: ${(props) => props.background};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 28px;
  position: fixed;
  top: 0;
`;

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vw;
  margin-bottom: 200px;
  padding-top: 30px;
  transition: 0.3s ease all;
  min-height: 80vh;

  img {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  iframe {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const BoxesDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1vw;
`;

const InstructionsDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 1vw;
  margin-top: 20px;
  margin-bottom: 0px;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  color: black;
  min-height: 200px;
`;

const FinalInstructions = styled.div`
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 50vw;
  justify-content: center;
  align-items: center;
  font-size: calc(14px + 1.5vw);
  text-align: center;
  color: black;
`;

const ConfirmButton = styled.button`
  display: flex;
  border: 2px solid white;
  background-color: ${(props) => {
    return props.color;
  }};
  color: ${(props) => {
    return props.fontColor;
  }};
  font-size: 1.6em;
  font-weight: normal;
  margin: 0 3px 0 3px;
  padding: 5px;
  height: 50px;
  min-width: 115px;
  border-radius: 10px;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:hover {
    border-color: ${(props) => {
      return props.border;
    }};
    color: ${(props) => {
      return props.border;
    }};
  }
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 170px;
  height: 150px;
  padding: 10px;
  overflow: hidden;
  margin: 10px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: ${(props) => {
    return props.selected && props.side === "right"
      ? "#ccffcc"
      : props.selected && props.side === "left"
      ? "#ffe0e0"
      : "white";
  }};

  color: black;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease all;

  &:hover {
    background-color: ${(props) => {
      return props.selected && props.side === "right"
        ? "#ccffcc"
        : props.selected && props.side === "left"
        ? "#ffe0e0"
        : "#FFEC8B";
    }};
  }
`;
