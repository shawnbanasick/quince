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
const getPosSorted = (state) => state.posSorted;
const getNegSorted = (state) => state.negSorted;
const getSetPosSorted = (state) => state.setPosSorted;
const getSetNegSorted = (state) => state.setNegSorted;
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
  const posSorted = useStore(getPosSorted);
  const negSorted = useStore(getNegSorted);
  const setPosSorted = useStore(getSetPosSorted);
  const setNegSorted = useStore(getSetNegSorted);
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

  console.log("posSorted", posSorted.length);
  console.log("negSorted", negSorted.length);

  // *******************************
  // **** Local State Variables *******************************************
  // *******************************
  // let [posSorted, setPosSorted] = useState(posSorted2);
  // let [negSorted, setNegSorted] = useState(negSorted2);
  let [instructionObjRight, setInstructionObjRight] = useState({
    rightNumText: "",
    columnData: [],
    count: 0,
    setDisplay: "right",
    qSortPattern: [...mapObj.qSortPattern],
  });
  let [instructionObjLeft, setInstructionObjLeft] = useState({
    leftNumText: "",
    columnData: [],
    count: 0,
    setDisplay: "right",
    qSortPattern: [...mapObj.qSortPattern],
  });
  let [instructionObjEnd, setInstructionObjEnd] = useState({});
  let [showRight, setShowRight] = useState(true);
  let [showLeft, setShowLeft] = useState(false);
  let [showEnd, setShowEnd] = useState(false);
  let [tiles, setTiles] = useState([]);

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
      let posSortedLocal = JSON.parse(localStorage.getItem("posSortedLocal"));
      setTiles(boxes([...posSortedLocal], "rightSide", colInfo[1], colInfo[0]));
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
        // boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
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
    // presortColumnStatements,
    columnData,
    currentRightIteration,
    setPreviousColInfo,
    setCurrentSelectMaxValue,
  ]);

  console.log("pos out", posSorted.length);

  // todo *** HANDLE BOX CLICK ***
  const handleClick = (e) => {
    console.log("pos in", posSorted.length);
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
      console.log("onclick leftSide branch selected item");
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
      setNegSorted([...negSorted]);
      setTiles(boxes([...negSorted], "leftSide", colMax, targetcol));
      setInstructionObjLeft((instructionObj) => ({
        ...instructionObj,
        setDisplay: "left",
        // boxes: boxes([...negSorted], "leftSide", colMax, targetcol),
      }));
    }

    // Redraw page with selected items highlighted
    if (e.target.dataset.side === "rightSide") {
      console.log("onclick rightSide branch selected item");
      // console.log("focus right Target side");
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
      setPosSorted([...posSorted]);
      console.log("onclick posSorted", JSON.stringify(posSorted, null, 2));
      setInstructionObjRight((instructionObj) => ({
        ...instructionObj,
        setDisplay: "right",
        // boxes: boxes([...posSorted], "rightSide", colMax, targetcol),
      }));
      setTiles(boxes([...posSorted], "rightSide", colMax, targetcol));
    }
  };

  // HELPER - create divs of posSorted items statements to add to dom
  boxes = (array, side, colMax, targetcol) => {
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
  };

  // **********************************************************************
  // *** ON CONFIRM BUTTON CLICK ******************************************
  // **********************************************************************
  const handleConfirm = () => {
    let colInfoRight = [];
    let colInfoLeft = [];
    let leftNum = 0;
    let rightNum = 0;
    let showFinish = false;
    let showOnlyRight = false;
    let showOnlyLeft = false;

    console.log("Thinning side before flip: ", thinningSide);
    // *** FLIP THINNING SIDE ***********************************************
    if (thinningSide === "rightSide") {
      setThinningSide("leftSide");
      localStorage.setItem("thinningSide", "leftSide");
    }
    if (thinningSide === "leftSide") {
      setThinningSide("rightSide");
      localStorage.setItem("thinningSide", "rightSide");
    }
    console.log("Thinning side after flip: ", thinningSide);

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
    //  *** MOVE POS CARDS  ******************************************************
    // *************************
    setPosSorted([...nextPosSet]);

    // let sortsToDisplayPos = [...nextPosSet];
    // move selected items to target column
    selectedPosItems.forEach((obj) => {
      let objId = obj.id;
      let targetcol = obj.targetcol;
      newCols.statementList.forEach((item) => {
        // console.log("targetcol: ", targetcol);
        if (item.id === objId) {
          newCols.vCols[targetcol].push(item);
          remove(newCols.statementList, (n) => n.id === objId);
        }
      });
    });
    setTargetArray([]);
    localStorage.setItem("newCols", JSON.stringify(newCols));
    let displayObject2 = displayDebugStateNums(newCols);
    console.log("debug newCols", JSON.stringify(displayObject2));

    // *************************
    //  *** MOVE NEG CARDS  ******************************************************
    // *************************
    setNegSorted([...nextNegSet]);
    // let sortsToDisplayNeg = [...nextNegSet];
    // move selected items to target column
    // console.log("selectedNegItems: ", selectedNegItems);
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
    // clear targetArray and set state
    setTargetArray([]);
    localStorage.setItem("newCols", JSON.stringify(newCols));
    let displayObject3 = displayDebugStateNums(newCols);
    console.log("debug newCols", JSON.stringify(displayObject3));

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
    console.log("current right: ", colInfoRight);
    rightNum = colInfoRight?.[1];

    // *************************
    // *** branch testing **************************************************
    // *************************
    console.log("branch next posSet", nextPosSet);
    console.log("branch next colInfoRight", nextColInfoRight?.[1]);
    console.log("branch next negSet", nextNegSet);
    console.log("branch next colInfoLeft", nextColInfoLeft?.[1]);
    console.log("branch colInfoRight", colInfoRight);
    console.log("branch colInfoLeft", colInfoLeft);
    console.log("branch right", nextPosSet.length, colInfoRight?.[1]);
    console.log("branch left", nextNegSet.length, colInfoLeft?.[1]);
    console.log("branch show left", showLeft);
    console.log("branch show right", showRight);

    if (nextPosSet.length <= colInfoRight?.[1] && showRight === true) {
      console.log("should branch display 1 - right finished, show left");
    }
    if (nextNegSet.length <= colInfoLeft?.[1] && showLeft === true) {
      console.log("should branch display 2 - left finished, show right");
    }
    if (
      (nextNegSet.length >= nextColInfoLeft?.[1] && showLeft === true) ||
      (nextColInfoLeft === undefined && showLeft === true)
    ) {
      console.log("should branch display 3 - normal left");
    }
    if (
      (nextPosSet.length >= nextColInfoRight?.[1] && showRight === true) ||
      (nextColInfoRight === undefined && showRight === true)
    ) {
      console.log("should branch display 4 - normal right");
    }

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
    //  *** DISPLAY FINISH  ******************************************************
    // *************************

    if (colInfoRight === undefined && nextColInfoLeft === undefined) {
      console.log("both sides finished");
      setShowConfirmButton(false);
      setTiles(null);
      setInstructionObjEnd((instructions) => ({
        ...instructions,
        setDisplay: "right",
        instructionsText: (
          <FinalInstructions>{finalInstructionText}</FinalInstructions>
        ),
        // boxes: null,
      }));
      let completedCols = finishThinningSorts(newCols, finalSortColData);
      localStorage.setItem("columnStatements", JSON.stringify(completedCols));
      setIsThinningFinished(true);
      setShowRight(false);
      setShowLeft(false);
      setShowEnd(true);
      showFinish = true;
    }
    if (colInfoLeft === undefined && nextColInfoRight === undefined) {
      console.log("both sides finished");
      setShowConfirmButton(false);
      setTiles(null);
      setInstructionObjEnd((instructions) => ({
        ...instructions,
        setDisplay: "left",
        instructionsText: (
          <FinalInstructions>{finalInstructionText}</FinalInstructions>
        ),
        // boxes: null,
      }));
      let completedCols = finishThinningSorts(newCols, finalSortColData);
      localStorage.setItem("columnStatements", JSON.stringify(completedCols));
      setIsThinningFinished(true);
      setShowRight(false);
      setShowLeft(false);
      setShowEnd(true);
      showFinish = true;
    }

    // // *************************
    // //  *** MOVE POS CARDS  ******************************************************
    // // *************************
    // setPosSorted([...nextPosSet]);
    // // let sortsToDisplayPos = [...nextPosSet];
    // // move selected items to target column
    // selectedPosItems.forEach((obj) => {
    //   let objId = obj.id;
    //   let targetcol = obj.targetcol;
    //   newCols.statementList.forEach((item) => {
    //     console.log("targetcol: ", targetcol);
    //     if (item.id === objId) {
    //       newCols.vCols[targetcol].push(item);
    //       remove(newCols.statementList, (n) => n.id === objId);
    //     }
    //   });
    // });
    // setTargetArray([]);
    // localStorage.setItem("newCols", JSON.stringify(newCols));
    // let displayObject2 = displayDebugStateNums(newCols);
    // console.log("debug newCols", JSON.stringify(displayObject2));

    // // *************************
    // //  *** MOVE NEG CARDS  ******************************************************
    // // *************************
    // setNegSorted([...nextNegSet]);
    // // let sortsToDisplayNeg = [...nextNegSet];
    // // move selected items to target column
    // console.log("selectedNegItems: ", selectedNegItems);
    // selectedNegItems.forEach((obj) => {
    //   let objId = obj.id;
    //   let targetcol = obj.targetcol;
    //   newCols.statementList.forEach((item) => {
    //     if (item.id === objId) {
    //       newCols.vCols[targetcol].push(item);
    //       remove(newCols.statementList, (n) => n.id === objId);
    //     }
    //   });
    // });
    // // clear targetArray and set state
    // setTargetArray([]);
    // localStorage.setItem("newCols", JSON.stringify(newCols));
    // let displayObject3 = displayDebugStateNums(newCols);
    // console.log("debug newCols", JSON.stringify(displayObject3));

    // *************************
    // *** INSUFFICIENT ITEMS DISPLAY *****************************************
    // *************************

    console.log("focus next posSet", nextPosSet);
    console.log("focus next colInfoRight", nextColInfoRight?.[1]);
    console.log("focus next negSet", nextNegSet);
    console.log("focus next colInfoLeft", nextColInfoLeft?.[1]);
    console.log("focus colInfoRight", colInfoRight);
    console.log("focus colInfoLeft", colInfoLeft);

    console.log("focus right", nextPosSet.length, colInfoRight?.[1]);
    console.log("focus left", nextNegSet.length, colInfoLeft?.[1]);

    if (showFinish === true) {
      console.log("show finish is true");
      return;
    }

    // Display 1
    if (nextPosSet.length <= colInfoRight?.[1] && showRight === true) {
      showOnlyLeft = true;
      console.log("display 1 - right finished, show left");
      setIsRightSideFinished(true);
      setShowLeft(true);
      setShowRight(false);
      let targetcol = colInfoLeft[0];
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
      setNegSorted([...negSorted]);
      setTiles(
        boxes([...negSorted], "leftSide", colInfoLeft[1], colInfoLeft[0])
      );
      setInstructionObjLeft((instructions) => ({
        ...instructions,
        side: "leftSide",
        setDisplay: "new",
        instructionsText: CreateLeftSide(leftNum, agreeLeastText),
        // boxes: boxes(
        //   [...negSorted],
        //   "leftSide",
        //   colInfoLeft[1],
        //   colInfoLeft[0]
        // ),
      }));
      // setThinningSide("leftSide");
      setTargetArray([]);
      setCurrentLeftIteration(currentLeftIteration + 1);
      return;
    }

    // Display 2
    if (nextNegSet.length <= colInfoLeft?.[1] && showLeft === true) {
      showOnlyRight = true;
      // console.log("debug posSorted", JSON.stringify(posSorted, null, 2));
      console.log("display 2 - left finished, show right");
      setIsLeftSideFinished(true);
      setShowRight(true);
      setShowLeft(false);
      // let targetcol = colInfoRight[0];
      // posSorted.forEach((item) => {
      //   if (targetArray.includes(item.id)) {
      //     // item.selectedRight = true;
      //     item.selectedPos = true;
      //     item.targetcol = targetcol;
      //     item.selected = true;
      //   } else {
      //     item.selectedPos = false;
      //     item.selected = false;
      //   }
      // });
      // setPosSorted([...posSorted]);
      // setThinningSide("rightSide");
      setTiles(
        boxes([...posSorted], "rightSide", colInfoRight[1], colInfoRight[0])
      );
      setInstructionObjRight((instructions) => ({
        ...instructions,
        side: "rightSide",
        setDisplay: "new",
        instructionsText: CreateRightSide(rightNum, agreeMostText),
        // boxes: boxes(
        //   [...posSorted],
        //   "rightSide",
        //   colInfoRight[1],
        //   colInfoRight[0]
        // ),
      }));
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
      (nextNegSet.length >= nextColInfoLeft?.[1] && showLeft === true) ||
      (nextColInfoLeft === undefined && showLeft === true)
    ) {
      if (isLeftSideFinished === true) {
        return;
      }
      // if (colInfoLeft !== undefined && showRight === true) {
      console.log("display 3 - normal left");
      setTiles(
        boxes([...negSorted], "leftSide", colInfoLeft[1], colInfoLeft[0])
      );
      setInstructionObjLeft((instructions) => ({
        ...instructions,
        side: "leftSide",
        setDisplay: "left",
        instructionsText: CreateLeftSide(leftNum, agreeLeastText),
        // boxes: boxes(
        //   [...negSorted],
        //   "leftSide",
        //   colInfoLeft[1],
        //   colInfoLeft[0]
        // ),
      }));
      setShowRight(false);
      setShowLeft(true);
      return;
      // }
    }

    // Display 4
    if (
      (nextPosSet.length >= nextColInfoRight?.[1] && showRight === true) ||
      (nextColInfoRight === undefined && showRight === true)
    ) {
      // if (colInfoRight !== undefined && showLeft === true) {
      if (isLeftSideFinished === true) {
        return;
      }
      console.log("display 4 - normal right");
      setTiles(
        boxes([...posSorted], "rightSide", colInfoRight[1], colInfoRight[0])
      );
      setInstructionObjRight((instructions) => ({
        ...instructions,
        setDisplay: "right",
        side: "rightSide",
        columnData: [...instructionObjRight.columnData],
        instructionsText: CreateRightSide(rightNum, agreeMostText),
        // boxes: boxes(
        //   [...posSorted],
        //   "rightSide",
        //   colInfoRight[1],
        //   colInfoRight[0]
        // ),
      }));
      setShowRight(true);
      setShowLeft(false);
      return;
      // }
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

  // let thinningSideDisplay = localStorage.getItem("thinningSideDisplay");
  // console.log("thinning side display: ", thinningSideDisplay);

  console.log("show end: ", showEnd);

  return (
    <>
      {showRight && (
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
            <BoxesDiv>{tiles}</BoxesDiv>
          </ContainerDiv>
        </div>
      )}

      {showLeft && (
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
            <BoxesDiv>{tiles}</BoxesDiv>
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
