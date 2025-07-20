import React, { useEffect } from "react";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import calculatePostsortResults from "./calculatePostsortResults";
import { v4 as uuid } from "uuid";
import SaveLocalDataToLocalStorageButton from "./SaveLocalDataToLocalStorageButton";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import LocalSubmitSuccessModal from "./LocalSubmitSuccessModal";
import convertObjectToResults from "../sort/convertObjectToResults";
import convertObjectToBaserowResults from "../sort/convertObjectToBaserowResults";
import getCurrentDateTime from "../../utilities/getCurrentDateTime";
import createPresortObject from "./createPresortObject";
import SubmitButtonBaserow from "./SubmitButtonBaserow";
import createBaserowObject from "./createBaserowObject";
// import SubmitFallback from "./SubmitFallback";
// import SubmitButtonNetlify from "./SubmitButtonNetlify";
// import SubmitButton from "./SubmitButton";
// import SubmitButtonGS from "./SubmitButtonGS";
// import SubmitButtonEmail from "./SubmitButtonEmail";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getMapObj = (state) => state.mapObj;
const getSetCurrentPage = (state) => state.setCurrentPage;
// const getDisplaySubmitFallback = (state) => state.displaySubmitFallback;
const getDisplayGoodbyeMessage = (state) => state.displayGoodbyeMessage;
const getParticipantName = (state) => state.localParticipantName;
const getLocalUsercode = (state) => state.localUsercode;
const getDisplayBelowButtonText = (state) => state.displayBelowButtonText;

let transmissionResults = {};
let baserowResults = {};

const SubmitPage = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const mapObj = useSettingsStore(getMapObj);
  const setCurrentPage = useStore(getSetCurrentPage);
  // const displaySubmitFallback = useStore(getDisplaySubmitFallback);
  const displayGoodbyeMessage = useStore(getDisplayGoodbyeMessage);
  const localParticipantName = useStore(getParticipantName);
  const localUsercode = useStore(getLocalUsercode);
  const urlUsercode = localStorage.getItem("urlUsercode") || "";
  const displayBelowButtonText = useStore(getDisplayBelowButtonText);

  // PERSISTENT STATE
  let resultsSurveyFromStorage = JSON.parse(localStorage.getItem("resultsSurvey"));
  if (resultsSurveyFromStorage === undefined) {
    resultsSurveyFromStorage = {};
  }

  useEffect(() => {
    setCurrentPage("submit");
    localStorage.setItem("currentPage", "submit");
  }, [setCurrentPage]);

  // Language - grab translations
  const transferTextAbove = ReactHtmlParser(decodeHTML(langObj.transferTextAbove)) || "";
  const transferTextBelow = ReactHtmlParser(decodeHTML(langObj.transferTextBelow)) || "";
  const goodbyeMessage = ReactHtmlParser(decodeHTML(langObj.goodbyeMessage)) || "";
  const linkedProjectFallbackMessage =
    ReactHtmlParser(decodeHTML(langObj.linkedProjectFallbackMessage)) || "";
  const linkedProjectBtnMessage = decodeHTML(langObj.linkedProjectBtnMessage) || "";
  const pageHeader = ReactHtmlParser(decodeHTML(langObj.transferHead)) || "";

  // PERSISTENT STATE - read in results if they exist in local storage
  const resultsPresort = JSON.parse(localStorage.getItem("resultsPresort")) || {};
  const resultsSortObj = JSON.parse(localStorage.getItem("sortColumns")) || {};

  console.log("resultsPresort", JSON.stringify(resultsPresort));
  console.log("resultsSortObj", JSON.stringify(resultsSortObj));

  // config options
  const headerBarColor = configObj.headerBarColor;
  const dateString = getCurrentDateTime();

  // useEffect(() => {
  // format results for transmission
  try {
    let randomId = localStorage.getItem("randomId") || uuid();
    let partId = localStorage.getItem("partId") || "no part ID";
    let usercode = localStorage.getItem("usercode") || "no usercode set";

    // finish setup and format results object
    transmissionResults["projectName"] = configObj.studyTitle;
    transmissionResults["partId"] = partId;
    transmissionResults["randomId"] = randomId;
    transmissionResults["urlUsercode"] = usercode;

    baserowResults["r1"] = randomId;
    baserowResults["r2"] = configObj.studyTitle;
    baserowResults["r3"] = `(partId) ${partId}`;
    baserowResults["r4"] = `(urlUsercode) ${usercode}`;
  } catch (error) {
    console.log(error);
    alert("1: " + error.message);
  }

  try {
    let timeOnlandingPage = localStorage.getItem("timeOnlandingPage") || "00:00:00";
    let timeOnpresortPage = localStorage.getItem("timeOnpresortPage") || "00:00:00";
    let timeOnthinningPage = localStorage.getItem("timeOnthinningPage") || "00:00:00";
    let timeOnsortPage = localStorage.getItem("timeOnsortPage") || "00:00:00";

    transmissionResults["dateTime"] = dateString;
    transmissionResults["timeLanding"] = timeOnlandingPage;
    transmissionResults["timePresort"] = timeOnpresortPage;
    transmissionResults["timeRefine"] = timeOnthinningPage;
    transmissionResults["timeSort"] = timeOnsortPage;

    baserowResults["r5"] = `(dateTime) ${dateString}`;
    baserowResults["r6"] = `(timeOnWelcomePage) ${timeOnlandingPage}`;
    baserowResults["r7"] = `(timeOnPresortPage) ${timeOnpresortPage}`;
    baserowResults["r8"] = `(timeOnRefinePage) ${timeOnthinningPage}`;
    baserowResults["r9"] = `(timeOnSortPage) ${timeOnsortPage}`;
  } catch (error) {
    console.log(error);
    alert("2: " + error.message);
  }

  try {
    if (configObj.setupTarget === "local") {
      transmissionResults["partId"] = localParticipantName || "no part ID";
      transmissionResults["usercode"] = localUsercode || "no usercode set";
    }

    if (configObj.showPostsort === true) {
      let timeOnpostsortPage = localStorage.getItem("timeOnpostsortPage") || "00:00:00";

      transmissionResults["timePostsort"] = timeOnpostsortPage;
      baserowResults["r10"] = `(timeOnPostsortPage) ${timeOnpostsortPage}`;
    }

    if (configObj.showSurvey === true) {
      let timeOnsurveyPage = localStorage.getItem("timeOnsurveyPage") || "00:00:00";
      transmissionResults["timeSurvey"] = timeOnsurveyPage;
      baserowResults["r11"] = `(timeOnSurveyPage) ${timeOnsurveyPage}`;
    }
  } catch (error) {
    console.log(error);
    alert("3: " + error.message);
  }

  try {
    // create r12 to r17 with presort results
    const presortObject = createPresortObject();
    const baserowObject = createBaserowObject();

    transmissionResults = {
      ...transmissionResults,
      ...presortObject,
    };

    baserowResults = {
      ...baserowResults,
      ...baserowObject,
    };
  } catch (error) {
    console.log(error);
    alert("4: " + error.message);
  }

  let baserowCounter = 20;

  try {
    // if project included POSTSORT, read in complete sorted results
    if (configObj.showPostsort) {
      const resultsPostsort = JSON.parse(localStorage.getItem("resultsPostsort")) || {};
      const newPostsortObject = calculatePostsortResults(resultsPostsort, mapObj, configObj);
      const keys = Object.keys(newPostsortObject);
      for (let i = 0; i < keys.length; i++) {
        // skip unnecessary entries
        let skipText = keys[i].substring(0, 9);
        if (skipText === "textArea-") {
          continue;
        }
        transmissionResults[keys[i]] = newPostsortObject[keys[i]];
        baserowResults[`r${baserowCounter}`] = `${keys[i]}: ${newPostsortObject[keys[i]]}`;
        baserowCounter++;
      }
    }
  } catch (error) {
    console.log(error);
    alert("5: " + error.message);
  }

  // ** IF SURVEY, read in results
  try {
    if (configObj.showSurvey && resultsSurveyFromStorage !== undefined) {
      transmissionResults = {
        ...transmissionResults,
        ...resultsSurveyFromStorage,
      };

      const keys = Object.keys(resultsSurveyFromStorage);
      for (let i = 0; i < keys.length; i++) {
        // skip unnecessary entries
        baserowResults[`r${baserowCounter}`] = `${keys[i]}: ${resultsSurveyFromStorage[keys[i]]}`;
        baserowCounter++;
      }
    }
  } catch (error) {
    console.log(error);
    alert("6: " + error.message);
  }

  let resultsSort;
  let baserowSortResults;
  try {
    // *** SORT RESULTS to obtain consistent results object
    if (
      Object.keys(resultsSortObj).length !== 0 &&
      resultsSortObj !== undefined &&
      Object.keys(resultsPresort).length !== 0 &&
      resultsPresort !== undefined
    ) {
      resultsSort = convertObjectToResults(
        // all results
        { ...resultsSortObj },
        // presort results
        { ...resultsPresort },

        configObj.traceSorts
      );

      baserowSortResults = convertObjectToBaserowResults(
        // all results
        { ...resultsSortObj },
        // presort results
        { ...resultsPresort }
      );
    }
  } catch (error) {
    console.log(error);
    alert("7: " + error.message);
  }

  try {
    transmissionResults = {
      ...transmissionResults,
      ...resultsSort,
    };

    baserowResults = {
      ...baserowResults,
      ...baserowSortResults,
    };
  } catch (error) {
    console.log(error);
    alert("8: " + error.message);
  }

  try {
    // remove null values to prevent errors
    for (const property in transmissionResults) {
      if (transmissionResults[property] === null || transmissionResults[property] === undefined) {
        transmissionResults[property] = "no data";
      }
    }
  } catch (error) {
    console.log(error);
    alert("9: " + error.message);
  }
  // }); // *** end useEffect

  // early return if data submit success event
  if (displayGoodbyeMessage === true) {
    if (configObj.linkToSecondProject === true) {
      return (
        <GoodbyeDiv>
          {linkedProjectFallbackMessage}
          <a
            id="secondProjectLink"
            href={`${configObj.secondProjectUrl}/#/?usercode=${urlUsercode}`}
            style={{ targetNew: "tab", textDecoration: "none" }}
          >
            <StyledButton>{linkedProjectBtnMessage}</StyledButton>
          </a>
        </GoodbyeDiv>
      );
    } else {
      // *** goodbye message for a normal firebase project ***
      return (
        <React.Fragment>
          <GoodbyeDiv>{goodbyeMessage}</GoodbyeDiv>
        </React.Fragment>
      );
    }
  }

  if (configObj.setupTarget === "local") {
    return (
      <React.Fragment>
        <SortTitleBar background={headerBarColor}>{pageHeader}</SortTitleBar>
        <LocalSubmitSuccessModal />
        <ContainerDiv>
          <SaveLocalDataToLocalStorageButton results={transmissionResults} />
        </ContainerDiv>
      </React.Fragment>
    );
  } else {
    // *** default to Baserow ***
    return (
      <React.Fragment>
        <SortTitleBar background={headerBarColor}>{pageHeader}</SortTitleBar>
        <ContainerDiv>
          <ContentDiv>{transferTextAbove}</ContentDiv>
          <SubmitButtonBaserow results={baserowResults} />
          {displayBelowButtonText && <ContentDiv>{transferTextBelow}</ContentDiv>}
        </ContainerDiv>
      </React.Fragment>
    );
  }
};

export default SubmitPage;

const SortTitleBar = styled.div`
  width: calc(100vw-4px);
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
`;

const ContainerDiv = styled.div`
  display: flex;
  min-height: 600px;
  width: calc(100vw-4px);
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  line-height: 1.2em;
  width: 75vw;
  font-size: 1.35em;
  padding: 25px;
  align-self: center;
`;

const GoodbyeDiv = styled.div`
  display: flex;
  width: calc(100vw -20px);
  height: calc(100vh - 50px);
  font-size: 22px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyledButton = styled.button`
  border-color: #2e6da4;
  color: white;
  font-size: 1.5em;
  font-weight: bold;
  padding: 0.25em 1em;
  border-radius: 3px;
  text-decoration: none;
  width: auto;
  height: 75px;
  justify-self: right;
  margin-right: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
  background-color: ${({ theme, active }) => (active ? theme.secondary : theme.primary)};

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.focus};
  }
  a {
    text-decoration: none;
  }
`;

/*
--- Example results object ---

{
  "projectName": "my Q study",
  "partId": "anonymous",
  "randomId": "367eee86-f28",
  "usercode": "no usercode set",
  "dateTime": "no data",
  "timeLanding": "no data",
  "timePresort": "no data",
  "timeSort": "no data",
  "timePostsort": "no data",
  "timeSurvey": "no data",
  "npos": 0,
  "nneu": 0,
  "nneg": 0,
  "column4_1": "no response",
  "column4_2": "no response",
  "columnN4_1": "no response",
  "columnN4_2": "no response",
  "sort": "no data"
}
SubmitButton.jsx:60 
*/
