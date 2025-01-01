import { useEffect, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import useSettingsStore from "../../globalState/useSettingsStore";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import finishThinningSorts from "./finishThinningSorts";
// import Boxes from "./Boxes";
// import MobileInstructions from "./MobileInstructions";
// import moveSelectedNegCards from "./moveSelectedNegCards";
// import moveSelectedPosCards from "./moveSelectedPosCards";
// import uniq from "lodash/uniq";
import { v4 as uuid } from "uuid";
import useStore from "../../globalState/useStore";
import mobileCardColor from "../presort/mobileCardColor";
import DownArrows from "../../assets/downArrows.svg?react";
import UpArrows from "../../assets/upArrows.svg?react";
import SelectionNumberDisplay from "./SelectedNumberDisplay";
import useLocalStorage from "../../utilities/useLocalStorage";
import { useLongPress } from "@uidotdev/usehooks";
import MobileThinMoveTopModal from "./MobileThinMoveTopModal";
import mobileMoveSelectedPosCards from "./mobileMoveSelectedPosCards";
import mobileMoveSelectedNegCards from "./mobileMoveSelectedNegCards";
import HelpSymbol from "../../assets/helpSymbol.svg?react";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getShowConfirmButton = (state) => state.showConfirmButton;
const getSetShowConfirmButton = (state) => state.setShowConfirmButton;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getSetTriggerMobileThinMoveTopModal = (state) =>
  state.setTriggerMobileThinMoveTopModal;
const getMobileThinFontSize = (state) => state.mobileThinFontSize;
const getMobileThinViewSize = (state) => state.mobileThinViewSize;
const getColumnStatements = (state) => state.columnStatements;

const MobileThinning = () => {
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const showConfirmButton = useStore(getShowConfirmButton);
  // const setShowConfirmButton = useStore(getSetShowConfirmButton);
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const setTriggerMobileThinMoveTopModal = useStore(
    getSetTriggerMobileThinMoveTopModal
  );
  const mobileThinFontSize = useStore(getMobileThinFontSize);
  const mobileThinViewSize = useStore(getMobileThinViewSize);
  // const columnStatements = useStore(getColumnStatements);

  // *** REFS *** //
  let cardId = useRef({ id: "", statement: "", color: "", direction: "" });

  // *** SET TIME ON PAGE *** //
  useEffect(() => {
    let startTime = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("thin");
      localStorage.setItem("currentPage", "thin");
      await setProgressScore(20);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTime, "thinPage", "thinPage");
    };
  }, [setCurrentPage, setProgressScore]);

  // *************************** //
  // *** TEXT LOCALIZATION ***** //
  // *************************** //
  const conditionsOfInstruction =
    ReactHtmlParser(decodeHTML(langObj.mobileThinConditionsOfInstruction)) ||
    "";
  // let initialInstructionPart1 =
  //   ReactHtmlParser(decodeHTML(langObj.initialInstructionPart1)) || "";
  // let initialInstructionPart3 =
  //   ReactHtmlParser(decodeHTML(langObj.initialInstructionPart3)) || "";

  // *************************** //
  // *** USE LONG PRESS HOOK *** //
  // *************************** //
  const attrs = useLongPress(
    () => {
      // setIsOpen(true);
      setTriggerMobileThinMoveTopModal(true);
    },
    {
      onStart: (event) => {
        cardId.current = {
          id: event.target.dataset.id,
          statement: event.target.dataset.statement,
          color: event.target.dataset.color,
          direction: event.target.dataset.direction,
        };
      },
      // onFinish: (event) => {},
      // onCancel: (event) => console.log("Press cancelled"),
      threshold: 800,
    }
  );

  // *******************************************************
  // *** LOCAL STATE ***********************************
  // *******************************************************

  let [selectedNegItems, setSelectedNegItems] = useLocalStorage(
    "selectedNegItems",
    JSON.parse(localStorage.getItem("selectedNegItems"))
  );
  let [selectedPosItems, setSelectedPosItems] = useLocalStorage(
    "selectedPosItems",
    JSON.parse(localStorage.getItem("selectedPosItems"))
  );
  let [displayControllerArray, setDisplayControllerArray] = useLocalStorage(
    "thinDisplayControllerArray",
    JSON.parse(localStorage.getItem("thinDisplayControllerArray"))
  );

  // *******************************************************
  // *** Display ****************************************
  // *******************************************************
  let cards;
  let selectedStatementsNum = 0;
  if (displayControllerArray[0]?.side === "right") {
    cards = [...selectedPosItems];
  }
  if (displayControllerArray[0]?.side === "left") {
    cards = [...selectedNegItems];
  }
  if (displayControllerArray.length === 0) {
    cards = [];
    let newCols = JSON.parse(localStorage.getItem("newCols"));
    let finalSortColData = JSON.parse(localStorage.getItem("finalSortColData"));
    let completedCols = finishThinningSorts(newCols, finalSortColData);

    let colData = JSON.parse(localStorage.getItem("finalSortColData"));
    let reversedColData = colData.reverse();
    let m_FinalThinCols = [];
    reversedColData.forEach((item) => {
      let array = completedCols.vCols[item[0]];
      m_FinalThinCols.push(...array);
    });
    m_FinalThinCols.forEach((item) => {
      item.selected = false;
    });

    localStorage.setItem("m_FinalThinCols", JSON.stringify(m_FinalThinCols));
    localStorage.setItem("columnStatements", JSON.stringify(completedCols));
  }

  const persistedMobileThinViewSize = JSON.parse(
    localStorage.getItem("m_ViewSizeObject")
  ).thin;

  const persistedMobileThinFontSize = JSON.parse(
    localStorage.getItem("m_FontSizeObject")
  ).thin;

  // ********************************************************
  // *** EVENT HANDLING *************************************
  // ********************************************************
  const handleCardSelected = (e) => {
    let targetcol = e.target.getAttribute("data-targetcol");

    cards.forEach((item) => {
      if (item.id === e.target.dataset.id) {
        item.targetcol = targetcol;
        item.selected = !item.selected;
      }
      if (item.selected === true) {
        item.color = "lightyellow";
      } else {
        item.color = mobileCardColor(+item.psValue);
      }
    });
    if (displayControllerArray[0]?.side === "right") {
      setSelectedPosItems([...cards]);
    }
    if (displayControllerArray[0]?.side === "left") {
      setSelectedNegItems([...cards]);
    }
  };

  const handleOnClickUp = (e) => {
    console.log("clicked Up", e.target.id);

    let clickedItemIndex = cards.findIndex(
      (item) => item.id === e.target.dataset.id
    );
    // check if at start of array
    if (clickedItemIndex === 0) {
      return; // Element is already at the start
    }
    // if not at end, move down
    const temp = cards[clickedItemIndex];
    cards[clickedItemIndex] = cards[clickedItemIndex - 1];
    cards[clickedItemIndex - 1] = temp;
    if (displayControllerArray[0]?.side === "right") {
      setSelectedPosItems([...cards]);
    }
    if (displayControllerArray[0]?.side === "left") {
      setSelectedNegItems([...cards]);
    }
    return;
  };

  const handleOnClickDown = (e) => {
    console.log("clicked Down", e.target.id);

    let clickedItemIndex = cards.findIndex(
      (item) => item.id === e.target.dataset.id
    );
    // check if at end of array
    if (clickedItemIndex >= cards.length - 1) {
      return; // Element is already at the end
    }
    // if not at the beginning, move up
    const temp = cards[clickedItemIndex];
    cards[clickedItemIndex] = cards[clickedItemIndex + 1];
    cards[clickedItemIndex + 1] = temp;
    if (displayControllerArray[0]?.side === "right") {
      setSelectedPosItems([...cards]);
    }
    if (displayControllerArray[0]?.side === "left") {
      setSelectedNegItems([...cards]);
    }
    return;
  };

  const handleConfirm = () => {
    if (displayControllerArray[0]?.side === "right") {
      let currentSelectedPosItems = selectedPosItems.filter(
        (item) => item.selected === true
      );
      let nextSelectedPosItemsSet = selectedPosItems.filter(
        (item) => item.selected !== true
      );
      let newCols = JSON.parse(localStorage.getItem("newCols"));
      const newCols2 = mobileMoveSelectedPosCards(
        currentSelectedPosItems,
        newCols
      );

      localStorage.setItem("newCols", JSON.stringify(newCols2));
      displayControllerArray.shift();
      setDisplayControllerArray([...displayControllerArray]);
      setSelectedPosItems([...nextSelectedPosItemsSet]);
      return;
    }
    if (displayControllerArray[0]?.side === "left") {
      let currentSelectedNegItems = selectedNegItems.filter(
        (item) => item.selected === true
      );
      let nextSelectedNegItemsSet = selectedNegItems.filter(
        (item) => item.selected !== true
      );
      let newCols = JSON.parse(localStorage.getItem("newCols"));
      const newCols2 = mobileMoveSelectedNegCards(
        currentSelectedNegItems,
        newCols
      );

      localStorage.setItem("newCols", JSON.stringify(newCols2));
      displayControllerArray.shift();
      setDisplayControllerArray([...displayControllerArray]);
      setSelectedNegItems([...nextSelectedNegItemsSet]);
      return;
    }
  };

  const handleMove = () => {
    let selectedCard;
    let index = cards.findIndex((item) => item.id === cardId.current.id);
    if (index > 0 && cardId.current.direction === "up") {
      selectedCard = cards.splice(index, 1);
      cards.unshift(selectedCard[0]);
      if (displayControllerArray[0]?.side === "right") {
        setSelectedPosItems([...cards]);
      }
      if (displayControllerArray[0]?.side === "left") {
        setSelectedNegItems([...cards]);
      }
    } else if (
      index < cards.length - 1 &&
      cardId.current.direction === "down"
    ) {
      selectedCard = cards.splice(index, 1);
      cards.push(selectedCard[0]);
      if (displayControllerArray[0]?.side === "right") {
        setSelectedPosItems([...cards]);
      }
      if (displayControllerArray[0]?.side === "left") {
        setSelectedNegItems([...cards]);
      }
    } else if (cardId.current.direction === "allTop") {
      // iterate through the cards array and move the selected card to the top
      cards.forEach((item, i) => {
        if (item.selected === true) {
          let selectedCards = cards.splice(i, 1);
          cards.unshift(selectedCards[0]);
        }
        if (displayControllerArray[0]?.side === "right") {
          setSelectedPosItems([...cards]);
        }
        if (displayControllerArray[0]?.side === "left") {
          setSelectedNegItems([...cards]);
        }
      });
    }
    setTriggerMobileThinMoveTopModal(false);
  };

  // *******************************************************
  // *** Elements ****************************************
  // *******************************************************

  let assessedStatements = cards.map((item) => {
    if (item.selected === true) {
      selectedStatementsNum++;
    }
    return (
      <ItemContainer key={uuid()}>
        <DownArrowContainer
          data-id={item.id}
          data-statement={item.statement}
          data-color={item.color}
          data-direction="down"
          onClick={handleOnClickDown}
          {...attrs}
        >
          <DownArrows style={{ pointerEvents: "none" }} />
        </DownArrowContainer>
        <InternalDiv
          onClick={handleCardSelected}
          id={item.id}
          key={uuid()}
          color={item.color}
          fontSize={
            mobileThinFontSize === +persistedMobileThinFontSize
              ? mobileThinFontSize
              : persistedMobileThinFontSize
          }
          data-targetcol={displayControllerArray[0]?.targetCol}
          data-max={displayControllerArray[0]?.maxNum}
          data-selected={item.selected}
          data-id={item.id}
          data-direction="allTop"
          {...attrs}
        >
          {item.statement}
        </InternalDiv>
        <UpArrowContainer
          data-id={item.id}
          data-statement={item.statement}
          data-color={item.color}
          data-direction="up"
          onClick={handleOnClickUp}
          {...attrs}
        >
          <UpArrows style={{ pointerEvents: "none" }} />
        </UpArrowContainer>
      </ItemContainer>
    );
  });

  return (
    <MainContainer>
      <MobileThinMoveTopModal cardId={cardId} onClick={handleMove} />
      <SortTitleBar background={configObj.headerBarColor}>
        {conditionsOfInstruction}
        <HelpContainer onClick={() => alert("Help")}>
          <HelpSymbol />
        </HelpContainer>
      </SortTitleBar>
      <HeadersContainer>
        <SelectionNumberDisplay
          selected={selectedStatementsNum}
          required={displayControllerArray[0]?.maxNum}
        />
        {showConfirmButton && (
          <ConfirmButton
            onClick={handleConfirm}
            color={
              selectedStatementsNum === displayControllerArray[0]?.maxNum
                ? "#BCF0DA"
                : "#d3d3d3"
            }
          >
            Submit
          </ConfirmButton>
        )}
      </HeadersContainer>
      <StatementsContainer
        viewSize={
          mobileThinViewSize === +persistedMobileThinViewSize
            ? mobileThinViewSize
            : persistedMobileThinViewSize
        }
      >
        {assessedStatements}
      </StatementsContainer>
    </MainContainer>
  );
};

export default MobileThinning;

const StatementsContainer = styled.div`
  display: flex;
  align-self: top;
  justify-self: center;
  margin-top: 10px;
  flex-direction: row;
  flex-wrap: wrap;

  background-color: #e5e5e5;
  width: 96vw;
  height: ${(props) => `${props.viewSize}vh`};
  /* font-size: 1.1vh; */
  align-items: center;
  gap: 15px;
  user-select: none;

  justify-content: center;
  border-radius: 3px;
  text-align: center;
  overflow-x: none;
  overflow-y: auto;
  padding-bottom: 10px;
  padding-top: 10px;
  border-radius: 5px;
  border: 1px solid darkgray;
`;

const SortTitleBar = styled.div`
  display: flex;
  width: 100vw;
  padding-left: 10px;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 30px;
  background-color: ${(props) => props.background};
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 4.5vw;
  user-select: none;
`;

// const InstructionsDiv = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   padding: 2vw;
//   font-size: 3.2vw;
//   font-weight: normal;
//   text-align: center;
//   color: black;
//   /* border: 2px solid red; */
// `;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  gap: 5px;
  align-items: center;
  width: 100vw;
  height: 90vh;
  /* outline: 2px solid red; */
`;

const ConfirmButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => {
    return props.color;
  }};
  color: black;
  font-size: 1.2em;
  font-weight: normal;
  padding: 0.25em 0.5em;
  /* padding-bottom: ${(props) => props.padBottom}; */
  height: 30px;
  min-width: 115px;
  text-decoration: none;
  border: 1px solid "gray" !important;
  border-radius: 3px;
  user-select: none;
`;

const InternalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  width: 66vw;
  min-height: 8vh;
  font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }};
  text-align: center;
  outline: 1px solid black;
  padding: 5px;
`;

const UpArrowContainer = styled.button`
  display: flex;
  width: 10vw;
  background-color: #d3d3d3;
  outline: 1px solid black;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vh;
  border: 0px;
  cursor: pointer;
`;

const DownArrowContainer = styled.button`
  width: 10vw;
  background-color: #d3d3d3;
  outline: 1px solid black;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vh;
  border: 0px;
  cursor: pointer;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 10vh;
  flex-direction: row;
`;

const HeadersContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 300px;
  height: 50px;
  gap: 55px;
  /* outline: 1px solid black; */
`;

const HelpContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 5px;
  align-items: center;
  padding-bottom: 5px;
  width: 20px;
  height: 20px;
  color: black;
  font-size: 2.5vh;
  font-weight: bold;
  user-select: none;
`;
