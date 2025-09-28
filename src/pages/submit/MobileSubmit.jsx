import { useEffect, useState } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import useSettingsStore from "../../globalState/useSettingsStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import MobileSubmitButtonBaserow from "./MobileSubmitButtonBaserow";
import getCurrentDateTime from "../../utilities/getCurrentDateTime";
import useScreenOrientation from "../../utilities/useScreenOrientation";
import { v4 as uuid } from "uuid";
import createBaserowObject from "./createBaserowObject";
import mobileConvertObjectToBaserowResults from "../sort/mobileConvertObjectToBaserowResults";
import createMobilePresortResultsObject from "./createMobilePresortResultsObject";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getDisplayGoodbyeMessage = (state) => state.displayGoodbyeMessage;

const MobileSort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const dateString = getCurrentDateTime();
  let sortResults = JSON.parse(localStorage.getItem("m_SortArray1"));
  const displayGoodbyeMessage = useStore(getDisplayGoodbyeMessage);

  // console.log(JSON.stringify(sortResults, null, 2));

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
    if (configObj.showConsentPage === false || configObj.showConsentPage === "false") {
      newTimeData.consent = "n/a";
    }
    if (configObj.showPostsort === false || configObj.showPostsort === "false") {
      newTimeData.postsort = "n/a";
    }
    if (configObj.showSurvey === false || configObj.showSurvey === "false") {
      newTimeData.survey = "n/a";
    }

    setTimeData(newTimeData);
  }, [configObj]);

  // ***************
  // *** TEXT LOCALIZATION ***
  // ***************
  const mobileSortTitleBar = ReactHtmlParser(decodeHTML(langObj.mobileSortTitleBar));
  const transferTextAbove = ReactHtmlParser(decodeHTML(langObj.transferTextAbove)) || "";
  const transferTextBelow = ReactHtmlParser(decodeHTML(langObj.transferTextBelow)) || "";
  const goodbyeMessage = ReactHtmlParser(decodeHTML(langObj.goodbyeMessage)) || "";
  const screenOrientationText = ReactHtmlParser(decodeHTML(langObj.screenOrientationText)) || "";

  // PERSISTENT STATE - read in results if they exist in local storage
  const resultsPresort = JSON.parse(localStorage.getItem("m_PresortResults")) || {};
  const resultsSortObj = JSON.parse(localStorage.getItem("columnStatements")) || {};

  const m_SortCharacteristicsArray = JSON.parse(localStorage.getItem("m_SortCharacteristicsArray"));

  const presortResults = createMobilePresortResultsObject(resultsPresort);
  localStorage.setItem("resultsPresort", JSON.stringify(presortResults));

  // **********************
  // *** USE HOOKS ***************
  // **********************
  let screenOrientation = useScreenOrientation();

  useEffect(() => {
    let startTime = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("submit");
      localStorage.setItem("currentPage", "submit");
      await setProgressScore(20);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTime, "submitPage", "submitPage");
    };
  }, [setCurrentPage, setProgressScore]);

  // *******************
  // *** RESULTS PREP ***************
  // *******************

  let baserowResults = {};
  let resultsSurveyFromStorage = JSON.parse(localStorage.getItem("resultsSurvey"));
  if (resultsSurveyFromStorage === undefined) {
    resultsSurveyFromStorage = {};
  }

  let randomId = localStorage.getItem("randomId") || uuid();
  let partId = localStorage.getItem("partId") || "no part ID";
  let usercode = localStorage.getItem("usercode") || "no usercode set";
  let creationDate = configObj.creationDate || "unknown date";

  baserowResults["r1"] = configObj.studyTitle
    ? `(projectName): ${configObj.studyTitle} - ${creationDate}`
    : `(projectName): my Q study - ${creationDate}`;
  baserowResults["r2"] = `(randomId): ${randomId}`;
  baserowResults["r3"] = `(partId): ${partId}`;
  baserowResults["r4"] = `(urlUsercode): ${usercode}`;
  baserowResults["r5"] = `(dateTime): ${dateString}`;
  baserowResults["r6"] = `(desktop/mobile): mobile`;
  baserowResults["r7"] = `(timeOnConsentPage): ${timeData.consent}`;
  baserowResults["r8"] = `(timeOnWelcomePage): ${timeData.landing}`;
  baserowResults["r9"] = `(timeOnPresortPage): ${timeData.presort}`;
  baserowResults["r10"] = `(timeOnRefinePage): ${timeData.thinning}`;
  baserowResults["r11"] = `(timeOnSortPage): ${timeData.sort}`;
  baserowResults["r12"] = `(timeOnPostsortPage): ${timeData.postsort}`;
  baserowResults["r13"] = `(timeOnSurveyPage): ${timeData.survey}`;

  try {
    // creates r13 to r18 with presort results
    const baserowObject = createBaserowObject();

    baserowResults = {
      ...baserowResults,
      ...baserowObject,
    };
  } catch (error) {
    console.log(error);
    alert("4: " + error.message);
  }

  let baserowCounter = 22;

  try {
    // if project included POSTSORT, read in complete sorted results
    if (configObj.showPostsort) {
      const resultsPostsort = JSON.parse(localStorage.getItem("resultsPostsort")) || {};

      const sortedResultsPostsort = Object.fromEntries(
        Object.entries(resultsPostsort).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      );

      const keys = Object.keys(sortedResultsPostsort);

      for (let i = 0; i < keys.length; i++) {
        // skip unnecessary entries
        let skipText = keys[i].substring(0, 9);
        if (skipText === "textArea-") {
          continue;
        }

        let response = sortedResultsPostsort[keys[i]];
        if (response === "") {
          response = ` no response`;
        }
        baserowResults[`r${baserowCounter}`] = `${keys[i]}: ${response}`;
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

  // let resultsSort;
  let baserowSortResults;
  try {
    // *** SORT RESULTS to obtain consistent results object
    if (
      Object.keys(resultsSortObj).length !== 0 &&
      resultsSortObj !== undefined &&
      Object.keys(presortResults).length !== 0 &&
      presortResults !== undefined
    ) {
      // add entries "r20 and r21"
      baserowSortResults = mobileConvertObjectToBaserowResults(
        // all results
        [...sortResults],
        [...m_SortCharacteristicsArray]
      );
    }
  } catch (error) {
    console.log(error);
    alert("7: " + error.message);
  }

  try {
    baserowResults = {
      ...baserowResults,
      ...baserowSortResults,
    };
  } catch (error) {
    console.log(error);
    alert("8: " + error.message);
  }

  console.log(JSON.stringify(baserowResults, null, 2));

  // ***************
  // *** EARLY RETURNS ***************
  // ***************
  if (screenOrientation === "landscape-primary") {
    return (
      <OrientationDiv>
        <h1>{screenOrientationText}</h1>
      </OrientationDiv>
    );
  }

  if (displayGoodbyeMessage === true) {
    if (configObj.linkToSecondProject === true) {
      return (
        <GoodbyeDiv>
          {langObj.linkedProjectMessage}
          <a
            id="secondProjectLink"
            href={`${configObj.secondProjectUrl}/#/?usercode=${configObj.urlUsercode}`}
            style={{ targetNew: "tab", textDecoration: "none" }}
          >
            <StyledButton>{langObj.linkedProjectBtnMessage}</StyledButton>
          </a>
        </GoodbyeDiv>
      );
    } else {
      // *** goodbye message for a normal firebase project ***
      return (
        <>
          <GoodbyeDiv>{goodbyeMessage}</GoodbyeDiv>
        </>
      );
    }
  }

  return (
    <ScrollableContainer>
      <SortTitleBar background={configObj.headerBarColor}>{mobileSortTitleBar}</SortTitleBar>
      <MainContainer>
        <ContentDiv>{transferTextAbove}</ContentDiv>
        <MobileSubmitButtonBaserow results={baserowResults} />
        <BelowContentDiv>{transferTextBelow}</BelowContentDiv>
      </MainContainer>
    </ScrollableContainer>
  );
};

export default MobileSort;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  width: 96vw;
  margin-top: 10px;
  min-height: 80vh;
  user-select: none;
  background-color: #f3f4f6;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
`;

const SortTitleBar = styled.div`
  display: flex;
  width: 100vw;
  padding-left: 10px;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 30px;
  background-color: ${(props) => props.background};
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 4.5vw;
  user-select: none;
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 80%;
  font-size: 15px;
  padding: 25px;
  align-self: center;
`;

const BelowContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 80%;
  font-size: 14px;
  padding: 10px;
  align-self: center;
`;

const GoodbyeDiv = styled.div`
  display: flex;
  justify-self: center;
  width: 76vw;
  height: calc(100vh - 50px);
  text-align: center;
  font-size: 22px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
`;

const OrientationDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const ScrollableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 90vh; /* Set desired max height */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;

  /* Optional: Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const StyledButton = styled.button`
  grid-area: b;
  border-color: #2e6da4;
  color: white;
  font-size: 0.8em;
  font-weight: bold;
  padding: 0.25em 1em;
  border-radius: 3px;
  text-decoration: none;
  width: fit-content;
  height: 50px;
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
`;
