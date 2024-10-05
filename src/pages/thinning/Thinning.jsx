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

  useEffect(() => {
    // set participant Id if set in URL
    let urlString = parseParams(window.location.href);
    // if nothing in URL, check local storage
    if (urlString === undefined || urlString === null) {
      let urlName = localStorage.getItem("urlUsercode");
      // if nothing in local storage, set to "not_set"
      if (
        urlName === null ||
        urlName === undefined ||
        urlName === "undefined"
      ) {
        console.log("no url usercode in storage");
        setUrlUsercode("not_set");
        localStorage.setItem("urlUsercode", "not_set");
      } else {
        // if something in local storage, set state
        console.log("URL usercode from storage: ", urlName);
        if (urlName === "not_set") {
          setUrlUsercode("not_set");
        } else {
          setUrlUsercode(`${urlName} (stored)`);
        }
      }
    } else {
      // if something in URL, set it in state
      let codeName = urlString;
      codeName = codeName.replace(/\/|#/g, "");
      console.log("URL usercode: ", codeName);
      setUrlUsercode(codeName);
      localStorage.setItem("urlUsercode", codeName);
    }
  }, [setUrlUsercode, configObj]);

  const titleText =
    ReactHtmlParser(decodeHTML(langObj.consentTitleBarText)) || "";

  return (
    <div>
      <PromptUnload />
      <SortTitleBar background={headerBarColor}>
        REFINE YOUR PREFERENCES
      </SortTitleBar>
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
