import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import addNoResultToPostsortResults from "./addNoResultToPostsortResults";
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

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getMapObj = (state) => state.mapObj;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getDisplayGoodbyeMessage = (state) => state.displayGoodbyeMessage;
const getDisplayBelowButtonText = (state) => state.displayBelowButtonText;

const getStoredJSON = (key, fallback = {}) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Invalid JSON in localStorage: ${key}`, error);
    return fallback;
  }
};

const SubmitPage = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const mapObj = useSettingsStore(getMapObj);
  const setCurrentPage = useStore(getSetCurrentPage);
  const displayGoodbyeMessage = useStore(getDisplayGoodbyeMessage);
  const urlUsercode = localStorage.getItem("urlUsercode") || "";
  const displayBelowButtonText = useStore(getDisplayBelowButtonText);

  // PERSISTENT STATE
  let resultsSurveyFromStorage = getStoredJSON("resultsSurvey");

  const [showTextAbove, setShowTextAbove] = useState(true);

  const [timeData, setTimeData] = useState({
    consent: "00:00:00",
    landing: "00:00:00",
    presort: "00:00:00",
    thinning: "00:00:00",
    sort: "00:00:00",
    postsort: "00:00:00",
    survey: "00:00:00",
  });

  useEffect(() => {
    const getTimeFromStorage = (key, fallback = "00:00:00") => {
      const value = localStorage.getItem(key);
      return value !== null ? value : fallback;
    };

    const newTimeData = {
      consent: getTimeFromStorage("timeOnconsentPage"),
      landing: getTimeFromStorage("timeOnlandingPage"),
      presort: getTimeFromStorage("timeOnpresortPage"),
      thinning: getTimeFromStorage("timeOnthinningPage"),
      sort: getTimeFromStorage("timeOnsortPage"),
      postsort: getTimeFromStorage("timeOnpostsortPage"),
      survey: getTimeFromStorage("timeOnsurveyPage"),
    };

    // Apply conditional logic
    if (
      configObj.showConsentPage === false ||
      configObj.showConsentPage === "false"
    ) {
      newTimeData.consent = "n/a";
    }
    if (
      configObj.showPostsort === false ||
      configObj.showPostsort === "false"
    ) {
      newTimeData.postsort = "n/a";
    }
    if (configObj.showSurvey === false || configObj.showSurvey === "false") {
      newTimeData.survey = "n/a";
    }

    setTimeData(newTimeData);
  }, [configObj]);

  // HOOKS
  useEffect(() => {
    setCurrentPage("submit");
    localStorage.setItem("currentPage", "submit");
  }, [setCurrentPage]);

  // Language - grab translations
  const transferTextAbove =
    ReactHtmlParser(decodeHTML(langObj.transferTextAbove)) || "";
  const transferTextBelow =
    ReactHtmlParser(decodeHTML(langObj.transferTextBelow)) || "";
  const goodbyeMessage =
    ReactHtmlParser(decodeHTML(langObj.goodbyeMessage)) || "";
  const linkedProjectMessage =
    ReactHtmlParser(decodeHTML(langObj.linkedProjectMessage)) || "";
  const linkedProjectBtnMessage =
    decodeHTML(langObj.linkedProjectBtnMessage) || "";
  const pageHeader = ReactHtmlParser(decodeHTML(langObj.transferHead)) || "";

  // PERSISTENT STATE - read in results if they exist in local storage
  const resultsPresort = getStoredJSON("resultsPresort");
  const resultsSortObj = getStoredJSON("sortColumns");

  // config options
  const headerBarColor = configObj.headerBarColor;
  const dateString = getCurrentDateTime();

  // ********************************************
  // format results for transmission
  // ********************************************

  const submissionData = useMemo(() => {
    let transmissionResults = {};
    let baserowResults = {};

    let randomId = localStorage.getItem("randomId");
    if (!randomId) {
      randomId = uuid();
      localStorage.setItem("randomId", randomId);
    }

    let partId = localStorage.getItem("partId") || "no part ID";
    let usercode = localStorage.getItem("usercode") || "no usercode set";
    let creationDate = configObj.creationDate || "unknown date";

    // finish setup and format results object
    transmissionResults["projectName"] = configObj.studyTitle;
    transmissionResults["partId"] = partId;
    transmissionResults["randomId"] = randomId;
    transmissionResults["urlUsercode"] = usercode;

    baserowResults["r1"] = configObj.studyTitle
      ? `(projectName): ${configObj.studyTitle} - ${creationDate}`
      : `(projectName): my Q study - ${creationDate}`;
    baserowResults["r2"] = `(randomId): ${randomId}`;
    baserowResults["r3"] = `(partId): ${partId}`;
    baserowResults["r4"] = `(urlUsercode): ${usercode}`;
    baserowResults["r5"] = `(dateTime): ${dateString}`;
    baserowResults["r6"] = `(desktop/mobile): desktop`;
    baserowResults["r7"] = `(timeOnConsentPage): ${timeData.consent}`;
    baserowResults["r8"] = `(timeOnWelcomePage): ${timeData.landing}`;
    baserowResults["r9"] = `(timeOnPresortPage): ${timeData.presort}`;
    baserowResults["r10"] = `(timeOnRefinePage): ${timeData.thinning}`;
    baserowResults["r11"] = `(timeOnSortPage): ${timeData.sort}`;
    baserowResults["r12"] = `(timeOnPostsortPage): ${timeData.postsort}`;
    baserowResults["r13"] = `(timeOnSurveyPage): ${timeData.survey}`;

    // try {
    //   // if (configObj.setupTarget === "local") {
    //   //   transmissionResults["partId"] = localParticipantName || "no part ID";
    //   //   transmissionResults["usercode"] = localUsercode || "no usercode set";
    //   // }
    // } catch (error) {
    //   console.log(error);
    //   alert("3: " + error.message);
    // }

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

    let baserowCounter = 22;

    // if project included POSTSORT, read in complete sorted results
    if (configObj.showPostsort) {
      const resultsPostsort = getStoredJSON("resultsPostsort");

      const newPostsortObject = addNoResultToPostsortResults(
        resultsPostsort,
        mapObj,
        configObj,
      );

      const sortedResultsPostsort = Object.fromEntries(
        Object.entries(newPostsortObject).sort(([keyA], [keyB]) =>
          keyA.localeCompare(keyB),
        ),
      );

      const keys = Object.keys(sortedResultsPostsort);
      for (let i = 0; i < keys.length; i++) {
        let newKey = keys[i].split("_");
        transmissionResults[newKey[0]] = sortedResultsPostsort[keys[i]];
        baserowResults[`r${baserowCounter}`] =
          `${newKey[0]}: ${sortedResultsPostsort[keys[i]]}`;
        baserowCounter++;
      }
    }

    // ** IF SURVEY, read in results

    if (configObj.showSurvey && resultsSurveyFromStorage !== undefined) {
      transmissionResults = {
        ...transmissionResults,
        ...resultsSurveyFromStorage,
      };

      const keys = Object.keys(resultsSurveyFromStorage);
      for (let i = 0; i < keys.length; i++) {
        // skip unnecessary entries
        baserowResults[`r${baserowCounter}`] =
          `${keys[i]}: ${resultsSurveyFromStorage[keys[i]]}`;
        baserowCounter++;
      }
    }

    return {
      transmissionResults,
      baserowResults,
    };
  }, [configObj, mapObj, timeData, resultsSurveyFromStorage, dateString]);
  // ***************************************
  // end results formatting
  // ***************************************

  let resultsSort;
  let baserowSortResults;

  // *** SORT RESULTS to obtain consistent results object
  if (
    Object.keys(resultsSortObj).length !== 0 &&
    Object.keys(resultsPresort).length !== 0
  ) {
    resultsSort = convertObjectToResults(
      // all results
      { ...resultsSortObj },
      // presort results
      { ...resultsPresort },

      configObj.traceSorts,
    );

    baserowSortResults = convertObjectToBaserowResults(
      // all results
      { ...resultsSortObj },
      // presort results
      { ...resultsPresort },
    );
  }

  // FIX: these were previously bare assignments to undeclared identifiers,
  // which throws "ReferenceError: ... is not defined" in strict mode (ES modules
  // are always strict). Declared here with `let`, and `baserowResults` now reads
  // from `submissionData.baserowResults` instead of referencing itself.
  let transmissionResults = {
    ...submissionData.transmissionResults,
    ...resultsSort,
  };

  let baserowResults = {
    ...submissionData.baserowResults,
    ...baserowSortResults,
  };

  // remove null values to prevent errors
  for (const property in transmissionResults) {
    if (
      transmissionResults[property] === null ||
      transmissionResults[property] === undefined
    ) {
      transmissionResults[property] = "no data";
    }
  }

  // early return if data submit success event
  if (displayGoodbyeMessage === true) {
    if (configObj.linkToSecondProject === true) {
      return (
        <GoodbyeDiv>
          {linkedProjectMessage}
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
          {showTextAbove && <ContentDiv>{transferTextAbove}</ContentDiv>}
          <SubmitButtonBaserow
            results={baserowResults}
            setShowText={setShowTextAbove}
          />
          {displayBelowButtonText && (
            <ContentDiv>{transferTextBelow}</ContentDiv>
          )}
        </ContainerDiv>
      </React.Fragment>
    );
  }
};

export default SubmitPage;

const SortTitleBar = styled.div`
  width: calc(100vw - 4px);
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
  width: calc(100vw - 4px);
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
  width: calc(100vw - 20px);
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
  background-color: ${({ theme, active }) =>
    active ? theme.secondary : theme.primary};

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
