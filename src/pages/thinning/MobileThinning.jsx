import { useEffect, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import useSettingsStore from "../../globalState/useSettingsStore";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import finishThinningSorts from "./finishThinningSorts";
import Boxes from "./Boxes";
import MobileInstructions from "./MobileInstructions";
import moveSelectedNegCards from "./moveSelectedNegCards";
import moveSelectedPosCards from "./moveSelectedPosCards";
import uniq from "lodash/uniq";
import { v4 as uuid } from "uuid";
import useStore from "../../globalState/useStore";
import mobileCardColor from "../presort/mobileCardColor";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getTargetArray = (state) => state.targetArray;
const getSetTargetArray = (state) => state.setTargetArray;
const getIsTargetArrayFilled = (state) => state.isTargetArrayFilled;
const getSetIsTargetArrayFilled = (state) => state.setIsTargetArrayFilled;
const getShowConfirmButton = (state) => state.showConfirmButton;
const getSetShowConfirmButton = (state) => state.setShowConfirmButton;

const MobileThinning = () => {
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const setTargetArray = useStore(getSetTargetArray);
  let targetArray = useStore(getTargetArray);
  const isTargetArrayFilled = useStore(getIsTargetArrayFilled);
  const setIsTargetArrayFilled = useStore(getSetIsTargetArrayFilled);
  const showConfirmButton = useStore(getShowConfirmButton);
  const setShowConfirmButton = useStore(getSetShowConfirmButton);

  // Get language object values
  let initialInstructionPart1 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPart1)) || "";
  let initialInstructionPart3 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPart3)) || "";
  let agreeLeastText =
    ReactHtmlParser(decodeHTML(langObj.agreeLeastText)) || "";
  let finalInstructionText =
    ReactHtmlParser(decodeHTML(langObj.finalInstructions)) || "";
  let agreeMostText = ReactHtmlParser(decodeHTML(langObj.agreeMostText)) || "";

  let mobilePresortResults = JSON.parse(
    localStorage.getItem("mobilePresortResults")
  );

  let selectedPosItems = [
    ...JSON.parse(localStorage.getItem("selectedPosItems")),
  ];

  let sortRightArrays = [
    ...JSON.parse(localStorage.getItem("sortRightArrays")),
  ];
  console.log(sortRightArrays);

  let colInfo = sortRightArrays?.[0];

  let [instructionText, setInstructionText] = useState({
    part1: "",
    part2: "",
    part3: "",
    agreeLeastText: "",
    agree: true,
    maxNum: 0,
  });

  // *******************************************************
  // *** LOCAL STATE ***********************************
  // *******************************************************
  let [cards, setCards] = useState(selectedPosItems);
  console.log("cards", cards[0]);

  const handleOnClick = (e) => {
    let colMax = +e.target.getAttribute("data-max");
    let targetcol = e.target.getAttribute("data-targetcol");
    console.log(e.target.getAttribute("data-selected"));

    if (e.target.getAttribute("data-selected") === "true") {
      console.log("selected");
      let index = targetArray.indexOf(e.target.id);
      if (index > -1) {
        targetArray.splice(index, 1);
      }
      if (targetArray.length === colMax) {
        setIsTargetArrayFilled(true);
      } else {
        setIsTargetArrayFilled(false);
      }
    } else {
      targetArray.push(e.target.id);
      if (targetArray.length > colMax) {
        targetArray.shift();
      }
      targetArray = uniq(targetArray);
      if (targetArray.length === colMax) {
        setIsTargetArrayFilled(true);
      } else {
        setIsTargetArrayFilled(false);
      }
      console.log("targetArray", targetArray);

      console.log(e.target.id);
    }
    cards.forEach((item) => {
      if (targetArray.includes(item.id)) {
        item.targetcol = targetcol;
        item.selected = true;
        item.color = "orange";
      } else {
        item.selected = false;
        item.color = mobileCardColor(+item.psValue);
      }
    });
    setCards([...cards]);
  };

  // *******************************************************
  // *** HANDLE CONFIRM BUTTON CLICK ***********************
  // *******************************************************
  const handleConfirm = () => {
    console.log("handleConfirm");
  };

  // *******************************************************
  // *** USE EFFECT ****************************************
  // *******************************************************

  useEffect(() => {
    setInstructionText({
      part1: initialInstructionPart1,
      part2: "",
      part3: initialInstructionPart3,
      agreeLeastText: "",
      agree: true,
      maxNum: colInfo?.[1],
    });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let assessedStatements = cards.map((item) => {
    return (
      <InternalDiv
        onClick={handleOnClick}
        id={item.id}
        key={uuid()}
        color={item.color}
        data-targetcol={colInfo?.[0]}
        data-max={colInfo?.[1]}
        data-selected={item.selected}
      >
        {item.statement}
      </InternalDiv>
    );
  });

  return (
    <MainContainer>
      <SortTitleBar background={configObj.headerBarColor}>
        Refine Your Preferences
      </SortTitleBar>
      <InstructionsDiv>
        <MobileInstructions
          part1={instructionText.part1}
          part2={instructionText.part2}
          part3={instructionText.part3}
          agreeLeastText={instructionText.agreeLeastText}
          agree={instructionText.agree}
          maxNum={instructionText.maxNum}
        />
      </InstructionsDiv>
      {showConfirmButton && (
        <ConfirmButton onClick={handleConfirm} color={isTargetArrayFilled}>
          Submit
        </ConfirmButton>
      )}
      <StatementsContainer>{assessedStatements}</StatementsContainer>
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
  height: 52vh;
  /* font-size: 1.1vh; */
  align-items: center;
  gap: 15px;

  justify-content: center;
  border-radius: 3px;
  text-align: center;
  overflow-x: none;
  overflow-y: auto;
  padding-bottom: 10px;
  padding-top: 10px;
  border-radius: 5px;
  border: 2px solid black;
`;

const InternalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  width: 80vw;
  height: 12vh;
  font-size: 2vh;
  border-radius: 3px;
  text-align: center;
  outline: 1px solid black;
  padding: 5px;
  -webkit-transition: background-color 1000ms linear;
  -moz-transition: background-color 1000ms linear;
  -o-transition: background-color 1000ms linear;
  -ms-transition: background-color 1000ms linear;
  transition: all 1000ms linear;
`;

const SortTitleBar = styled.div`
  width: 100vw;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 30px;
  background-color: ${(props) => props.background};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 4.5vw;
`;

const InstructionsDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2vw;
  font-size: 3.2vw;
  font-weight: normal;
  text-align: center;
  color: black;
  /* border: 2px solid red; */
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  gap: 5px;
  align-items: center;
  width: 100vw;
  height: 90vh;
  outline: 2px solid red;
`;

const ConfirmButton = styled.button`
  background-color: ${(props) => (props.color ? "orange" : "#d3d3d3")};
  border-color: #2e6da4;
  color: black;
  font-size: 1.2em;
  font-weight: normal;
  padding: 0.25em 0.5em;
  /* padding-bottom: ${(props) => props.padBottom}; */
  height: 30px;
  min-width: 115px;
  border-radius: 3px;
  text-decoration: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;
