import { useEffect } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import useSettingsStore from "../../globalState/useSettingsStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import SubmitButton from "./SubmitButton";
import getCurrentDateTime from "../../utilities/getCurrentDateTime";
import mobileCalcPresortCountsObject from "./mobileCalcPresortCountsObject";
import calcPresortTraceAndSortResults from "./calcPresortTraceAndSortResults";
import useScreenOrientation from "../../utilities/useScreenOrientation";

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

  // ***************
  // *** TEXT LOCALIZATION ***
  // ***************
  const mobileSortTitleBar = ReactHtmlParser(
    decodeHTML(langObj.mobileSortTitleBar)
  );
  const transferTextAbove =
    ReactHtmlParser(decodeHTML(langObj.transferTextAbove)) || "";
  const transferTextBelow =
    ReactHtmlParser(decodeHTML(langObj.transferTextBelow)) || "";
  const goodbyeMessage =
    ReactHtmlParser(decodeHTML(langObj.goodbyeMessage)) || "";
  const screenOrientationText =
    ReactHtmlParser(decodeHTML(langObj.screenOrientationText)) || "";

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
  let mobileTransmissionResults = {
    surveyFormat: "mobile",
    projectName: configObj.studyTitle || "my Q study",
    partId: localStorage.getItem("partId") || "no part ID",
    randomId: localStorage.getItem("randomId") || "no random ID",
    urlUsercode: localStorage.getItem("urlUsercode") || "no usercode set",
    dateTime: dateString,
    // timeLanding: localStorage.getItem("timeOnlandingPage") || "not recorded",
    timeLandingText:
      localStorage.getItem("CumulativeTimelandingPage") || "not recorded",
    // timePresort: localStorage.getItem("timeOnpresortPage") || "not recorded",
    timePresortText:
      localStorage.getItem("CumulativeTimepresortPage") || "not recorded",
    // timeThin: localStorage.getItem("timeOnThinPage") || "not recorded",
    timeThinText:
      localStorage.getItem("CumulativeTimethinPage") || "not recorded",
    // timeSort: localStorage.getItem("timeOnsortPage") || "not recorded",
    timeSortText:
      localStorage.getItem("CumulativeTimesortPage") || "not recorded",
  };
  let resultsSurveyFromStorage = JSON.parse(
    localStorage.getItem("resultsSurvey")
  );
  if (resultsSurveyFromStorage === undefined) {
    resultsSurveyFromStorage = {};
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
  let sortCharacteristicsArray = JSON.parse(
    localStorage.getItem("m_SortCharacteristicsArray")
  );
  let formattedResults = calcPresortTraceAndSortResults(
    sortResults,
    sortCharacteristicsArray
  );
  mobileTransmissionResults = {
    ...mobileTransmissionResults,
    ...formattedResults,
  };

  // get postsort results
  if (configObj.showPostsort === true) {
    let postsortResults = JSON.parse(
      localStorage.getItem("m_PostSortResultsObj")
    );
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
    // if (configObj.linkToSecondProject === true) {
    //   return (
    //     <GoodbyeDiv>
    //       {linkedProjectFallbackMessage}
    //       <a
    //         id="secondProjectLink"
    //         href={`${configObj.secondProjectUrl}/#/?usercode=${urlUsercode}`}
    //         style={{ targetNew: "tab", textDecoration: "none" }}
    //       >
    //         <StyledButton>{linkedProjectBtnMessage}</StyledButton>
    //       </a>
    //     </GoodbyeDiv>
    //   );
    // } else {
    // *** goodbye message for a normal firebase project ***
    return (
      <>
        <GoodbyeDiv>{goodbyeMessage}</GoodbyeDiv>
      </>
    );
  }
  // }

  return (
    <>
      <SortTitleBar background={configObj.headerBarColor}>
        {mobileSortTitleBar}
      </SortTitleBar>
      <MainContainer>
        <ContentDiv>{transferTextAbove}</ContentDiv>
        <SubmitButton results={mobileTransmissionResults} />
        <ContentDiv>{transferTextBelow}</ContentDiv>
      </MainContainer>
    </>
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
