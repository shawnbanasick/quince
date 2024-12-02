import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
import createColumnData from "./createColumnData";
import setMaxIterations from "./setMaxIterations";
// import displayDebugStateNums from "./displayDebugStateNums";
import createRightLeftArrays from "./createRightLeftArrays";
import Boxes from "./Boxes";
import Instructions from "./Instructions";
import moveSelectedNegCards from "./moveSelectedNegCards";
import moveSelectedPosCards from "./moveSelectedPosCards";
import uniq from "lodash/uniq";

/* eslint react/prop-types: 0 */

const getLangObj = (state) => state.langObj;
const getMapObj = (state) => state.mapObj;
const getConfigObj = (state) => state.configObj;
const getSetProgressScore = (state) => state.setProgressScore;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetThinningSide = (state) => state.setThinningSide;
const getThinningSide = (state) => state.thinningSide;
const getShowConfirmButton = (state) => state.showConfirmButton;
const getSetShowConfirmButton = (state) => state.setShowConfirmButton;
const getSetPreviousColInfo = (state) => state.setPreviousColInfo;
const getSetIsThinningFinished = (state) => state.setIsThinningFinished;
const getIsLeftSideFinished = (state) => state.isLeftSideFinished;
const getIsRightSideFinished = (state) => state.isRightSideFinished;
const getSetIsLeftSideFinished = (state) => state.setIsLeftSideFinished;
const getSetIsRightSideFinished = (state) => state.setIsRightSideFinished;
const getSetCurrentSelectMaxValue = (state) => state.setCurrentSelectMaxValue;
const getPosSorted = (state) => state.posSorted;
const getNegSorted = (state) => state.negSorted;
const getSetPosSorted = (state) => state.setPosSorted;
const getSetNegSorted = (state) => state.setNegSorted;
const getTargetArray = (state) => state.targetArray;
const getSetTargetArray = (state) => state.setTargetArray;
const getCurrentRightIteration = (state) => state.currentRightIteration;
const getCurrentLeftIteration = (state) => state.currentLeftIteration;
const getSetCurrentRightIteration = (state) => state.setCurrentRightIteration;
const getSetCurrentLeftIteration = (state) => state.setCurrentLeftIteration;
const getIsTargetArrayFilled = (state) => state.isTargetArrayFilled;
const getSetIsTargetArrayFilled = (state) => state.setIsTargetArrayFilled;

const Thinning = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const mapObj = useSettingsStore(getMapObj);
  const setProgressScore = useStore(getSetProgressScore);
  const setCurrentPage = useStore(getSetCurrentPage);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  const setThinningSide = useStore(getSetThinningSide);
  const thinningSide = useStore(getThinningSide);
  const showConfirmButton = useStore(getShowConfirmButton);
  const setShowConfirmButton = useStore(getSetShowConfirmButton);
  const setPreviousColInfo = useStore(getSetPreviousColInfo);
  const setIsThinningFinished = useStore(getSetIsThinningFinished);
  const isLeftSideFinished = useStore(getIsLeftSideFinished);
  const isRightSideFinished = useStore(getIsRightSideFinished);
  const setIsLeftSideFinished = useStore(getSetIsLeftSideFinished);
  const setIsRightSideFinished = useStore(getSetIsRightSideFinished);
  const setCurrentSelectMaxValue = useStore(getSetCurrentSelectMaxValue);
  const setTargetArray = useStore(getSetTargetArray);
  let targetArray = useStore(getTargetArray);
  const currentRightIteration = useStore(getCurrentRightIteration);
  const currentLeftIteration = useStore(getCurrentLeftIteration);
  const setCurrentRightIteration = useStore(getSetCurrentRightIteration);
  const setCurrentLeftIteration = useStore(getSetCurrentLeftIteration);
  const posSorted = useStore(getPosSorted);
  const negSorted = useStore(getNegSorted);
  const setPosSorted = useStore(getSetPosSorted);
  const setNegSorted = useStore(getSetNegSorted);
  const isTargetArrayFilled = useStore(getIsTargetArrayFilled);
  const setIsTargetArrayFilled = useStore(getSetIsTargetArrayFilled);

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

  const headers = useMemo(
    () => [...mapObj.qSortHeaders],
    [mapObj.qSortHeaders]
  );
  const qSortPattern = useMemo(
    () => [...mapObj.qSortPattern],
    [mapObj.qSortPattern]
  );
  const maxIterations = setMaxIterations(qSortPattern);

  // **** USE REFS ***** //

  let finalSortColData = createColumnData(headers, qSortPattern);

  let rightLeftArrays = createRightLeftArrays(
    [...finalSortColData],
    maxIterations
  );

  let sortRightArrays = [...rightLeftArrays[1]];
  let sortLeftArrays = [...rightLeftArrays[0]];
  let showFinish = false;

  console.log("posSorted", posSorted.length);
  console.log("negSorted", negSorted.length);

  // *******************************
  // **** Local State Variables *******************************************
  // *******************************
  let [instructionObjEnd, setInstructionObjEnd] = useState({});
  let [showMain, setShowMain] = useState(true);
  let [showEnd, setShowEnd] = useState(false);
  // let [tiles, setTiles] = useState([]);
  let [boxProps, setBoxProps] = useState({
    array: [],
    side: "",
    colMax: 0,
    targetcol: "",
  });
  let [instructionText, setInstructionText] = useState({
    part1: "",
    part2: "",
    part3: "",
    agreeLeastText: "",
    agree: true,
    maxNum: 0,
  });

  // ** INITIALIZE INSTRUCTIONS AND BOXES **
  let columnData = useMemo(
    () => createColumnData(headers, qSortPattern),
    [headers, qSortPattern]
  );

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      let colInfo =
        columnData?.[columnData.length - (currentRightIteration + 1)];
      console.log("test11", colInfo[0]);
      setPreviousColInfo(colInfo);
      // setCurrentSelectMaxValue(rightNum);
      let posSortedLocal = JSON.parse(localStorage.getItem("posSortedLocal"));
      console.log("posSortedLocal", posSortedLocal.length);
      let negSortedLocal = JSON.parse(localStorage.getItem("negSortedLocal"));
      setPosSorted([...posSortedLocal]);
      setNegSorted([...negSortedLocal]);

      if (posSortedLocal.length === 0 && negSortedLocal.length === 0) {
        // go directly to finish screen
        setShowConfirmButton(false);
        setInstructionObjEnd((instructions) => ({
          ...instructions,
          setDisplay: "right",
          instructionsText: (
            <FinalInstructions>{finalInstructionText}</FinalInstructions>
          ),
        }));
        let newCols = JSON.parse(localStorage.getItem("newCols"));
        let completedCols = finishThinningSorts(newCols, finalSortColData);
        localStorage.setItem("columnStatements", JSON.stringify(completedCols));
        setIsThinningFinished(true);
        setShowMain(false);
        setShowEnd(true);
        showFinish = true;
      } else if (posSortedLocal.length > 0) {
        // initialize with right side
        setBoxProps({
          side: "rightSide",
          array: posSortedLocal,
          colMax: colInfo?.[1],
          targetcol: colInfo?.[0],
        });
        setInstructionText({
          part1: initialInstructionPart1,
          part2: "",
          part3: initialInstructionPart3,
          agreeLeastText: "",
          agree: true,
          maxNum: colInfo?.[1],
        });
      } else {
        // initialize with left side
        let colInfo = columnData?.[0];
        setThinningSide("leftSide");
        setIsRightSideFinished(true);
        setBoxProps({
          side: "leftSide",
          array: negSortedLocal,
          colMax: colInfo?.[1],
          targetcol: colInfo?.[0],
        });
        setInstructionText({
          part1: "",
          part2: "",
          part3: "",
          agreeLeastText: agreeLeastText,
          agree: false,
          maxNum: colInfo?.[1],
        });
      }
      initialized.current = true;
    }
  }, [
    initialized,
    setNegSorted,
    setPosSorted,
    headers,
    qSortPattern,
    setIsRightSideFinished,
    setIsLeftSideFinished,
    thinningSide,
    setThinningSide,
    agreeLeastText,
    posSorted,
    initialInstructionPart1,
    initialInstructionPart3,
    columnData,
    currentRightIteration,
    setPreviousColInfo,
    setCurrentSelectMaxValue,
  ]);

  // todo *** HANDLE BOX CLICK ***
  const handleClick = (e) => {
    console.log("e.target: ", e.target.dataset);
    console.log("thinningSide", thinningSide);

    if (e.target.id === "") {
      return;
    }

    // determine max number that can be selected
    let colMax = +e.target.dataset.max || 0;
    let targetcol = e.target.dataset.targetcol;
    // Add selected item to targetArray
    targetArray.push(e.target.id);

    // drop first item if User selected array length exceeds max
    if (targetArray.length > colMax) {
      targetArray.shift();
    }

    targetArray = uniq(targetArray);

    // alert if targetArray not filled
    if (targetArray.length === colMax) {
      setIsTargetArrayFilled(true);
    } else {
      setIsTargetArrayFilled(false);
    }

    // Redraw page with selected items highlighted
    if (e.target.dataset.side === "leftSide") {
      console.log("onclick leftSide branch selected item");
      negSorted.forEach((item) => {
        if (targetArray.includes(item.id)) {
          item.selectedNeg = true;
          item.targetcol = targetcol;
          item.selected = true;
        } else {
          item.selectedNeg = false;
          item.selected = false;
        }
      });
      setNegSorted([...negSorted]);
      setBoxProps({
        side: "leftSide",
        array: negSorted,
        colMax: colMax,
        targetcol: targetcol,
      });
    }

    // Redraw page with selected items highlighted
    if (e.target.dataset.side === "rightSide") {
      console.log("onclick rightSide branch selected item");
      posSorted.forEach((item) => {
        if (targetArray.includes(item.id)) {
          item.selectedPos = true;
          item.targetcol = targetcol;
          item.selected = true;
        } else {
          item.selectedPos = false;
          item.selected = false;
        }
      });
      setPosSorted([...posSorted]);
      setBoxProps({
        side: "rightSide",
        array: posSorted,
        colMax: colMax,
        targetcol: targetcol,
      });
    }
  };

  // **********************************************************************
  // *** ON CONFIRM BUTTON CLICK ******************************************
  // **********************************************************************
  const handleConfirm = () => {
    let colInfoRight = [];
    let colInfoLeft = [];
    let showOnlyRight = false;
    let showOnlyLeft = false;
    let isRightDone = false;
    let isLeftDone = false;
    let isRightUnderMax = false;
    let isLeftUnderMax = false;

    if (isTargetArrayFilled === false) {
      alert("Please select the correct number of items");
      return;
    }

    console.log("posSorted", posSorted.length);
    console.log("negSorted", negSorted.length);

    // *** filter out selected POSITIVEitems
    let selectedPosItems = posSorted.filter(
      (item) => item.selectedPos === true
    );

    // nextPosSet is posSorted without the selected items
    let nextPosSet = posSorted.filter((item) => item.selected === false);
    setPosSorted([...nextPosSet]);

    // *** filter out selected NEGATIVE items
    let selectedNegItems = negSorted.filter((item) => item.selected === true);

    // nextNegSet is negSorted without the selected items
    let nextNegSet = negSorted.filter((item) => item.selected === false);
    setNegSorted([...nextNegSet]);

    // *************************
    //  *** MOVE SELECTED  CARDS to newCols ******************************************************
    // *************************

    console.log("selectedPosItems", JSON.stringify(selectedPosItems, null, 2));
    console.log("selectedNegItems", JSON.stringify(selectedNegItems, null, 2));

    // move selected items to target column
    moveSelectedPosCards(selectedPosItems);
    moveSelectedNegCards(selectedNegItems);
    setTargetArray([]);

    // let displayObject2 = displayDebugStateNums(newCols);
    // console.log("debug newCols", JSON.stringify(displayObject2));

    // *************************
    // *** GET COLUMN DATA LEFT **************************************************
    //**************************
    colInfoLeft = sortLeftArrays?.[currentLeftIteration];
    let nextColInfoLeft = sortLeftArrays?.[currentLeftIteration + 1];
    if (colInfoLeft === undefined || nextNegSet.length <= colInfoLeft?.[1]) {
      setIsLeftSideFinished(true);
      isLeftUnderMax = true;
    }
    if (isRightSideFinished === true) {
      colInfoLeft = nextColInfoLeft;
    }

    if (colInfoLeft === undefined) {
      setIsLeftSideFinished(true);
      isLeftDone = true;
    }

    if (negSorted.length === 0) {
      setIsLeftSideFinished(true);
      isLeftDone = true;
    }

    if (isLeftSideFinished === true) {
      isLeftDone = true;
    }

    // *************************
    // *** GET COLUMN DATA RIGHT **************************************************
    // *************************
    colInfoRight = sortRightArrays?.[currentRightIteration];
    let nextColInfoRight = sortRightArrays?.[currentRightIteration + 1];
    if (colInfoRight === undefined || nextPosSet.length <= colInfoRight?.[1]) {
      setIsRightSideFinished(true);
      isRightUnderMax = true;
    }
    if (isLeftSideFinished === true) {
      colInfoRight = nextColInfoRight;
    }

    if (colInfoRight === undefined || posSorted.length === 0) {
      setIsRightSideFinished(true);
      isRightDone = true;
    }

    if (isRightUnderMax === true) {
      isRightDone = true;
    }
    if (isLeftUnderMax === true) {
      isLeftDone = true;
    }

    if (negSorted.length === 0) {
      setIsLeftSideFinished(true);
      isLeftDone = true;
      console.log("current negSorted is 0");
    }

    if (isRightSideFinished === true) {
      isRightDone = true;
    }

    console.log("current left: ", colInfoLeft);
    console.log("current right: ", colInfoRight);
    console.log(
      "current",
      isRightSideFinished,
      posSorted.length,
      isRightDone,
      isLeftSideFinished,
      negSorted.length,
      isLeftDone
    );

    // console.log(("posSorted debug", JSON.stringify(posSorted, null, 2)));

    // *************************
    // *** INCREMENT ITERATION COUNTERS **************************************
    // *************************
    if (thinningSide === "rightSide" || isLeftSideFinished === true) {
      console.log("iterated right");
      setCurrentRightIteration(currentRightIteration + 1);
    }
    if (thinningSide === "leftSide" || isRightSideFinished === true) {
      console.log("iterated left");
      setCurrentLeftIteration(currentLeftIteration + 1);
    }

    // *************************
    //  *** DISPLAY FINISH  ******************************************************
    // *************************

    console.log("finished", isRightSideFinished, isLeftSideFinished);
    if (isRightDone === true && isLeftDone === true) {
      console.log("both sides finished");
      setShowConfirmButton(false);
      // setTiles(null);
      setBoxProps({});
      setInstructionObjEnd((instructions) => ({
        ...instructions,
        setDisplay: "right",
        instructionsText: (
          <FinalInstructions>{finalInstructionText}</FinalInstructions>
        ),
      }));
      let newCols = JSON.parse(localStorage.getItem("newCols"));
      let completedCols = finishThinningSorts(newCols, finalSortColData);
      localStorage.setItem("columnStatements", JSON.stringify(completedCols));
      setIsThinningFinished(true);
      setShowMain(false);
      setShowEnd(true);
      showFinish = true;
      return;
    }
    if (colInfoLeft === undefined && nextColInfoRight === undefined) {
      console.log("both sides finished");
      setShowConfirmButton(false);
      // setTiles(null);
      setBoxProps({});
      setInstructionObjEnd((instructions) => ({
        ...instructions,
        setDisplay: "left",
        instructionsText: (
          <FinalInstructions>{finalInstructionText}</FinalInstructions>
        ),
      }));
      let newCols = JSON.parse(localStorage.getItem("newCols"));
      let completedCols = finishThinningSorts(newCols, finalSortColData);
      localStorage.setItem("columnStatements", JSON.stringify(completedCols));
      setIsThinningFinished(true);
      setShowMain(false);
      setShowEnd(true);
      showFinish = true;
      return;
    }

    // *** FLIP THINNING SIDE ***********************************************
    if (thinningSide === "rightSide") {
      if (isLeftSideFinished === true) {
        setThinningSide("rightSide");
        localStorage.setItem("thinningSide", "rightSide");
      } else {
        setThinningSide("leftSide");
        localStorage.setItem("thinningSide", "leftSide");
      }
    }

    if (thinningSide === "leftSide") {
      if (isRightSideFinished === true) {
        setThinningSide("leftSide");
        localStorage.setItem("thinningSide", "leftSide");
      } else {
        setThinningSide("rightSide");
        localStorage.setItem("thinningSide", "rightSide");
      }
    }
    console.log("Thinning side after flip: ", thinningSide);

    // *************************
    // *** INSUFFICIENT ITEMS DISPLAY *****************************************
    // *************************

    //
    if (showFinish === true) {
      console.log("show finish is true");
      return;
    }

    console.log("finished", isRightSideFinished, isLeftSideFinished);

    // Display 1
    if (isRightSideFinished === true || isRightDone === true) {
      showOnlyLeft = true;
      console.log("display 1 - right finished, show left");
      setIsRightSideFinished(true);
      setBoxProps({
        side: "leftSide",
        array: [...nextNegSet],
        colMax: colInfoLeft?.[1],
        targetcol: colInfoLeft?.[0],
      });
      setInstructionText({
        part1: "",
        part2: "",
        part3: "",
        agreeLeastText: agreeLeastText,
        agree: false,
        maxNum: colInfoLeft?.[1],
      });
      setTargetArray([]);
      setCurrentLeftIteration(currentLeftIteration + 1);
      return;
    }

    // Display 2
    if (isLeftSideFinished === true || isLeftDone === true) {
      console.log("display", colInfoRight, nextPosSet.length);
      showOnlyRight = true;
      // console.log("debug posSorted", JSON.stringify(posSorted, null, 2));
      console.log("display 2 - left finished, show right");
      setIsLeftSideFinished(true);
      setBoxProps({
        side: "rightSide",
        array: [...nextPosSet],
        colMax: colInfoRight?.[1],
        targetcol: colInfoRight?.[0],
      });
      setInstructionText({
        part1: agreeMostText,
        part2: "",
        part3: "",
        agreeLeastText: "",
        agree: true,
        maxNum: colInfoRight[1],
      });
      setTargetArray([]);
      setCurrentRightIteration(currentRightIteration + 1);
      return;
    }

    // *************************
    //*** NORMAL DISPLAY **************************************************
    // *************************

    if (showOnlyLeft === true || showOnlyRight === true) {
      return;
    }

    // Display 3
    if (
      (nextNegSet.length >= nextColInfoLeft?.[1] &&
        thinningSide === "rightSide") ||
      (nextColInfoLeft === undefined && thinningSide === "rightSide")
    ) {
      if (isLeftSideFinished === true) {
        return;
      }
      console.log("display 3 - normal left");
      setBoxProps({
        side: "leftSide",
        array: negSorted,
        colMax: colInfoLeft?.[1],
        targetcol: colInfoLeft?.[0],
      });
      setInstructionText({
        part1: "",
        part2: "",
        part3: "",
        agreeLeastText: agreeLeastText,
        agree: false,
        maxNum: colInfoLeft?.[1],
      });
      return;
    }

    // Display 4
    if (isRightSideFinished === false && thinningSide === "leftSide") {
      if (isLeftSideFinished === true) {
        return;
      }
      console.log("display 4 - normal right");
      setBoxProps({
        side: "rightSide",
        array: posSorted,
        colMax: colInfoRight?.[1],
        targetcol: colInfoRight?.[0],
      });
      setInstructionText({
        part1: agreeMostText,
        part2: "",
        part3: "",
        agreeLeastText: "",
        agree: true,
        maxNum: colInfoRight?.[1],
      });
      return;
    }
  };

  setDisplayNextButton(true);

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

  console.log("show end: ", showEnd);

  return (
    <>
      {showMain && (
        <div>
          <PromptUnload />
          <ConfirmationModal />
          <ThinningPreventNavModal />
          <SortTitleBar background={configObj.headerBarColor}>
            Refine Your Preferences
          </SortTitleBar>
          <ContainerDiv>
            <InstructionsDiv>
              <Instructions
                part1={instructionText.part1}
                part2={instructionText.part2}
                part3={instructionText.part3}
                agreeLeastText={instructionText.agreeLeastText}
                agree={instructionText.agree}
                maxNum={instructionText.maxNum}
              />
              {showConfirmButton && (
                <ConfirmButton onClick={handleConfirm}>Submit</ConfirmButton>
              )}
            </InstructionsDiv>
            <BoxesDiv>
              <Boxes
                side={boxProps.side}
                array={boxProps.array}
                colMax={boxProps.colMax}
                targetcol={boxProps.targetcol}
                handleClick={handleClick}
              />
            </BoxesDiv>
          </ContainerDiv>
        </div>
      )}

      {showEnd && (
        <div>
          <PromptUnload />
          <SortTitleBar background={configObj.headerBarColor}>
            Refine Your Preferences
          </SortTitleBar>
          <ContainerDiv>
            <InstructionsDiv>
              {instructionObjEnd.instructionsText}
            </InstructionsDiv>
          </ContainerDiv>
        </div>
      )}
    </>
  );
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
  /* border: 2px solid red; */
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
  background-color: ${(props) =>
    props.selectedPos && props.side === "rightSide"
      ? "#ccffcc"
      : props.selectedNeg && props.side === "leftSide"
      ? "#ffe0e0"
      : "white"};

  color: black;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease all;

  &:hover {
    background-color: ${(props) =>
      props.side === "rightSide" ? "#ccffcc" : "#ffe0e0"};
  }
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
  /* border: 2px solid red; */
`;

// const Instructions = styled.div`
//   font-size: 2.2vw;
//   font-weight: normal;
//   text-align: center;
//   color: black;
// `;

const FinalInstructions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2.2vw;
  min-height: 80vh;
  font-weight: normal;
  text-align: center;
  color: black;
`;

const MostAgreeText = styled.span`
  background-color: #ccffcc;
  padding: 2px;
  font-style: italic;
`;

const ConfirmButton = styled.button`
  background: #e6b44e;
  border-color: #2e6da4;
  color: black;
  font-size: 1.4em;
  font-weight: normal;
  margin: 0 3px 0 3px;
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

  &:hover {
    background: orange;
  }
`;
