import { useEffect, useRef, useState } from "react";
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
// import createColumnData from "./createColumnData";
// import setMaxIterations from "./setMaxIterations";
// import createRightLeftArrays from "./createRightLeftArrays";
import Boxes from "./Boxes";
import Instructions from "./Instructions";
import moveSelectedNegCards from "./moveSelectedNegCards";
import moveSelectedPosCards from "./moveSelectedPosCards";
import uniq from "lodash/uniq";

/* eslint react/prop-types: 0 */

const getLangObj = (state) => state.langObj;
// const getMapObj = (state) => state.mapObj; // not used
const getConfigObj = (state) => state.configObj;
const getSetProgressScore = (state) => state.setProgressScore;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
// const getSetThinningSide = (state) => state.setThinningSide;
// const getThinningSide = (state) => state.thinningSide;
const getShowConfirmButton = (state) => state.showConfirmButton;
const getSetShowConfirmButton = (state) => state.setShowConfirmButton;
const getSetPreviousColInfo = (state) => state.setPreviousColInfo;
const getSetIsThinningFinished = (state) => state.setIsThinningFinished;
const getIsLeftSideFinished = (state) => state.isLeftSideFinished;
const getIsRightSideFinished = (state) => state.isRightSideFinished;
const getSetIsLeftSideFinished = (state) => state.setIsLeftSideFinished;
const getSetIsRightSideFinished = (state) => state.setIsRightSideFinished;
const getSetCurrentSelectMaxValue = (state) => state.setCurrentSelectMaxValue;
const getTargetArray = (state) => state.targetArray;
const getSetTargetArray = (state) => state.setTargetArray;
const getIsTargetArrayFilled = (state) => state.isTargetArrayFilled;
const getSetIsTargetArrayFilled = (state) => state.setIsTargetArrayFilled;

const Thinning = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  // const mapObj = useSettingsStore(getMapObj);
  const setProgressScore = useStore(getSetProgressScore);
  const setCurrentPage = useStore(getSetCurrentPage);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  // const setThinningSide = useStore(getSetThinningSide);
  // const thinningSide = useStore(getThinningSide);
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
  const isTargetArrayFilled = useStore(getIsTargetArrayFilled);
  const setIsTargetArrayFilled = useStore(getSetIsTargetArrayFilled);

  // Get language object values
  let initialInstructionPart1 = ReactHtmlParser(decodeHTML(langObj.initialInstructionPart1)) || "";
  let initialInstructionPart3 = ReactHtmlParser(decodeHTML(langObj.initialInstructionPart3)) || "";
  let agreeLeastText = ReactHtmlParser(decodeHTML(langObj.agreeLeastText)) || "";
  let finalInstructionText = ReactHtmlParser(decodeHTML(langObj.finalInstructions)) || "";
  let agreeMostText = ReactHtmlParser(decodeHTML(langObj.agreeMostText)) || "";

  let showFinish = false;

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
  let finalSortColData = JSON.parse(localStorage.getItem("finalSortColData"));

  // *******************************
  // **** INITIALIZE *******************************************
  // *******************************
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      let sortRightArrays = JSON.parse(localStorage.getItem("sortRightArrays"));
      let sortLeftArrays = JSON.parse(localStorage.getItem("sortLeftArrays"));
      let isNotReload = localStorage.getItem("isNotReload");
      let showLeftInitial = false;
      let showRightInitial = false;

      let thinningSide = localStorage.getItem("thinningSide");

      let colInfoLeft = sortLeftArrays?.[0];
      let colInfo = sortRightArrays?.[0];

      setPreviousColInfo(colInfo);

      let posSorted = JSON.parse(localStorage.getItem("posSorted"));
      let negSorted = JSON.parse(localStorage.getItem("negSorted"));

      // first load
      if (isNotReload === "true") {
        if (posSorted.length > +colInfo?.[1]) {
          showRightInitial = true;
        }
        if (negSorted.length > +colInfoLeft?.[1]) {
          showLeftInitial = true;
        }
      }

      if (isNotReload === "false") {
        if (thinningSide === "rightSide") {
          showRightInitial = true;
        }
        if (thinningSide === "leftSide") {
          showLeftInitial = true;
        }
      }

      if (+posSorted.length <= +colInfo?.[1] && +negSorted.length <= +colInfoLeft?.[1]) {
        // if insufficient cards on BOTH left and right, go directly to finish screen
        setShowConfirmButton(false);
        setInstructionObjEnd((instructions) => ({
          ...instructions,
          setDisplay: "right",
          instructionsText: <FinalInstructions>{finalInstructionText}</FinalInstructions>,
        }));
        let newCols = JSON.parse(localStorage.getItem("newCols"));
        let completedCols = finishThinningSorts(newCols, finalSortColData);
        localStorage.setItem("columnStatements", JSON.stringify(completedCols));
        setIsThinningFinished(true);
        setShowMain(false);
        setShowEnd(true);
        // showFinish = true;
        initialized.current = true;
        return () => {};
      }

      if (showRightInitial === true) {
        // initialize with right side
        console.log("right side initialized");
        localStorage.setItem("thinningSide", "rightSide");
        setBoxProps({
          side: "rightSide",
          array: posSorted,
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
        if (+negSorted.length <= +colInfoLeft?.[1] && isNotReload === "true") {
          setTargetArray([]);
          sortRightArrays.shift();
          localStorage.setItem("sortRightArrays", JSON.stringify(sortRightArrays));
        }
        localStorage.setItem("isNotReload", "false");
        initialized.current = true;
        return () => {};
      }

      if (showLeftInitial === true) {
        // initialize with left side
        setIsRightSideFinished(true);
        localStorage.setItem("thinningSide", "leftSide");
        console.log("left side initialized");
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
        console.log("isNotReload", isNotReload);
        if (isNotReload === "true") {
          setTargetArray([]);
          sortLeftArrays.shift();
          localStorage.setItem("sortLeftArrays", JSON.stringify(sortLeftArrays));
        }
        localStorage.setItem("isNotReload", "false");
        initialized.current = true;
        return () => {};
      }
    }
  }, [
    initialized,
    setIsRightSideFinished,
    setIsLeftSideFinished,
    agreeLeastText,
    initialInstructionPart1,
    initialInstructionPart3,
    // columnData,
    setPreviousColInfo,
    setCurrentSelectMaxValue,
    setTargetArray,
    finalInstructionText,
    setInstructionObjEnd,
    setBoxProps,
    setInstructionText,
    showConfirmButton,
    setIsThinningFinished,
    setShowMain,
    setShowEnd,
    setDisplayNextButton,
    setShowConfirmButton,
    finalSortColData,
  ]);

  // todo *** HANDLE BOX CLICK ***
  const handleClick = (e) => {
    if (e.target.id === "") {
      return;
    }

    let posSorted = JSON.parse(localStorage.getItem("posSorted"));
    let negSorted = JSON.parse(localStorage.getItem("negSorted"));
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
      localStorage.setItem("negSorted", JSON.stringify(negSorted));
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
      localStorage.setItem("posSorted", JSON.stringify(posSorted));
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
    let currentRightIteration = +localStorage.getItem("currentRightIteration");
    let currentLeftIteration = +localStorage.getItem("currentLeftIteration");
    let posSorted = JSON.parse(localStorage.getItem("posSorted"));
    let negSorted = JSON.parse(localStorage.getItem("negSorted"));
    console.log("left, right", currentLeftIteration, currentRightIteration);
    let thinningSide = localStorage.getItem("thinningSide");

    let colInfoRight = [];
    let colInfoLeft = [];
    let showOnlyRight = false;
    let showOnlyLeft = false;
    let isRightDone = false;
    let isLeftDone = false;

    if (isTargetArrayFilled === false) {
      alert("Please select the correct number of items");
      return;
    }

    // *** filter out selected POSITIVEitems
    let selectedPosItems = posSorted.filter((item) => item.selectedPos === true);

    // nextPosSet is posSorted without the selected items
    let nextPosSet = posSorted.filter((item) => item.selected === false);
    localStorage.setItem("posSorted", JSON.stringify(nextPosSet));

    // *** filter out selected NEGATIVE items
    let selectedNegItems = negSorted.filter((item) => item.selected === true);

    // nextNegSet is negSorted without the selected items
    let nextNegSet = negSorted.filter((item) => item.selected === false);
    localStorage.setItem("negSorted", JSON.stringify(nextNegSet));

    // *************************
    //  *** MOVE SELECTED  CARDS to newCols ******************************************************
    // *************************

    // move selected items to target column
    moveSelectedPosCards(selectedPosItems);
    moveSelectedNegCards(selectedNegItems);
    setTargetArray([]);

    // *************************
    // *** GET COLUMN DATA LEFT **************************************************
    //**************************
    let sortLeftArrays = JSON.parse(localStorage.getItem("sortLeftArrays"));
    let sortRightArrays = JSON.parse(localStorage.getItem("sortRightArrays"));

    colInfoLeft = sortLeftArrays?.[0];
    let nextColInfoLeft = sortLeftArrays?.[1];
    if (colInfoLeft === undefined || nextNegSet.length <= colInfoLeft?.[1]) {
      setIsLeftSideFinished(true);
      isLeftDone = true;
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

    // get appropriate column data
    colInfoRight = sortRightArrays?.[0];
    let nextColInfoRight = sortRightArrays?.[1];
    console.log("colInfoRight", colInfoRight);
    console.log("nextColInfoRight", nextColInfoRight);

    // check for finished side
    if (colInfoRight === undefined || nextPosSet.length <= colInfoRight?.[1]) {
      setIsRightSideFinished(true);
      isRightDone = true;
    }

    if (colInfoRight === undefined || posSorted.length === 0) {
      setIsRightSideFinished(true);
      isRightDone = true;
    }

    if (negSorted.length === 0) {
      setIsLeftSideFinished(true);
      isLeftDone = true;
    }

    if (isRightSideFinished === true) {
      isRightDone = true;
    }

    // *************************
    //  *** DISPLAY FINISH  ******************************************************
    // *************************

    console.log("finished", isRightSideFinished, isLeftSideFinished);
    if (isRightDone === true && isLeftDone === true) {
      console.log("both sides finished - is left done");
      setShowConfirmButton(false);
      // setTiles(null);
      setBoxProps({});
      setInstructionObjEnd((instructions) => ({
        ...instructions,
        setDisplay: "right",
        instructionsText: <FinalInstructions>{finalInstructionText}</FinalInstructions>,
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
      console.log("both sides finished - nextColInfoRight");
      setShowConfirmButton(false);
      // setTiles(null);
      setBoxProps({});
      setInstructionObjEnd((instructions) => ({
        ...instructions,
        setDisplay: "left",
        instructionsText: <FinalInstructions>{finalInstructionText}</FinalInstructions>,
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
        localStorage.setItem("thinningSide", "rightSide");
      } else {
        localStorage.setItem("thinningSide", "leftSide");
      }
    }

    if (thinningSide === "leftSide") {
      if (isRightSideFinished === true) {
        localStorage.setItem("thinningSide", "leftSide");
      } else {
        localStorage.setItem("thinningSide", "rightSide");
      }
    }
    // *************************
    // *** INSUFFICIENT ITEMS DISPLAY *****************************************
    // *************************

    if (showFinish === true) {
      console.log("show finish is true");
      return;
    }

    // Display 1
    if (isRightSideFinished === true || isRightDone === true) {
      showOnlyLeft = true;
      console.log("display 1 - right finished, show left");
      console.log("col info left", colInfoLeft);
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
      // localStorage.setItem("currentLeftIteration", currentLeftIteration + 1);
      sortLeftArrays.shift();
      localStorage.setItem("sortLeftArrays", JSON.stringify(sortLeftArrays));
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
      sortRightArrays.shift();
      localStorage.setItem("sortRightArrays", JSON.stringify(sortRightArrays));
      return;
    }

    console.log("isNotReload", localStorage.getItem("isNotReload"));

    // *************************
    //*** NORMAL DISPLAY **************************************************
    // *************************

    if (showOnlyLeft === true || showOnlyRight === true) {
      return;
    }

    // Display 3
    if (
      (nextNegSet.length >= nextColInfoLeft?.[1] && thinningSide === "rightSide") ||
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
      // localStorage.setItem("currentLeftIteration", currentLeftIteration + 1);
      sortRightArrays.shift();
      localStorage.setItem("sortRightArrays", JSON.stringify(sortRightArrays));
      localStorage.setItem("thinningSide", "leftSide");
      return;
    }

    // Display 4
    if (isRightSideFinished === false && thinningSide === "leftSide") {
      if (isLeftSideFinished === true) {
        return;
      }

      console.log("display 4 - normal right");
      console.log("currentRightIteration", currentRightIteration);
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
      // localStorage.setItem("currentRightIteration", currentRightIteration + 1);
      sortLeftArrays.shift();
      localStorage.setItem("sortLeftArrays", JSON.stringify(sortLeftArrays));
      localStorage.setItem("thinningSide", "rightSide");
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

  return (
    <>
      {showMain && (
        <div>
          <PromptUnload />
          <ConfirmationModal />
          <ThinningPreventNavModal />
          <SortTitleBar background={configObj.headerBarColor}>Refine Your Preferences</SortTitleBar>
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
              {showConfirmButton && <ConfirmButton onClick={handleConfirm}>Submit</ConfirmButton>}
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
          <SortTitleBar background={configObj.headerBarColor}>Refine Your Preferences</SortTitleBar>
          <ContainerDiv>
            <InstructionsDiv>{instructionObjEnd.instructionsText}</InstructionsDiv>
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
