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
      {props.part1}
      {` `}
      {props.part2}
      {` `}
      {props.part3}
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
  width: 60vw;
  justify-content: center;
  align-items: center;
  font-size: 1.6vw;
  font-weight: normal;
  text-align: center;
  color: black;
`;

const RequiredStatementsText = styled.span`
  width: 30vw;
  background-color: ${(props) => (props.selectedNum === props.maxNum ? "#ccffcc" : "#ffec8b")};
  padding: 5px;
  margin-top: 10px;
  font-style: italic;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
`;

const CurrentlySelectedText = styled.span`
  width: 30vw;
  background-color: ${(props) => {
    return props.selectedNum === props.maxNum
      ? "#ccffcc"
      : props.selectedNum > props.maxNum
      ? "#f90606"
      : "#ffec8b";
  }};
  padding: 5px;
  margin-top: 0px;
  font-style: italic;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`;
