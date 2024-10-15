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

  // console.log("presortColumnStatements: ", presortColumnStatements);
  // console.log("mapObj q sort pattern: ", mapObj.qSortPattern);
  // console.log("mapObj q sort headers: ", mapObj.qSortHeaders);
  // console.log("mapObj q sort header numbers: ", mapObj.qSortHeaderNumbers);

  let headerNumbers = [...mapObj.qSortHeaderNumbers].map((item) => +item);
  // console.log("headerNumbers: ", headerNumbers);

  let minQsortValue = Math.min(...headerNumbers);

  // for q sort patterns with negative values
  if (minQsortValue < 0) {
    let posHeaderNumbers = headerNumbers.filter((item) => item > 0);
    let negHeaderNumbers = headerNumbers.filter((item) => item < 0);

    // console.log("posHeaderNumbers: ", posHeaderNumbers);
    // console.log("negHeaderNumbers: ", negHeaderNumbers);
  }

  let sortingList = [...presortColumnStatements.statementList];
  sortingList.forEach((item) => {
    item.selected = false;
    return item;
  });

  let posSorted2 = sortingList.filter((item) => item.greenChecked === true);
  let negSorted2 = sortingList.filter((item) => item.pinkChecked === true);

  const [posSorted, setPosSorted] = useState(posSorted2);
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

  //   const titleText =
  //     ReactHtmlParser(decodeHTML(langObj.consentTitleBarText)) || "";

  return (
    <div>
      <PromptUnload />
      <SortTitleBar background={headerBarColor}>
        REFINE YOUR PREFERENCES
      </SortTitleBar>
      <ContainerDiv>
        <InstructionsDiv>
          <Instructions>
            Select two statements that best reflect your perspective
          </Instructions>
          <button>Confirm</button>
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
  padding: 3vw;
  margin-bottom: 70px;
  padding-top: 50px;
  transition: 0.3s ease all;
  margin-top: 50px;

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
  margin-bottom: 20px;
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
