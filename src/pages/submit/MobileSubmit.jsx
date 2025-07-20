import { useEffect } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import useSettingsStore from "../../globalState/useSettingsStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
// import SubmitButton from "./SubmitButtonBaserow";
import MobileSubmitButtonBaserow from "./MobileSubmitButtonBaserow";
import getCurrentDateTime from "../../utilities/getCurrentDateTime";
import mobileCalcPresortCountsObject from "./mobileCalcPresortCountsObject";
import calcPresortTraceAndSortResults from "./calcPresortTraceAndSortResults";
import useScreenOrientation from "../../utilities/useScreenOrientation";
import { v4 as uuid } from "uuid";
import createBaserowObject from "./createBaserowObject";
import calculatePostsortResults from "./calculatePostsortResults";
import convertObjectToBaserowResults from "../sort/convertObjectToBaserowResults";
import createMobilePresortResultsObject from "./createMobilePresortResultsObject";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getDisplayGoodbyeMessage = (state) => state.displayGoodbyeMessage;
const getMapObj = (state) => state.mapObj;

const MobileSort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const mapObj = useSettingsStore(getMapObj);
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const dateString = getCurrentDateTime();
  let sortResults = JSON.parse(localStorage.getItem("m_SortArray1"));
  const displayGoodbyeMessage = useStore(getDisplayGoodbyeMessage);

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

  let mobileTransmissionResults = {
    surveyFormat: "mobile",
    projectName: configObj.studyTitle || "my Q study",
    randomId: localStorage.getItem("randomId") || uuid(),
    partId: localStorage.getItem("partId") || "no part ID",
    urlUsercode: localStorage.getItem("urlUsercode") || "no usercode set",
    dateTime: dateString,
    timeLandingText: localStorage.getItem("CumulativeTimelandingPage") || "not recorded",
    timePresortText: localStorage.getItem("CumulativeTimepresortPage") || "not recorded",
    timeThinText: localStorage.getItem("CumulativeTimethinPage") || "not recorded",
    timeSortText: localStorage.getItem("CumulativeTimesortPage") || "not recorded",
  };

  let resultsSurveyFromStorage = JSON.parse(localStorage.getItem("resultsSurvey"));
  if (resultsSurveyFromStorage === undefined) {
    resultsSurveyFromStorage = {};
  }

  let randomId = localStorage.getItem("randomId") || uuid();
  let partId = localStorage.getItem("partId") || "no part ID";
  let usercode = localStorage.getItem("usercode") || "no usercode set";

  baserowResults["r1"] = randomId;
  baserowResults["r2"] = configObj.studyTitle || "my Q study";
  baserowResults["r3"] = `(partId) ${partId}`;
  baserowResults["r4"] = `(urlUsercode) ${usercode}`;

  let timeOnlandingPage = localStorage.getItem("timeOnlandingPage") || "00:00:00";
  let timeOnpresortPage = localStorage.getItem("timeOnpresortPage") || "00:00:00";
  let timeOnthinningPage = localStorage.getItem("timeOnthinningPage") || "00:00:00";
  let timeOnsortPage = localStorage.getItem("timeOnsortPage") || "00:00:00";
  let timeOnpostsortPage = localStorage.getItem("timeOnpostsortPage") || "00:00:00";
  let timeOnsurveyPage = localStorage.getItem("timeOnsurveyPage") || "00:00:00";

  baserowResults["r5"] = `(dateTime) ${dateString}`;
  baserowResults["r6"] = `(timeOnWelcomePage) ${timeOnlandingPage}`;
  baserowResults["r7"] = `(timeOnPresortPage) ${timeOnpresortPage}`;
  baserowResults["r8"] = `(timeOnRefinePage) ${timeOnthinningPage}`;
  baserowResults["r9"] = `(timeOnSortPage) ${timeOnsortPage}`;
  baserowResults["r10"] = `(timeOnPostsortPage) ${timeOnpostsortPage}`;
  baserowResults["r11"] = `(timeOnSurveyPage) ${timeOnsurveyPage}`;

  try {
    // creates r12 to r17 with presort results
    const baserowObject = createBaserowObject();

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
      baserowSortResults = convertObjectToBaserowResults(
        // all results
        { ...resultsSortObj }
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

  // add postsort and survey times if they exist
  if (configObj.showPostsort === true) {
    mobileTransmissionResults["timePostsortText"] =
      localStorage.getItem("CumulativeTimepostsortPage") || "not recorded";
  }
  if (configObj.showSurvey === true) {
    mobileTransmissionResults["timeSurveyText"] =
      localStorage.getItem("CumulativeTimesurveyPage") || "not recorded";
  }

  // get presort count numbers
  if (sortResults && sortResults.length > 0) {
    let presortCountsObject = mobileCalcPresortCountsObject([...sortResults]);
    mobileTransmissionResults = {
      ...mobileTransmissionResults,
      ...presortCountsObject,
    };
  }

  // get presort trace and sort results
  let sortCharacteristicsArray = JSON.parse(localStorage.getItem("m_SortCharacteristicsArray"));
  let formattedResults = calcPresortTraceAndSortResults(sortResults, sortCharacteristicsArray);
  mobileTransmissionResults = {
    ...mobileTransmissionResults,
    ...formattedResults,
  };

  // get postsort results
  if (configObj.showPostsort === true) {
    let postsortResults = JSON.parse(localStorage.getItem("m_PostSortResultsObj"));
    mobileTransmissionResults = {
      ...mobileTransmissionResults,
      ...postsortResults,
    };
  }

  try {
    if (configObj.showSurvey && resultsSurveyFromStorage !== undefined) {
      mobileTransmissionResults = {
        ...mobileTransmissionResults,
        ...resultsSurveyFromStorage,
      };
    }
  } catch (error) {
    console.log(error);
    alert("problem reading in survey results: " + error.message);
  }

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
          {/* {linkedProjectFallbackMessage} */}
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
