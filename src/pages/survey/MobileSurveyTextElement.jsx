import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import sanitizeString from "../../utilities/sanitizeString";
import useLocalStorage from "../../utilities/useLocalStorage";

const SurveyTextElement = (props) => {
  // HELPER FUNCTION
  const asyncLocalStorage = {
    async setItem(name, value) {
      await null;
      return localStorage.setItem(name, value);
    },
  };

  // PROPS
  let questionId = `itemNum${props.opts.itemNum}`;
  const checkRequiredQuestionsComplete = props.check;
  const labelText = ReactHtmlParser(decodeHTML(props.opts.label)) || "";
  const placeholder = ReactHtmlParser(decodeHTML(props.opts.placeholder)) || "";
  const noteText = ReactHtmlParser(decodeHTML(props.opts.note)) || "";
  let displayNoteText = true;
  if (noteText.length < 1 || noteText === "") {
    displayNoteText = false;
  }

  // PERSISTENT STATE
  const [userText, setUserText] = useLocalStorage(questionId, "");

  // LOCAL STATE
  const [formatOptions, setFormatOptions] = useState({
    bgColor: "whitesmoke",
    border: "none",
  });

  // event handler
  const handleOnChange = (e) => {
    const resultsSurvey = JSON.parse(localStorage.getItem("resultsSurvey"));
    let value = e.target.value;
    let valueLen = value.length;
    // restrict to numbers (from config.xml)
    if (props.opts.restricted === "true" || props.opts.restricted === true) {
      value = value.replace(/\D/g, "");
    }
    // limit length (from config.xml)
    if (props.opts.limited === "true" || props.opts.limited === true) {
      if (value.length > +props.opts.limitLength) {
        value = value.substring(0, +props.opts.limitLength);
      }
    }
    setUserText(value);
    // record if answered or not
    if (valueLen > 0) {
      let sanitizedText = sanitizeString(value);
      resultsSurvey[`itemNum${props.opts.itemNum}`] = sanitizedText;
    } else {
      // for when participant deletes their answer after entering it
      if (props.opts.required === true || props.opts.required === "true") {
        resultsSurvey[`itemNum${props.opts.itemNum}`] = "no-*?*-response";
      } else {
        resultsSurvey[`itemNum${props.opts.itemNum}`] = "no response";
      }
    }
    asyncLocalStorage.setItem("resultsSurvey", JSON.stringify(resultsSurvey));
  }; // End event handler

  useEffect(() => {
    let userTextLen = false;
    if (userText.length > 0 && userText !== "") {
      userTextLen = true;
    }
    if (
      checkRequiredQuestionsComplete === true &&
      userTextLen < 1 &&
      props.opts.required === true
    ) {
      setFormatOptions({
        bgColor: "rgba(253, 224, 71, .5)",
        border: "3px dashed black",
      });
    } else {
      setFormatOptions({
        bgColor: "whitesmoke",
        border: "none",
      });
    }
  }, [checkRequiredQuestionsComplete, userText, props]);

  if (displayNoteText) {
    return (
      <Container bgColor={formatOptions.bgColor} border={formatOptions.border}>
        <TitleBar>
          <div>{labelText}</div>
        </TitleBar>
        <NoteText id="noteText">
          <div>{noteText}</div>
        </NoteText>
        <TextInput
          type="text"
          value={userText}
          placeholder={placeholder}
          onChange={handleOnChange}
        />
      </Container>
    );
  } else {
    return (
      <Container bgColor={formatOptions.bgColor} border={formatOptions.border}>
        <TitleBar>
          <div>{labelText}</div>
        </TitleBar>
        <TextInput
          type="text"
          value={userText}
          placeholder={placeholder}
          onChange={handleOnChange}
        />
      </Container>
    );
  }
};

export default SurveyTextElement;

const Container = styled.div`
  width: 90%;
  padding: 20px;
  margin-left: 20px;
  margin-right: 20px;
  max-width: 1300px;
  background-color: ${(props) => props.bgColor};
  outline: ${(props) => props.border};
  outline-offset: -3px;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  min-height: 30px;
  font-size: 12px;
  text-align: center;
  width: 100%;
  border-radius: 3px;
  background-color: lightgray;
`;

const NoteText = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  vertical-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
  min-height: 30px;
  font-size: 12px;
  text-align: center;
  background-color: whitesmoke;
  width: 100%;
  border-radius: 3px;
`;

const TextInput = styled.input`
  display: flex;
  justify-content: left;
  align-items: center;
  vertical-align: center;
  height: 30px;
  font-size: 12px;
  background-color: white;
  width: 100%;
  border-radius: 3px;
  border: 2px solid lightgray;
  padding-left: 5px;
  padding-right: 5px;
`;
