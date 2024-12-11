// import { DragDropContext } from "@hello-pangea/dnd";
// import type { DropResult } from "@hello-pangea/dnd";
import React, { Component, ReactElement, useEffect } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import useSettingsStore from "../../globalState/useSettingsStore";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import { v4 as uuid } from "uuid";
// import SurveyTextElement from "./MobileSurveyTextElement";
// import SurveyTextAreaElement from "./MobileSurveyTextAreaElement";
// import SurveyRadioElement from "./MobileSurveyRadioElement";
// import SurveyDropdownElement from "./MobileSurveyDropdownElement";
// import SurveyCheckboxElement from "./MobileSurveyCheckboxElement";
// import SurveyRating2Element from "./MobileSurveyRating2Element";
// import SurveyRating5Element from "./MobileSurveyRating5Element";
// import SurveyRating10Element from "./MobileSurveyRating10Element";
// import SurveyLikertElement from "./MobileSurveyLikertElement";
import SurveyInformationElement from "./MobileSurveyInformationElement";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getSurveyQuestionObjArray = (state) => state.surveyQuestionObjArray;
const getRequiredAnswersObj = (state) => state.requiredAnswersObj;
const getSetRequiredAnswersObj = (state) => state.setRequiredAnswersObj;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getCheckReqQuesComplete = (state) => state.checkRequiredQuestionsComplete;

const MobileSort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const configObj = useSettingsStore(getConfigObj);
  const langObj = useSettingsStore(getLangObj);
  const requiredAnswersObj = useSettingsStore(getRequiredAnswersObj);
  const surveyQuestionObjArray = useSettingsStore(getSurveyQuestionObjArray);
  const setRequiredAnswersObj = useSettingsStore(getSetRequiredAnswersObj);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  const checkRequiredQuestionsComplete = useStore(getCheckReqQuesComplete);

  const headerBarColor = configObj.headerBarColor;
  const surveyQuestionObjects = surveyQuestionObjArray;

  // setup language
  const surveyHeader = ReactHtmlParser(decodeHTML(langObj.surveyHeader)) || "";

  // set next button display
  //    setDisplayNextButton(true);

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

  const SurveyQuestions = () => {
    if (!surveyQuestionObjects) {
      return <NoQuestionsDiv>No questions added.</NoQuestionsDiv>;
    } else {
      const QuestionList = surveyQuestionObjects.map((object, index) => {
        /*
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
        if (object.type === "select") {
          return (
            <SurveyDropdownElement
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
        if (object.type === "rating2") {
          return (
            <SurveyRating2Element
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
        */
        if (object.type === "information") {
          return <SurveyInformationElement key={uuid()} opts={object} />;
        }
        return null;
      });
      return QuestionList;
    }
  };

  return (
    <div>
      <SortTitleBar background={headerBarColor}>{surveyHeader}</SortTitleBar>
      <Container>
        <SurveyQuestions />
      </Container>
    </div>
  );
};

export default MobileSort;

const NoQuestionsDiv = styled.div`
  margin-top: 50px;
  font-size: 24px;
  font-weight: bold;
`;

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
  z-index: 9999;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 150px;
  margin-top: 50px;
`;
