import styled from "styled-components";
import useStore from "../../globalState/useStore";
import useSettingsStore from "../../globalState/useSettingsStore";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";

const getMobilePresortFontSize = (state) => state.mobilePresortFontSize;

const getLangObj = (state) => state.langObj;

const MobileStatementBox = (props) => {
  const mobilePresortFontSize = useStore(getMobilePresortFontSize);
  const langObj = useSettingsStore(getLangObj);
  let defautStatement =
    ReactHtmlParser(decodeHTML(langObj?.mobilePresortEvaluationsComplete)) ||
    "";

  let statement = props.statement || defautStatement;

  if (statement === null || statement === undefined) {
    statement = langObj?.mobilePresortEvaluationsComplete;
  }

  return (
    <Container color={props.backgroundColor} fontSize={mobilePresortFontSize}>
      {statement}
    </Container>
  );
};

export default MobileStatementBox;

const Container = styled.div`
  display: flex;
  align-self: center;
  justify-self: center;
  /* background-color: #e5e5e5; */
  background-color: ${(props) => {
    return props.color;
  }};
  width: 80vw;
  height: fit-content;
  min-height: 14vh;
  font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }};
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  text-align: center;
  padding: 15px 10px 15px 10px;
  border: 1px solid black;
`;
