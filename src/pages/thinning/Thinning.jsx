import { useEffect, useRef, useState } from "react";
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

  // HELPER - create divs of posSorted items statements to add to dom
  const boxes = (array, side, maxSelect, targetcol) => {
    const cards = array.map((item) => {
      return (
        <Box
          key={item.id}
          id={item.id}
          selected={item.selected}
          selectedPos={item.selectedPos}
          selectedNeg={item.selectedNeg}
          data-side={side}
          data-max={maxSelect}
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

  const headers = [...mapObj.qSortHeaders];
  const qSortPattern = [...mapObj.qSortPattern];
  const maxIterations = setMaxIterations(qSortPattern);
  const maxLeftIterations = maxIterations;
  const maxRightIterations = maxIterations;

  // **** USE REFS ***** //
  const confirmButtonRef = useRef(null);

  let finalSortColData = createColumnData(headers, qSortPattern);

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
      return item;
    });
    // filter out green and pink checked items
    posSorted2 = sortingList.filter((item) => item.greenChecked === true);
    negSorted2 = sortingList.filter((item) => item.pinkChecked === true);
  }

  // **** Local State Variables ****
  let [posSorted, setPosSorted] = useState(posSorted2);
  const [negSorted, setNegSorted] = useState(negSorted2);
  let [instructionObj, setInstructionObj] = useState({
    rightNumText: "",
    qSortPattern: [...mapObj.qSortPattern],
  });

  // ** INITIALIZE INSTRUCTIONS AND BOXES **
  let rightNum;
  let columnData;
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      columnData = createColumnData(headers, qSortPattern);
      let colInfo = columnData.pop();
      console.log("colInfo: ", colInfo);
      setPreviousColInfo(colInfo);

      rightNum = colInfo[1];
      setCurrentSelectMaxValue(rightNum);

      let text1 = convertNumberToText(rightNum);
      localStorage.setItem("newCols", JSON.stringify(presortColumnStatements));

      setInstructionObj({
        qSortPattern: [...instructionObj.qSortPattern],
        rightNumText: text1,
        side: thinningSide,
        columnData: [...columnData],
        instructionsText: (
          <Instructions>
            {initialInstructionPart1}
            {initialInstructionPart3} <br />
            <br />
            <MostAgreeText>
              {`Number of Statements to Select: ${rightNum}`}{" "}
            </MostAgreeText>
          </Instructions>
        ),
        boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
      });
      initialized.current = true;
    }
  }, [initialized, createColumnData, headers, qSortPattern, thinningSide]);

  // todo *** HANDLE BOX CLICK ***
  const handleClick = (e) => {
    console.log("e.target.side: ", e.target.dataset.side);
    if (e.target.id === "") {
      return;
    }

    // determine max number that can be selected
    let colMax = +e.target.dataset.max;
    let targetcol = e.target.dataset.targetcol;
    console.log("colMax: ", colMax);

    // Add selected item to targetArray
    targetArray.push(e.target.id);

    // drop first item if array length exceeds max
    if (targetArray.length > colMax) {
      targetArray.shift();
    }
    console.log(JSON.stringify(targetArray));

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
      setInstructionObj((instructionObj) => ({
        ...instructionObj,
        boxes: boxes([...negSorted], "leftSide", colMax, targetcol),
      }));
      setNegSorted([...negSorted]);
    }

    // Redraw page with selected items highlighted
    if (e.target.dataset.side === "rightSide") {
      console.log("rightSide branch selected item");
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
      setInstructionObj((instructionObj) => ({
        ...instructionObj,
        boxes: boxes([...posSorted], "rightSide", colMax, targetcol),
      }));
      setPosSorted([...posSorted]);
    }
  };

  // **********************************************************************
  // *** ON CONFIRM BUTTON CLICK ******************************************
  // **********************************************************************
  const handleConfirm = () => {
    console.log("confirm button clicked");
    // ******* DISPATCHER ********
    // pull COLUMN data from local storage
    let newCols = JSON.parse(localStorage.getItem("newCols"));

    // filter out selected items
    let selectedPosItems = posSorted.filter(
      (item) => item.selectedPos === true
    );
    let nextPosSet = posSorted.filter((item) => item.selectedPos === false);
    // filter out selected items
    let selectedNegItems = negSorted.filter(
      (item) => item.selectedNeg === true
    );
    let nextNegSet = negSorted.filter((item) => item.selectedNeg === false);

    console.log("nextPosSet", nextPosSet.length);
    console.log("nextNegSet", nextNegSet.length);

    let colInfo;
    let leftNum;
    let currentCol;
    if (thinningSide === "rightSide") {
      console.log("dispatch rightSide branch");
      colInfo = instructionObj.columnData.shift();
      setPreviousColInfo(colInfo);
      leftNum = colInfo[1];
      setCurrentSelectMaxValue(leftNum);
      console.log("colInfo: ", colInfo);
      if (nextPosSet.length <= +colInfo[1] && isRightSideFinished === false) {
        console.log("rightSide finished");
        setIsRightSideFinished(true);
        setThinningSide("leftSide");
        // setIsRightBelowThreshold(true);
        // next set, selectedItems, newCols, instructions
        setPosSorted([...nextPosSet]);

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
        let displayObject = displayDebugStateNums(newCols);
        console.log("debug newCols", JSON.stringify(displayObject));
        // clear targetArray and set state
        let copyInstructions = { ...instructionObj };
        setInstructionObj(() => ({
          ...copyInstructions,
          instructionsText: CreateLeftSide(leftNum, agreeLeastText),
          boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
        }));
        return;
      }
    }

    if (thinningSide === "leftSide") {
      console.log("dispatch leftSide branch");
      colInfo = instructionObj.columnData.pop();
      setPreviousColInfo(colInfo);
      console.log("colInfo: ", colInfo);
      if (nextNegSet.length <= +colInfo[1] && isLeftSideFinished === false) {
        console.log("leftSide finished");
        setIsLeftSideFinished(true);
        // setIsLeftBelowThreshold(true);
        // setThinningSide("rightSide");
        // set state
        setNegSorted([...nextNegSet]);
        // move selected items to target column
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
        setTargetArray([]);
        localStorage.setItem("newCols", JSON.stringify(newCols));
        let copyInstructions = { ...instructionObj };
        setInstructionObj(() => ({
          ...copyInstructions,
          instructionsText: CreateRightSide(colInfo[1], agreeMostText),

          boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
        }));
        return;
      }
    }

    //********* RIGHT SIDE *************** */
    if (thinningSide === "rightSide") {
      // set left side flag
      setThinningSide("leftSide");

      // Get Col info

      // todo *** ALL DISPLAY FINISHED ***
      if (
        colInfo === undefined ||
        (isRightSideFinished === true && isLeftSideFinished === true)
      ) {
        console.log("rightSide branch all display finished sub-branch");
        if (isThinningFinished === false) {
          console.log("both sides complete [colInfo undefined - neg branch]");
          setIsThinningFinished(true);
          setShowConfirmButton(false);
          setInstructionObj((instructions) => ({
            ...instructions,
            instructionsText: (
              <FinalInstructions>{finalInstructionText}</FinalInstructions>
            ),
            columnData: [...instructionObj.columnData],
            boxes: null,
          }));
          let completedCols = finishThinningSorts(newCols, finalSortColData);
          localStorage.setItem(
            "columnStatements",
            JSON.stringify(completedCols)
          );
        }
        return;
      }

      // todo *** EARLY RETURN - BACK TO NEG ***
      if (
        nextPosSet.length <= currentSelectMaxValue ||
        nextPosSet.length === 0
      ) {
        console.log("rightSide branch early return back to neg sub-branch");
        // setIsRightSideFinished(true);
        // setIsRightBelowThreshold(true);
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
        let displayObject = displayDebugStateNums(newCols);
        console.log("debug newCols", JSON.stringify(displayObject));
        // clear targetArray and set state
        setTargetArray([]);
        localStorage.setItem("newCols", JSON.stringify(newCols));
        // set instruction object values for text and boxes
        setInstructionObj((instructions) => ({
          ...instructions,
          side: "leftSide",
          columnData: [...instructionObj.columnData],
          instructionsText: CreateLeftSide(leftNum, agreeLeastText),
          boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
        }));
        return;
      }

      // todo << *** ALL DISPLAY FINISHED *** >>
      if (
        colInfo === undefined ||
        (isLeftSideFinished === true && isRightSideFinished === true)
      ) {
        console.log("rightSide branch all display finished sub-branch");
        console.log("both sides complete [colInfo undefined]");
        setIsThinningFinished(true);
        setShowConfirmButton(false);
        setInstructionObj((instructions) => ({
          ...instructions,
          instructionsText: (
            <FinalInstructions>{finalInstructionText}</FinalInstructions>
          ),
          columnData: [...instructionObj.columnData],
          boxes: null,
        }));
        let completedCols = finishThinningSorts(newCols, finalSortColData);
        localStorage.setItem("columnStatements", JSON.stringify(completedCols));
        return;
      }

      // todo <<<<***** NORMAL RETURN - Setup left side ******>>>>>
      // next set, selectedItems, newCols, instructions
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
      let displayObject = displayDebugStateNums(newCols);
      console.log("debug newCols", JSON.stringify(displayObject));
      // clear targetArray and set state
      setTargetArray([]);
      localStorage.setItem("newCols", JSON.stringify(newCols));
      // set instruction object values for text and boxes
      setInstructionObj((instructions) => ({
        ...instructions,
        side: "leftSide",
        columnData: [...instructionObj.columnData],
        instructionsText: CreateLeftSide(leftNum, agreeLeastText),
        boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
      }));
      return;
    } // end rightside branch

    // **********************************************************************
    // **********************************************************************

    if (thinningSide === "leftSide") {
      // set right side flag
      setThinningSide("rightSide");

      // todo *** ALL DISPLAY FINISHED ***
      if (
        colInfo === undefined ||
        (isRightSideFinished === true && isLeftSideFinished === true)
      ) {
        console.log("leftSide branch all display finished sub-branch");
        if (setIsThinningFinished === false) {
          console.log("both sides complete [colInfo undefined - neg branch]");
          setIsThinningFinished(true);
          setShowConfirmButton(false);
          setInstructionObj((instructions) => ({
            ...instructions,
            instructionsText: (
              <FinalInstructions>{finalInstructionText}</FinalInstructions>
            ),
            columnData: [...instructionObj.columnData],
            boxes: null,
          }));
          let completedCols = finishThinningSorts(newCols, finalSortColData);
          localStorage.setItem(
            "columnStatements",
            JSON.stringify(completedCols)
          );
        }
        return;
      }

      // todo << *** EARLY RETURN - BACK TO POS *** >>
      // if (nextSet.length === 0 || nextSet.length <= currentSelectMaxValue) {
      if (isRightSideFinished === true && isLeftSideFinished === false) {
        console.log(
          "early return [isRightSideFinished === true] - neg sub-branch"
        );
        setIsLeftSideFinished(true);
        // setIsLeftBelowThreshold(true);
        // remove pos statements from statements list
        posSorted.forEach((obj) => {
          let objId = obj.id;
          console.log("posSorted: ", posSorted);
          // iterate through all remaining statements and push if id matches
          newCols.statementList.forEach((item) => {
            if (item.id === objId) {
              // newCols.vCols[currentCol].push(item);
              remove(newCols.statementList, (n) => n.id === objId);
            }
          });
        });
        let displayObject = displayDebugStateNums(newCols);
        console.log("debug newCols", JSON.stringify(displayObject));

        if (newCols.vCols[currentCol]) {
          newCols.vCols[currentCol] = [
            ...newCols.vCols[currentCol],
            ...posSorted,
          ];
        } else {
          newCols.vCols[currentCol] = [...posSorted];
        }

        setPosSorted([]);

        localStorage.setItem("newCols", JSON.stringify(newCols));
        // set instruction object values for text and boxes
        setInstructionObj((instructions) => ({
          ...instructions,
          side: "rightSide",
          columnData: [...instructionObj.columnData],
          instructionsText: CreateLeftSide(colInfo[1], agreeLeastText),

          boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
        }));
        setTargetArray([]);
        return;
      }

      // todo << ** NORMAL RETURN ** >>
      console.log("rightSide branch normal sub-branch");

      // set state
      setNegSorted([...nextNegSet]);
      // move selected items to target column
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
      // set instruction object values for text and boxes
      setInstructionObj((instructions) => ({
        ...instructions,
        side: "rightSide",
        columnData: [...instructionObj.columnData],
        instructionsText: CreateRightSide(colInfo[1], agreeMostText),

        boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
      }));
      return;
    } // end leftside branch
  };

  setDisplayNextButton(true);

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
    <div>
      <PromptUnload />
      <ConfirmationModal />
      <ThinningPreventNavModal />
      <SortTitleBar background={configObj.headerBarColor}>
        Refine Your Preferences
      </SortTitleBar>
      <ContainerDiv>
        <InstructionsDiv>
          {instructionObj.instructionsText}
          {showConfirmButton && (
            <ConfirmButton ref={confirmButtonRef} onClick={handleConfirm}>
              Submit
            </ConfirmButton>
          )}
        </InstructionsDiv>
        <BoxesDiv>{instructionObj.boxes}</BoxesDiv>
      </ContainerDiv>
    </div>
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
