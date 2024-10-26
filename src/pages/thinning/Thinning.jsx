import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PromptUnload from "../../utilities/PromptUnload";
// import ConsentModal from "./ConsentModal";
import includes from "lodash/includes";
import remove from "lodash/remove";
import convertNumberToText from "./convertNumberToText";
import finishThinningSorts from "./finishThinningSorts";

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

let targetArray = [];

const Thinning = () => {
  //   const ElementRef = useRef(null);

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

  // HELPER - create divs of posSorted items statements to add to dom
  const boxes = (array, side, maxSelect, targetcol) => {
    const cards = array.map((item) => {
      return (
        <Box
          key={item.id}
          id={item.id}
          selected={item.selected}
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

  // HELPER - create column data and max column cards value
  const createColumnData = (headers, qSortPattern) => {
    let columnData = [];
    headers.forEach((item, index) => {
      let tempArray = [];
      tempArray.push(`column${item}`);
      tempArray.push(qSortPattern[index]);
      columnData.push(tempArray);
    });
    return columnData;
  };

  let finalSortColData = createColumnData(headers, qSortPattern);
  console.log(JSON.stringify(finalSortColData));

  // get presort column statements from local storage
  let presortColumnStatements = JSON.parse(
    localStorage.getItem("columnStatements")
  );

  // text instructions state object initialization
  let [instructionObj, setInstructionObj] = useState({
    leftNumText: "",
    rightNumText: "",
    qSortPattern: [...mapObj.qSortPattern],
  });

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

  let [posSorted, setPosSorted] = useState(posSorted2);
  const [negSorted, setNegSorted] = useState(negSorted2);

  let initialInstructionPart1 = `Below are the statements you agreed with in the previous step. To begin ordering them select the statements that you most agree with.`;
  let initialInstructionPart3 = ` The next set of statements will appear on the screen when you click the orange "Confirm" button.`;
  let agreeLeastText = `Next, repeat the process with the remaining statements, but this time please select the cards that you agree with the least.`;
  let agreeMostText = `Next, repeat the process with the remaining statements, but this time please select the cards that you agree with the most.`;

  // INITIALIZE INSTRUCTIONS
  let rightNum;
  let columnData;
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      columnData = createColumnData(headers, qSortPattern);
      let colInfo = columnData.pop();
      rightNum = colInfo[1];
      let text1 = convertNumberToText(rightNum);
      localStorage.setItem("newCols", JSON.stringify(presortColumnStatements));

      setInstructionObj({
        qSortPattern: [...instructionObj.qSortPattern],
        rightNumText: text1,
        leftNumText: "",
        side: thinningSide,
        columnData: [...columnData],
        positiveComplete: false,
        negativeComplete: false,
        instructionsText: (
          <Instructions>
            {initialInstructionPart1}
            {initialInstructionPart3}{" "}
            <MostAgreeText>
              <br />
              <br />
              {`Number to Select: ${text1} statements`}{" "}
            </MostAgreeText>
          </Instructions>
        ),
        boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
      });
      initialized.current = true;
    }
  }, [initialized, createColumnData, headers, qSortPattern, thinningSide]);

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
      console.log("leftSide branch");
      negSorted.forEach((item) => {
        if (targetArray.includes(item.id)) {
          item.selected = true;
          item.targetcol = targetcol;
        } else {
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
      console.log("rightSide branch");
      posSorted.forEach((item) => {
        if (targetArray.includes(item.id)) {
          item.selected = true;
          item.targetcol = targetcol;
        } else {
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

  // *** ON CONFIRM BUTTON CLICK ***
  const handleConfirm = () => {
    // set flags
    let positiveComplete = false;
    let negativeComplete = false;

    // pull data from local storage
    let newCols = JSON.parse(localStorage.getItem("newCols"));

    if (thinningSide === "rightSide") {
      // set left side flag
      setThinningSide("leftSide");

      // filter out selected items
      let selectedItems = posSorted.filter((item) => item.selected === true);
      let nextSet = posSorted.filter((item) => item.selected === false);

      // set instruction object values for text and boxes
      let colInfo = instructionObj.columnData.shift();
      let leftNum = colInfo[1];
      let selectionNumber = convertNumberToText(leftNum);

      if (nextSet.length <= leftNum) {
        console.log("nextSet.length <= leftNum");
      }

      // set complete trigger
      if (nextSet.length === 0) {
        positiveComplete = true;
      }

      // set state
      setPosSorted([...nextSet]);

      // move selected items to target column
      selectedItems.forEach((obj) => {
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
      // clear targetArray and set state
      targetArray = [];
      localStorage.setItem("newCols", JSON.stringify(newCols));

      // check if column info is undefined and early return
      console.log(JSON.stringify(colInfo));
      if (colInfo === undefined) {
        console.log("both sides complete");
        setShowConfirmButton(false);
        setInstructionObj((instructions) => ({
          ...instructions,
          instructionsText: (
            <Instructions>
              Refinement process complete. Click the button at the bottom to
              continue.
            </Instructions>
          ),
          columnData: [...instructionObj.columnData],
          boxes: null,
        }));
        let completedCols = finishThinningSorts(newCols, finalSortColData);
        localStorage.setItem("columnStatements", JSON.stringify(completedCols));
        return;
      }

      // set instructions text
      let instructionNumber = (
        <InstructionNum>
          <LeastAgreeText>
            Number to Select: {selectionNumber} statements
          </LeastAgreeText>
        </InstructionNum>
      );

      // set text element
      let newInstructionText = (
        <Instructions>
          {agreeLeastText}
          <br />
          <br />
          {instructionNumber}
        </Instructions>
      );

      // check if both sides are complete and early return
      if (negSorted.length === 0 && positiveComplete === true) {
        console.log("both sides complete");
        setShowConfirmButton(false);
        setInstructionObj((instructions) => ({
          ...instructions,
          instructionsText: (
            <Instructions>
              Refinement process complete. Click the button at the bottom to
              continue.
            </Instructions>
          ),
          columnData: [...instructionObj.columnData],
          boxes: null,
        }));
        let completedCols = finishThinningSorts(newCols, finalSortColData);
        localStorage.setItem("columnStatements", JSON.stringify(completedCols));
        return;
      }

      // set instruction object values for text and boxes
      setInstructionObj((instructions) => ({
        ...instructions,
        leftNumText: selectionNumber,
        side: "leftSide",
        columnData: [...instructionObj.columnData],
        instructionsText: newInstructionText,
        boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
      }));
    } // end rightside branch

    if (thinningSide === "leftSide") {
      // set right side flag
      setThinningSide("rightSide");

      // filter out selected items
      let selectedItems = negSorted.filter((item) => item.selected === true);
      let nextSet = negSorted.filter((item) => item.selected === false);

      // set complete trigger
      if (nextSet.length === 0) {
        negativeComplete = true;
      }

      // set state
      setNegSorted([...nextSet]);

      // move selected items to target column
      selectedItems.forEach((obj) => {
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
      targetArray = [];
      localStorage.setItem("newCols", JSON.stringify(newCols));

      // set instruction object values for text and boxes
      let colInfo = instructionObj.columnData.pop();

      // check if column info is undefined and early return
      console.log(JSON.stringify(colInfo));
      if (colInfo === undefined) {
        console.log("both sides complete");
        setShowConfirmButton(false);
        setInstructionObj((instructions) => ({
          ...instructions,
          instructionsText: (
            <Instructions>
              Refinement process complete. Click the button at the bottom to
              continue.
            </Instructions>
          ),
          columnData: [...instructionObj.columnData],
          boxes: null,
        }));
        let completedCols = finishThinningSorts(newCols, finalSortColData);
        localStorage.setItem("columnStatements", JSON.stringify(completedCols));
        return;
      }

      // set text
      rightNum = colInfo[1];
      let selectionNumber2 = convertNumberToText(rightNum);
      let instructionNumber = (
        <InstructionNum>
          <MostAgreeText>
            Number to Select: {selectionNumber2} statements
          </MostAgreeText>
        </InstructionNum>
      );

      // set text element
      let newInstructionText = (
        <Instructions>
          {agreeMostText}
          <br />
          <br />
          {instructionNumber}
        </Instructions>
      );

      // check if both sides are complete
      if (posSorted.length === 0 && negativeComplete === true) {
        console.log("both sides complete");
        setShowConfirmButton(false);
        setInstructionObj((instructions) => ({
          ...instructions,
          instructionsText: (
            <FinalInstructions>
              <div>
                Refinement process complete. Click the button at the bottom to
                continue.
              </div>
            </FinalInstructions>
          ),
          columnData: [...instructionObj.columnData],
          boxes: null,
        }));
        let completedCols = finishThinningSorts(newCols, finalSortColData);
        localStorage.setItem("columnStatements", JSON.stringify(completedCols));
        return;
      }

      // set instruction object values for text and boxes
      setInstructionObj((instructions) => ({
        ...instructions,
        rightNumText: selectionNumber2,
        side: "rightSide",
        columnData: [...instructionObj.columnData],
        instructionsText: newInstructionText,

        boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
      }));

      if (posSorted.length === 0 && negSorted.length === 0) {
        console.log("both sides complete");
      }
    } // end leftside branch
  };

  setDisplayNextButton(true);

  const headerBarColor = configObj.headerBarColor;

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
      <SortTitleBar background={headerBarColor}>
        Refine Your Preferences
      </SortTitleBar>
      <ContainerDiv>
        <InstructionsDiv>
          {instructionObj.instructionsText}
          {showConfirmButton && (
            <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>
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
    props.selected && props.side === "rightSide"
      ? "lightgreen"
      : props.selected && props.side === "leftSide"
      ? "lightcoral"
      : "white"};

  color: black;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease all;

  &:hover {
    background-color: ${(props) =>
      props.side === "rightSide" ? "lightgreen" : "lightcoral"};
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

const InstructionNum = styled.span`
  font-weight: bold;
`;

const MostAgreeText = styled.span`
  background-color: lightgreen;
  padding: 2px;
  font-style: italic;
`;

const LeastAgreeText = styled.span`
  background-color: lightcoral;
  padding: 2px;
  font-style: italic;
`;

const ConfirmButton = styled.button`
  background: orange;
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
    font-weight: bold;
  }
`;
