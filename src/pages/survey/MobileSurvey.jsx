import { useEffect } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import useSettingsStore from "../../globalState/useSettingsStore";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import { v4 as uuid } from "uuid";
import SurveyTextElement from "./MobileSurveyTextElement";
import SurveyTextAreaElement from "./MobileSurveyTextAreaElement";
import SurveyRadioElement from "./MobileSurveyRadioElement";
import SurveyDropdownElement from "./MobileSurveyDropdownElement";
import SurveyCheckboxElement from "./MobileSurveyCheckboxElement";
import SurveyRating2Element from "./MobileSurveyRating2Element";
import SurveyRating5Element from "./MobileSurveyRating5Element";
import SurveyRating10Element from "./MobileSurveyRating10Element";
import SurveyLikertElement from "./MobileSurveyLikertElement";
import SurveyInformationElement from "./MobileSurveyInformationElement";
import MobileSurveyPreventNavModal from "./MobileSurveyPreventNavModal";
import HelpSymbol from "../../assets/helpSymbol.svg?react";
import MobileSurveyHelpModal from "./MobileSurveyHelpModal";
import useScreenOrientation from "../../utilities/useScreenOrientation";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getSurveyQuestionObjArray = (state) => state.surveyQuestionObjArray;
const getRequiredAnswersObj = (state) => state.requiredAnswersObj;
const getSetRequiredAnswersObj = (state) => state.setRequiredAnswersObj;
// const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getCheckReqQuesComplete = (state) => state.checkRequiredQuestionsComplete;
const getSetTriggerMobileSurveyHelpModal = (state) =>
  state.setTriggerMobileSurveyHelpModal;

const MobileSurvey = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const configObj = useSettingsStore(getConfigObj);
  const langObj = useSettingsStore(getLangObj);
  const requiredAnswersObj = useSettingsStore(getRequiredAnswersObj);
  const surveyQuestionObjArray = useSettingsStore(getSurveyQuestionObjArray);
  const setRequiredAnswersObj = useSettingsStore(getSetRequiredAnswersObj);
  const checkRequiredQuestionsComplete = useStore(getCheckReqQuesComplete);
  const setTriggerMobileSurveyHelpModal = useStore(
    getSetTriggerMobileSurveyHelpModal
  );

  const headerBarColor = configObj.headerBarColor;
  const surveyQuestionObjects = surveyQuestionObjArray;
  // ******************
  // *** TEXT LOCALIZATION *******
  // ******************
  const surveyHeader = ReactHtmlParser(decodeHTML(langObj.surveyHeader)) || "";
  const screenOrientationText =
    ReactHtmlParser(decodeHTML(langObj.screenOrientationText)) || "";

  // ***********************
  // *** USE HOOKS ***************
  // ***********************
  let screenOrientation = useScreenOrientation();

  useEffect(() => {
    // reset required questions if page return
    let keys = Object.keys(requiredAnswersObj);
    for (let i = 0; i < keys.length; i++) {
      requiredAnswersObj[keys[i]] = "no response";
    }
    setRequiredAnswersObj(requiredAnswersObj);
  }, [setRequiredAnswersObj, requiredAnswersObj]);

  // setup time on page and navigation
  useEffect(() => {
    let startTime = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("survey");
      localStorage.setItem("currentPage", "survey");
      await setProgressScore(20);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTime, "surveyPage", "surveyPage");
    };
  }, [setCurrentPage, setProgressScore]);

  // ***********************
  // *** EVENT HANDLERS ***************
  // ***********************
  const displayHelpModal = () => {
    console.log("clicked help");
    setTriggerMobileSurveyHelpModal(true);
  };

  // ***********************
  // *** ELEMENTS ***************
  // ***********************
  const SurveyQuestions = () => {
    if (!surveyQuestionObjects) {
      return <NoQuestionsDiv>No questions added.</NoQuestionsDiv>;
    } else {
      const QuestionList = surveyQuestionObjects.map((object, index) => {
        if (object.type === "text") {
          return (
            <SurveyTextElement
              key={uuid()}
              check={checkRequiredQuestionsComplete}
              opts={object}
            />
          );
        }
        if (object.type === "textarea") {
          return (
            <SurveyTextAreaElement
              key={uuid()}
              check={checkRequiredQuestionsComplete}
              opts={object}
            />
          );
        }
        if (object.type === "radio") {
          return (
            <SurveyRadioElement
              key={uuid()}
              check={checkRequiredQuestionsComplete}
              opts={object}
            />
          );
        }
        if (object.type === "checkbox") {
          return (
            <SurveyCheckboxElement
              key={uuid()}
              check={checkRequiredQuestionsComplete}
              opts={object}
            />
          );
        }
        if (object.type === "select") {
          return (
            <SurveyDropdownElement
              key={uuid()}
              check={checkRequiredQuestionsComplete}
              opts={object}
            />
          );
        }
        if (object.type === "likert") {
          return (
            <SurveyLikertElement
              key={uuid()}
              check={checkRequiredQuestionsComplete}
              opts={object}
            />
          );
        }

        if (object.type === "rating2") {
          return (
            <SurveyRating2Element
              key={uuid()}
              check={checkRequiredQuestionsComplete}
              opts={object}
            />
          );
        }
        if (object.type === "rating5") {
          return (
            <SurveyRating5Element
              key={uuid()}
              check={checkRequiredQuestionsComplete}
              opts={object}
            />
          );
        }
        if (object.type === "rating10") {
          return (
            <SurveyRating10Element
              key={uuid()}
              check={checkRequiredQuestionsComplete}
              opts={object}
            />
          );
        }

        if (object.type === "information") {
          return <SurveyInformationElement key={uuid()} opts={object} />;
        }
        return null;
      });
      return QuestionList;
    }
  };

  // **************************
  // *** EARLY RETURNS ***************
  // **************************
  if (screenOrientation === "landscape-primary") {
    return (
      <OrientationDiv>
        <h1>{screenOrientationText}</h1>
      </OrientationDiv>
    );
  }

  return (
    <div>
      <SortTitleBar background={headerBarColor}>
        {surveyHeader}
        <HelpContainer onClick={displayHelpModal}>
          <HelpSymbol />
        </HelpContainer>
      </SortTitleBar>
      <MobileSurveyPreventNavModal style={{ marginTop: "50px" }} />
      <MobileSurveyHelpModal />
      <Container>
        <SurveyQuestions />
      </Container>
    </div>
  );
};

export default MobileSurvey;

const NoQuestionsDiv = styled.div`
  margin-top: 50px;
  font-size: 24px;
  font-weight: bold;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  padding-bottom: 150px;
  width: 90%;
  height: 80vh;
  /* border: 1px solid red; */
  overflow-x: hidden;
  overflow-y: auto;
`;

const HelpContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 5px;
  align-items: center;
  padding-bottom: 5px;
  width: 20px;
  height: 20px;
  color: black;
  font-size: 2.5vh;
  font-weight: bold;
  user-select: none;
`;

const OrientationDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
