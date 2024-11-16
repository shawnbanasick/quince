import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PromptUnload from "../../utilities/PromptUnload";
import remove from "lodash/remove";
import convertNumberToText from "./convertNumberToText";
import finishThinningSorts from "./finishThinningSorts";
import ConfirmationModal from "./ConfirmationModal";
import ThinningPreventNavModal from "./ThinningPreventNavModal";
import CreateLeftSide from "./CreateLeftSide";
import CreateRightSide from "./CreateRightSide";
import createColumnData from "./createColumnData";
import setMaxIterations from "./setMaxIterations";
import displayDebugStateNums from "./displayDebugStateNums";
import { max } from "lodash";
import createRightLeftArrays from "./createRightLeftArrays";
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
const getCurrentSelectMaxValue = (state) => state.currentSelectMaxValue;
const getSetCurrentSelectMaxValue = (state) => state.setCurrentSelectMaxValue;
// const getPosSorted = (state) => state.posSorted;
// const getNegSorted = (state) => state.negSorted;
// const getSetPosSorted = (state) => state.setPosSorted;
// const getSetNegSorted = (state) => state.setNegSorted;
// const getInstructionObj = (state) => state.instructionObj;
// const getSetInstructionObj = (state) => state.setInstructionObj;
const getTargetArray = (state) => state.targetArray;
const getSetTargetArray = (state) => state.setTargetArray;
const getIsThinningFinished = (state) => state.isThinningFinished;
const getSetIsRightBelowThreshold = (state) => state.setIsRightBelowThreshold;
const getSetIsLeftBelowThreshold = (state) => state.setIsLeftBelowThreshold;
const getIsRightBelowThreshold = (state) => state.isRightBelowThreshold;
const getIsLeftBelowThreshold = (state) => state.isLeftBelowThreshold;
const getCurrentRightIteration = (state) => state.currentRightIteration;
const getCurrentLeftIteration = (state) => state.currentLeftIteration;
const getSetCurrentRightIteration = (state) => state.setCurrentRightIteration;
const getSetCurrentLeftIteration = (state) => state.setCurrentLeftIteration;

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
  const isThinningFinished = useStore(getIsThinningFinished);
  const isLeftSideFinished = useStore(getIsLeftSideFinished);
  const isRightSideFinished = useStore(getIsRightSideFinished);
  const setIsLeftSideFinished = useStore(getSetIsLeftSideFinished);
  const setIsRightSideFinished = useStore(getSetIsRightSideFinished);
  const currentSelectMaxValue = useStore(getCurrentSelectMaxValue);
  const setCurrentSelectMaxValue = useStore(getSetCurrentSelectMaxValue);
  const setTargetArray = useStore(getSetTargetArray);
  let targetArray = useStore(getTargetArray);
  const isRightBelowThreshold = useStore(getIsRightBelowThreshold);
  const isLeftBelowThreshold = useStore(getIsLeftBelowThreshold);
  const setIsRightBelowThreshold = useStore(getSetIsRightBelowThreshold);
  const setIsLeftBelowThreshold = useStore(getSetIsLeftBelowThreshold);
  const currentRightIteration = useStore(getCurrentRightIteration);
  const currentLeftIteration = useStore(getCurrentLeftIteration);
  const setCurrentRightIteration = useStore(getSetCurrentRightIteration);
  const setCurrentLeftIteration = useStore(getSetCurrentLeftIteration);
  // const posSorted = useStore(getPosSorted);
  // const negSorted = useStore(getNegSorted);
  // const setPosSorted = useStore(getSetPosSorted);
  // const setNegSorted = useStore(getSetNegSorted);
  // const instructionObj = useStore(getInstructionObj);

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

  let boxes;

  // console.log(isRightSideFinished);
  // console.log(isLeftSideFinished);

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
  // const confirmButtonRef = useRef(null);

  let finalSortColData = createColumnData(headers, qSortPattern);
  // console.log(JSON.stringify(finalSortColData));

  let rightLeftArrays = createRightLeftArrays(
    [...finalSortColData],
    maxIterations
  );

  let sortRightArrays = [...rightLeftArrays[1]];
  let sortLeftArrays = [...rightLeftArrays[0]];

  // get presort column statements from local storage
  let presortColumnStatements = JSON.parse(
    localStorage.getItem("columnStatements")
  );
  // clear any previous selections
  let posSorted2 = [];
  let negSorted2 = [];
  let sortingList = [];
  if (presortColumnStatements !== null) {
    sortingList = [...presortColumnStatements.statementList];
    sortingList.forEach((item) => {
      item.selected = false;
      item.selectedPos = false;
      item.selectedNeg = false;
      return item;
    });
    // filter out green and pink checked items
    posSorted2 = sortingList.filter((item) => item.sortValue === 111);
    negSorted2 = sortingList.filter((item) => item.sortValue === 333);
    // console.log(JSON.stringify(negSorted2, null, 2));
  }

  // **** Local State Variables ****
  let [posSorted, setPosSorted] = useState(posSorted2);
  let [negSorted, setNegSorted] = useState(negSorted2);
  let [instructionObjRight, setInstructionObjRight] = useState({
    rightNumText: "",
    columnData: [],
    setDisplay: "right",
    qSortPattern: [...mapObj.qSortPattern],
  });
  let [instructionObjLeft, setInstructionObjLeft] = useState({
    leftNumText: "",
    columnData: [],
    setDisplay: "right",
    qSortPattern: [...mapObj.qSortPattern],
  });

  // ** INITIALIZE INSTRUCTIONS AND BOXES **
  let rightNum;
  let columnData = useMemo(
    () => createColumnData(headers, qSortPattern),
    [headers, qSortPattern]
  );

  // console.log(("columnData", columnData));

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      let colInfo = columnData[columnData.length - (currentRightIteration + 1)];
      setPreviousColInfo(colInfo);
      setCurrentSelectMaxValue(rightNum);
      localStorage.setItem("newCols", JSON.stringify(presortColumnStatements));
      setInstructionObjRight({
        qSortPattern: [...instructionObjRight.qSortPattern],
        side: thinningSide,
        columnData: [...columnData],
        setDisplay: "right",
        instructionsText: (
          <Instructions>
            {initialInstructionPart1}
            {initialInstructionPart3} <br />
            <br />
            <MostAgreeText>
              {`Number of Statements to Select: ${colInfo[1]}`}{" "}
            </MostAgreeText>
          </Instructions>
        ),
        boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
      });
      initialized.current = true;
    }
  }, [
    initialized,
    headers,
    qSortPattern,
    thinningSide,
    boxes,
    posSorted,
    instructionObjRight,
    initialInstructionPart1,
    initialInstructionPart3,
    rightNum,
    presortColumnStatements,
    columnData,
    currentRightIteration,
    setPreviousColInfo,
    setCurrentSelectMaxValue,
  ]);

  // todo *** HANDLE BOX CLICK ***
  const handleClick = useCallback(
    (e) => {
      // console.log("e.target.side: ", e.target.dataset.side);
      if (e.target.id === "") {
        return;
      }

      // determine max number that can be selected
      let colMax = +e.target.dataset.max || 0;
      let targetcol = e.target.dataset.targetcol;
      // console.log("colMax: ", colMax);

      // Add selected item to targetArray
      targetArray.push(e.target.id);

      // drop first item if array length exceeds max
      if (targetArray.length > colMax) {
        targetArray.shift();
      }
      // console.log(JSON.stringify(targetArray));

      // Redraw page with selected items highlighted
      if (e.target.dataset.side === "leftSide") {
        console.log("leftSide branch selected item");
        negSorted.forEach((item) => {
          if (targetArray.includes(item.id)) {
            // item.selectedLeft = true;
            item.selectedNeg = true;
            item.selected = true;
            item.targetcol = targetcol;
          } else {
            item.selectedNeg = false;
            item.selected = false;
          }
        });
        setInstructionObjLeft((instructionObj) => ({
          ...instructionObj,
          setDisplay: "left",
          boxes: boxes([...negSorted], "leftSide", colMax, targetcol),
        }));
        setNegSorted([...negSorted]);
      }

      // Redraw page with selected items highlighted
      if (e.target.dataset.side === "rightSide") {
        // console.log("rightSide branch selected item");
        posSorted.forEach((item) => {
          if (targetArray.includes(item.id)) {
            // item.selectedRight = true;
            item.selectedPos = true;
            item.targetcol = targetcol;
            item.selected = true;
          } else {
            item.selectedPos = false;
            item.selected = false;
          }
        });
        setInstructionObjRight((instructionObj) => ({
          ...instructionObj,
          setDisplay: "right",
          boxes: boxes([...posSorted], "rightSide", colMax, targetcol),
        }));
        setPosSorted([...posSorted]);
      }
    },
    [boxes, posSorted, negSorted, targetArray]
  );

  // HELPER - create divs of posSorted items statements to add to dom
  boxes = useCallback(
    (array, side, colMax, targetcol) => {
      console.log("boxes created");
      const cards = array.map((item) => {
        return (
          <Box
            key={item.id}
            id={item.id}
            selected={item.selected}
            selectedPos={item.selectedPos}
            selectedNeg={item.selectedNeg}
            data-side={side}
            data-max={colMax}
            data-targetcol={targetcol}
            side={side}
            onClick={handleClick}
          >
            {item.statement}
          </Box>
        );
      });
      return cards;
    },
    [handleClick]
  );

  // **********************************************************************
  // *** ON CONFIRM BUTTON CLICK ******************************************
  // **********************************************************************
  const handleConfirm = () => {
    let colInfoRight = [];
    let colInfoLeft = [];
    let leftNum = 0;
    let rightNum = 0;

    console.log("cycle Thinning side: ", thinningSide);

    // *** FLIP THINNING SIDE ***********************************************
    if (thinningSide === "rightSide") {
      setThinningSide("leftSide");
      localStorage.setItem("thinningSide", "leftSide");
    }
    if (thinningSide === "leftSide") {
      setThinningSide("rightSide");
      localStorage.setItem("thinningSide", "rightSide");
    }

    // *** pull COLUMN data from local storage
    let newCols = JSON.parse(localStorage.getItem("newCols"));
    // *** filter out selected POSITIVEitems
    let selectedPosItems = posSorted.filter(
      (item) => item.selectedPos === true
    );
    let nextPosSet = posSorted.filter((item) => item.selectedPos === false);
    // *** filter out selected NEGATIVE items
    let selectedNegItems = negSorted.filter(
      (item) => item.selectedNeg === true
    );
    let nextNegSet = negSorted.filter((item) => item.selectedNeg === false);

    // *************************
    // *** GET COLUMN DATA LEFT **************************************************
    //**************************
    colInfoLeft = sortLeftArrays?.[currentLeftIteration];
    let nextColInfoLeft = sortLeftArrays?.[currentLeftIteration + 1];
    if (colInfoLeft === undefined) {
      setIsLeftSideFinished(true);
      console.log("left side finished");
    }
    console.log("current left: ", colInfoLeft);
    leftNum = colInfoLeft?.[1];

    // *************************
    // *** GET COLUMN DATA RIGHT **************************************************
    // *************************
    colInfoRight = sortRightArrays?.[currentRightIteration];
    let nextColInfoRight = sortRightArrays?.[currentRightIteration + 1];
    if (colInfoRight === undefined) {
      setIsRightSideFinished(true);
      console.log("right side finished");
    }
    rightNum = colInfoRight?.[1];

    // *************************
    // *** INCREMENT ITERATION COUNTERS **************************************
    // *************************
    if (thinningSide === "rightSide") {
      setCurrentRightIteration(currentRightIteration + 1);
    }
    if (thinningSide === "leftSide") {
      setCurrentLeftIteration(currentLeftIteration + 1);
    }

    // *************************
    //  *** DISPLAY END  ******************************************************
    // *************************
    if (colInfoRight === undefined && nextColInfoLeft === undefined) {
      console.log("both sides finished");
      setShowConfirmButton(false);
      setInstructionObjRight((instructions) => ({
        ...instructions,
        setDisplay: "right",
        instructionsText: (
          <FinalInstructions>{finalInstructionText}</FinalInstructions>
        ),
        boxes: null,
      }));
      let completedCols = finishThinningSorts(newCols, finalSortColData);
      localStorage.setItem("columnStatements", JSON.stringify(completedCols));
      setIsThinningFinished(true);
    }
    if (colInfoLeft === undefined && nextColInfoRight === undefined) {
      console.log("both sides finished");
      setShowConfirmButton(false);
      setInstructionObjLeft((instructions) => ({
        ...instructions,
        setDisplay: "left",
        instructionsText: (
          <FinalInstructions>{finalInstructionText}</FinalInstructions>
        ),
        boxes: null,
      }));
      let completedCols = finishThinningSorts(newCols, finalSortColData);
      localStorage.setItem("columnStatements", JSON.stringify(completedCols));
      setIsThinningFinished(true);
    }

    // *************************
    //  *** MOVE POS CARDS  ******************************************************
    // *************************
    setPosSorted([...nextPosSet]);
    // move selected items to target column
    selectedPosItems.forEach((obj) => {
      let objId = obj.id;
      let targetcol = obj.targetcol;
      newCols.statementList.forEach((item) => {
        console.log("targetcol: ", targetcol);
        if (item.id === objId) {
          newCols.vCols[targetcol].push(item);
          remove(newCols.statementList, (n) => n.id === objId);
        }
      });
    });
    setTargetArray([]);
    localStorage.setItem("newCols", JSON.stringify(newCols));

    // *************************
    //  *** MOVE NEG CARDS  ******************************************************
    // *************************
    setNegSorted([...nextNegSet]);
    // move selected items to target column
    console.log("selectedNegItems: ", selectedNegItems);
    selectedNegItems.forEach((obj) => {
      let objId = obj.id;
      let targetcol = obj.targetcol;
      newCols.statementList.forEach((item) => {
        if (item.id === objId) {
          newCols.vCols[targetcol].push(item);
          remove(newCols.statementList, (n) => n.id === objId);
        }
      });
    });
    let displayObject = displayDebugStateNums(newCols);
    console.log("debug newCols", JSON.stringify(displayObject));
    // clear targetArray and set state
    setTargetArray([]);
    localStorage.setItem("newCols", JSON.stringify(newCols));

    // *************************
    // *** CHECK SUFFICIENT ITEMS *****************************************
    // *************************
    console.log(nextPosSet.length, nextColInfoLeft?.[1]);
    console.log(nextNegSet.length, nextColInfoRight?.[1]);
    // Display 1
    if (nextPosSet.length <= nextColInfoRight?.[1]) {
      // console.log("display 1 - right finished, show left");
      // setIsRightSideFinished(true);
      // setInstructionObjLeft((instructions) => ({
      //   ...instructions,
      //   side: "leftSide",
      //   setDisplay: "left",
      //   instructionsText: CreateLeftSide(leftNum, agreeLeastText),
      //   boxes: boxes(
      //     [...negSorted],
      //     "leftSide",
      //     colInfoLeft[1],
      //     colInfoLeft[0]
      //   ),
      // }));
    }

    // Display 2
    if (nextNegSet.length <= nextColInfoLeft?.[1]) {
      // console.log("display 2 - left finished, show right");
      // setIsLeftSideFinished(true);
      // setInstructionObjRight((instructions) => ({
      //   ...instructions,
      //   side: "rightSide",
      //   setDisplay: "right",
      //   instructionsText: CreateRightSide(rightNum, agreeMostText),
      //   boxes: boxes(
      //     [...posSorted],
      //     "rightSide",
      //     colInfoRight[1],
      //     colInfoRight[0]
      //   ),
      // }));
    }

    // *************************
    //*** NORMAL DISPLAY **************************************************
    // *************************
    // Display 3
    if (colInfoLeft !== undefined) {
      console.log("display 3 - normal left");
      setInstructionObjLeft((instructions) => ({
        ...instructions,
        side: "leftSide",
        setDisplay: "left",
        instructionsText: CreateLeftSide(leftNum, agreeLeastText),
        boxes: boxes(
          [...negSorted],
          "leftSide",
          colInfoLeft[1],
          colInfoLeft[0]
        ),
      }));
    }

    // Display 4
    if (colInfoRight !== undefined) {
      console.log("display 4 - normal right");
      setInstructionObjRight((instructions) => ({
        ...instructions,
        setDisplay: "right",
        side: "rightSide",
        columnData: [...instructionObjRight.columnData],
        instructionsText: CreateRightSide(rightNum, agreeMostText),
        boxes: boxes(
          [...posSorted],
          "rightSide",
          colInfoRight[1],
          colInfoRight[0]
        ),
      }));
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

  let thinningSideDisplay = localStorage.getItem("thinningSideDisplay");
  console.log("thinning side display: ", thinningSideDisplay);

  if (thinningSide === "rightSide") {
    return (
      <div>
        <PromptUnload />
        <ConfirmationModal />
        <ThinningPreventNavModal />
        <SortTitleBar background={configObj.headerBarColor}>
          Refine Your Preferences
        </SortTitleBar>
        <ContainerDiv>
          <InstructionsDiv>
            {instructionObjRight.instructionsText}
            {showConfirmButton && (
              <ConfirmButton onClick={handleConfirm}>Submit</ConfirmButton>
            )}
          </InstructionsDiv>
          <BoxesDiv>{instructionObjRight.boxes}</BoxesDiv>
        </ContainerDiv>
      </div>
    );
  }
  if (thinningSide === "leftSide") {
    return (
      <div>
        <PromptUnload />
        <ConfirmationModal />
        <ThinningPreventNavModal />
        <SortTitleBar background={configObj.headerBarColor}>
          Refine Your Preferences
        </SortTitleBar>
        <ContainerDiv>
          <InstructionsDiv>
            {instructionObjLeft.instructionsText}
            {showConfirmButton && (
              <ConfirmButton onClick={handleConfirm}>Submit</ConfirmButton>
            )}
          </InstructionsDiv>
          <BoxesDiv>{instructionObjLeft.boxes}</BoxesDiv>
        </ContainerDiv>
      </div>
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
  /* border: 2px solid red; */
`;

const Instructions = styled.div`
  font-size: 2.2vw;
  font-weight: normal;
  text-align: center;
  color: black;
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
