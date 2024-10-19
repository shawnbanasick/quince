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
import convertNumberToText from "./convertNumberToText";

/* eslint react/prop-types: 0 */

const getLangObj = (state) => state.langObj;
const getMapObj = (state) => state.mapObj;
const getConfigObj = (state) => state.configObj;
const getSetProgressScore = (state) => state.setProgressScore;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetUrlUsercode = (state) => state.setUrlUsercode;

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
  const setUrlUsercode = useStore(getSetUrlUsercode);

  let presortColumnStatements = JSON.parse(
    localStorage.getItem("columnStatements")
  );

  let [instructionObj, setInstructionObj] = useState({
    leftNumText: "",
    rightNumText: "",
    currentSide: "rightSide",
    qSortPattern: [...mapObj.qSortPattern],
  });

  let initialInstructionPart1 = `Below are the statements you agreed with in the previous step. To begin ordering them select the`;
  let mostAgreeText = <MostAgreeText>you most agree with</MostAgreeText>;
  let leastAgreeText = (
    <LeastAgreeText>you agree with the least</LeastAgreeText>
  );
  let initialInstructionPart3 = ` They will disappear from the screen when you click "Confirm".`;
  let instructionText2 = `Now, to continue, repeat the process with the remaining statements, but this time please select `;

  // INITIALIZE INSTRUCTIONS
  let rightNum;
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      console.log("initializing instructions");
      rightNum = instructionObj.qSortPattern.pop();
      let text1 = convertNumberToText(rightNum);
      let instructionNumber = <InstructionNum>{text1}</InstructionNum>;

      setInstructionObj({
        qSortPattern: [...instructionObj.qSortPattern],
        rightNumText: text1,
        leftNumText: "",
        currentSide: "rightSide",
        instructionsText: (
          <Instructions>
            {initialInstructionPart1} {instructionNumber} {mostAgreeText}.
            {initialInstructionPart3}
          </Instructions>
        ),
      });
      initialized.current = true;
    }
  }, [initialized]);

  // initial instruction setup

  let sortingList = [...presortColumnStatements.statementList];
  sortingList.forEach((item) => {
    item.selected = false;
    return item;
  });

  let posSorted2 = sortingList.filter((item) => item.greenChecked === true);
  let negSorted2 = sortingList.filter((item) => item.pinkChecked === true);
  let [posSorted, setPosSorted] = useState(posSorted2);
  const [negSorted, setNegSorted] = useState(negSorted2);

  const handleClick = (e) => {
    console.log("e.target.id: ", e.target.id);
    console.log(targetArray.length);
    if (targetArray.length > 1) {
      targetArray.shift();
    }
    targetArray.push(e.target.id);
    console.log(JSON.stringify(targetArray));

    posSorted.forEach((item) => {
      if (targetArray.includes(item.id)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    setPosSorted([...posSorted]);
    // console.log(JSON.stringify(posSorted));
  };

  const handleConfirm = () => {
    console.log("currentSide: ", instructionObj.currentSide);
    if (instructionObj.currentSide === "rightSide") {
      // set left side instructions
      console.log("left side instructions");
      let leftNum = instructionObj.qSortPattern.shift();
      let text = convertNumberToText(leftNum);
      console.log("text: ", text);
      let instructionNumber = <InstructionNum>{text}</InstructionNum>;
      console.log("qSortPattern: ", instructionObj.qSortPattern);

      setInstructionObj((instructions) => ({
        ...instructions,
        leftNumText: text,
        qSortPattern: [...instructionObj.qSortPattern],
        instructionsText: (
          <Instructions>
            {instructionText2} {instructionNumber} {leastAgreeText}.
          </Instructions>
        ),
        currentSide:
          instructionObj.currentSide === "rightSide" ? "leftSide" : "rightSide",
      }));
    }

    if (instructionObj.currentSide === "leftSide") {
      // set right side instructions
      console.log("right side instructions");
      let rightNum = instructionObj.qSortPattern.pop();
      let text2 = convertNumberToText(rightNum);
      // let leastAgreeText = (
      //   <LeastAgreeText>you agree with the least</LeastAgreeText>
      // );

      let instructionNumber = <InstructionNum>{text2}</InstructionNum>;
      let newInstructionText = (
        <Instructions>
          {instructionText2} {instructionNumber} {mostAgreeText}.
        </Instructions>
      );

      console.log("qSortPattern: ", instructionObj.qSortPattern);
      setInstructionObj((instructions) => ({
        ...instructions,
        rightNumText: text2,
        qSortPattern: [...instructionObj.qSortPattern],
        instructionsText: newInstructionText,
        currentSide:
          instructionObj.currentSide === "rightSide" ? "leftSide" : "rightSide",
      }));
    }

    let selectedItems = posSorted.filter((item) => item.selected === true);
    // console.log(JSON.stringify(selectedItems));
    let nextSet = posSorted.filter((item) => item.selected === false);
    setPosSorted([...nextSet]);
    // console.log(JSON.stringify(nextSet));
  };

  let boxes = [...posSorted].map((item) => {
    // create divs of posSorted items statements to add to dom
    return (
      <div key={item.id} onClick={handleClick}>
        <Box id={item.id} selected={item.selected}>
          {item.statement}
        </Box>
      </div>
    );
  });

  // console.log(JSON.stringify(posSorted, null, 2));
  // console.log(JSON.stringify(negSorted, null, 2));

  setDisplayNextButton(true);

  const headerBarColor = configObj.headerBarColor;
  //   const consentText = ReactHtmlParser(decodeHTML(langObj.consentText)) || "";

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

  console.log("instructionObj: ", instructionObj);

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
        <BoxesDiv>{boxes}</BoxesDiv>
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
  background-color: ${(props) => (props.selected ? "lightgreen" : "white")};
  color: black;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease all;

  &:hover {
    background-color: lightgreen;
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
