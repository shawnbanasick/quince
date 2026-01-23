import styled from "styled-components";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import useSettingsStore from "../../globalState/useSettingsStore";

const getLangObj = (state) => state.langObj;

/* eslint react/prop-types: 0 */
const Instructions = (props) => {
  const langObj = useSettingsStore(getLangObj);
  const numStatementsToSelect = ReactHtmlParser(decodeHTML(langObj.numStatementsToSelect)) || "";
  const currentlySelectedNumber =
    ReactHtmlParser(decodeHTML(langObj.currentlySelectedNumber)) || "";

  return (
    <InstructionsText>
      <TextSection>
        {props.part1}
        {props.part2}
        {props.part3}
      </TextSection>
      <RequiredStatementsText maxNum={props.maxNum} selectedNum={props.selectedNum}>
        {`${numStatementsToSelect}: ${props.maxNum}`}{" "}
      </RequiredStatementsText>
      <CurrentlySelectedText maxNum={props.maxNum} selectedNum={props.selectedNum}>
        {`${currentlySelectedNumber}: ${props.selectedNum}`}{" "}
      </CurrentlySelectedText>
    </InstructionsText>
  );
};

export default Instructions;

const InstructionsText = styled.div`
  display: flex;
  flex-direction: column;
  width: 54vw;
  font-size: clamp(1.6rem, 1.35vw, 5rem);

  justify-content: center;
  align-items: center;
  // font-size: 1.6vw;
  font-weight: normal;
  text-align: center;
  color: black;
`;

const RequiredStatementsText = styled.span`
  width: 40vw;
  background-color: ${(props) =>
    props.selectedNum === props.maxNum ? "white" : "rgb(249, 249, 0)"};
  padding: 5px;
  margin-top: 30px;
  font-style: italic;
  font-size: clamp(1.3rem, 1.35vw, 5rem);

  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
`;

const CurrentlySelectedText = styled.span`
  width: 40vw;
  background-color: ${(props) => {
    return props.selectedNum === props.maxNum
      ? "white"
      : props.selectedNum > props.maxNum
        ? "#ff8080"
        : "rgb(249, 249, 0)";
  }};
  padding: 5px;
  margin-top: 0px;
  font-style: italic;
  font-size: clamp(1.3rem, 1.35vw, 5rem);

  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  gap: 30px;
  width: 54vw;
  justify-content: center;
  align-items: center;
  font-size: clamp(1.6rem, 1.35vw, 5rem);
  font-weight: normal;
  text-align: center;
  color: black;

  div {
    width: 50vw;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }
`;
