import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import useSettingsStore from "../../globalState/useSettingsStore";
import styled from "styled-components";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;

const ConsentTitleBar = () => {
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const headerBarColor = configObj.headerBarColor;

  const titleText = ReactHtmlParser(decodeHTML(langObj.consentTitleBarText)) || "";

  return (
    <ConsentTitleBarDiv data-testid="ConsentTitleBarDiv" background={headerBarColor}>
      {titleText}
    </ConsentTitleBarDiv>
  );
};

export { ConsentTitleBar };

const ConsentTitleBarDiv = styled.div`
  width: 100%;
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
`;
