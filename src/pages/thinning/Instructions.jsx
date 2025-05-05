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

  console.log(props.selectedNum - props.maxNum);
  // console.log(props.maxNum);

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
  /* min-height: 270px; */
`;

const RequiredStatementsText = styled.span`
  width: 30vw;
  /* background-color: #ffec8b; */
  /* background-color: #ccffcc; */
  background-color: ${(props) => (props.selectedNum === props.maxNum ? "#3ae83a" : "#ffec8b")};
  padding: 5px;
  margin-top: 10px;
  font-style: italic;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  /* border: 2px solid red; */
`;

const CurrentlySelectedText = styled.span`
  width: 30vw;
  /* background-color: #ffec8b; */
  /* background-color: #ffe0e0; */
  /* background-color: ${(props) =>
    props.selectedNum === props.maxNum ? "#ccffcc" : "#ffec8b"}; */
  background-color: ${(props) => {
    // console.log(props);
    return props.selectedNum === props.maxNum
      ? "#3ae83a"
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
