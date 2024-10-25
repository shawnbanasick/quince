import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PromptUnload from "../../utilities/PromptUnload";
// import ConsentModal from "./ConsentModal";
import parseParams from "../landing/parseParams";
import includes from "lodash/includes";
import remove from "lodash/remove";
import convertNumberToText from "./convertNumberToText";

/* eslint react/prop-types: 0 */

const getLangObj = (state) => state.langObj;
const getMapObj = (state) => state.mapObj;
const getConfigObj = (state) => state.configObj;
const getSetProgressScore = (state) => state.setProgressScore;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetUrlUsercode = (state) => state.setUrlUsercode;
const getSetThinningSide = (state) => state.setThinningSide;
const getThinningSide = (state) => state.thinningSide;

let targetArray = [];

const PostSort = () => {
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

  // console.log(mapObj.qSortHeaders);

  // setup positive and negative sorted arrays from presort
  let presortColumnStatements = JSON.parse(
    localStorage.getItem("columnStatements")
  );

  let [instructionObj, setInstructionObj] = useState({
    leftNumText: "",
    rightNumText: "",
    qSortPattern: [...mapObj.qSortPattern],
  });

  // clear any previous selections
  let sortingList = [...presortColumnStatements.statementList];
  sortingList.forEach((item) => {
    item.selected = false;
    return item;
  });

  // filter out green and pink checked items
  let posSorted2 = sortingList.filter((item) => item.greenChecked === true);
  let negSorted2 = sortingList.filter((item) => item.pinkChecked === true);
  let [posSorted, setPosSorted] = useState(posSorted2);
  const [negSorted, setNegSorted] = useState(negSorted2);

  let initialInstructionPart1 = `Below are the statements you agreed with in the previous step. To begin ordering them select the`;
  let mostAgreeText = <MostAgreeText>you most agree with</MostAgreeText>;
  let leastAgreeText = (
    <LeastAgreeText>you agree with the least</LeastAgreeText>
  );
  let initialInstructionPart3 = ` They will disappear from the screen when you click "Confirm".`;
  let instructionText2 = `Now, to continue, repeat the process with the remaining statements, but this time please select `;

  // INITIALIZE INSTRUCTIONS
  let rightNum;
  let columnData;
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      columnData = createColumnData(headers, qSortPattern);
      console.log("initializing instructions");
      let colInfo = columnData.pop();
      // setColumnInfoArray([...columnData]);
      rightNum = colInfo[1];
      let text1 = convertNumberToText(rightNum);
      let instructionNumber = <InstructionNum>{text1}</InstructionNum>;

      console.log("columnData: ", columnData);

      setInstructionObj({
        qSortPattern: [...instructionObj.qSortPattern],
        rightNumText: text1,
        leftNumText: "",
        side: thinningSide,
        columnData: [...columnData],
        instructionsText: (
          <Instructions>
            {initialInstructionPart1} {instructionNumber} {mostAgreeText}.
            {initialInstructionPart3}
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

  const handleConfirm = () => {
    if (thinningSide === "rightSide") {
      console.log("left side instructions");

      // set left side instructions
      setThinningSide("leftSide");

      let selectedItems = posSorted.filter((item) => item.selected === true);
      console.log("pos selectedItems: ", selectedItems);
      let nextSet = posSorted.filter((item) => item.selected === false);
      setPosSorted([...nextSet]);

      selectedItems.forEach((obj) => {
        let objId = obj.id;
        let targetcol = obj.targetcol;
        presortColumnStatements.statementList.forEach((item) => {
          console.log("targetcol: ", targetcol);
          if (item.id === objId) {
            presortColumnStatements.vCols[targetcol].push(item);
            remove(
              presortColumnStatements.statementList,
              (n) => n.id === objId
            );
          }
        });
      });
      // clear targetArray
      targetArray = [];

      console.log(JSON.stringify(presortColumnStatements.vCols, null, 2));
      // console.log(
      //   JSON.stringify(presortColumnStatements.statementList, null, 2)
      // );

      // set instructions text
      let colInfo = instructionObj.columnData.shift();
      let leftNum = colInfo[1];

      let text = convertNumberToText(leftNum);
      let instructionNumber = <InstructionNum>{text}</InstructionNum>;

      // set instruction object values
      setInstructionObj((instructions) => ({
        ...instructions,
        leftNumText: text,
        side: "leftSide",
        columnData: [...instructionObj.columnData],
        instructionsText: (
          <Instructions>
            {instructionText2} {instructionNumber} {leastAgreeText}.
          </Instructions>
        ),
        boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
      }));
    }

    if (thinningSide === "leftSide") {
      // set right side instructions
      setThinningSide("rightSide");
      console.log("right side instructions");

      let selectedItems = negSorted.filter((item) => item.selected === true);
      console.log("neg selectedItems: ", selectedItems);
      let nextSet = negSorted.filter((item) => item.selected === false);
      setNegSorted([...nextSet]);

      selectedItems.forEach((obj) => {
        let objId = obj.id;
        let targetcol = obj.targetcol;
        presortColumnStatements.statementList.forEach((item) => {
          console.log("targetcol: ", targetcol);
          if (item.id === objId) {
            presortColumnStatements.vCols[targetcol].push(item);
            remove(
              presortColumnStatements.statementList,
              (n) => n.id === objId
            );
          }
        });
      });
      // clear targetArray
      targetArray = [];

      console.log(JSON.stringify(presortColumnStatements.vCols, null, 2));

      let colInfo = instructionObj.columnData.pop();
      rightNum = colInfo[1];

      // set text
      let text2 = convertNumberToText(rightNum);
      let instructionNumber = <InstructionNum>{text2}</InstructionNum>;
      let newInstructionText = (
        <Instructions>
          {instructionText2} {instructionNumber} {mostAgreeText}.
        </Instructions>
      );

      setInstructionObj((instructions) => ({
        ...instructions,
        rightNumText: text2,
        side: "rightSide",
        qSortPattern: [...instructionObj.qSortPattern],
        instructionsText: newInstructionText,
        boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
      }));
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
        REFINE YOUR PREFERENCES
      </SortTitleBar>
      <ContainerDiv>
        <InstructionsDiv>
          {instructionObj.instructionsText}
          {instructionObj.qSortPattern.length}
          <button onClick={handleConfirm}>Confirm</button>
        </InstructionsDiv>
        <BoxesDiv>{instructionObj.boxes}</BoxesDiv>
      </ContainerDiv>
    </div>
  );
};

export default PostSort;

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
  justify-content: center;
  align-items: center;
  padding: 4vw;
  margin-bottom: 200px;
  padding-top: 30px;
  transition: 0.3s ease all;

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
  flex-direction: row;
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
