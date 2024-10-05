import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PromptUnload from "../../utilities/PromptUnload";
// import ConsentModal from "./ConsentModal";
import parseParams from "../landing/parseParams";

/* eslint react/prop-types: 0 */

const getLangObj = (state) => state.langObj;
const getMapObj = (state) => state.mapObj;
const getConfigObj = (state) => state.configObj;
const getSetProgressScore = (state) => state.setProgressScore;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetUrlUsercode = (state) => state.setUrlUsercode;

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

  console.log("presortColumnStatements: ", presortColumnStatements);
  console.log("mapObj q sort pattern: ", mapObj.qSortPattern);
  console.log("mapObj q sort headers: ", mapObj.qSortHeaders);
  console.log("mapObj q sort header numbers: ", mapObj.qSortHeaderNumbers);

  let sortingList = [...presortColumnStatements.statementList];
  let posSorted = sortingList.filter((item) => item.greenChecked === true);
  let negSorted = sortingList.filter((item) => item.pinkChecked === true);

  console.log(JSON.stringify(posSorted, null, 2));
  console.log(JSON.stringify(negSorted, null, 2));

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
      <button>Confirm</button>
      <ContainerDiv>
        <div>REFINE YOUR PREFERENCES</div>
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
  padding: 5vw;
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
