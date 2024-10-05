import styled from "styled-components";
import React from "react";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";

const getLangObj = (state) => state.langObj;

const LocalSortsDownloadButton = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);

  const localDownloadButtonText =
    ReactHtmlParser(decodeHTML(langObj.localDownloadButtonText)) || "";

  return (
    <StyledSubmitButton tabindex="0" type="submit" onClick={props.onClick}>
      {localDownloadButtonText}
    </StyledSubmitButton>
  );
};
export default LocalSortsDownloadButton;

const StyledSubmitButton = styled.button`
  border-color: #2e6da4;
  color: white;
  font-size: 1.5em;
  font-weight: bold;
  padding: 0.25em 1em;
  border-radius: 3px;
  text-decoration: none;
  width: auto;
  height: 50px;
  justify-self: right;
  align-self: end;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, active }) =>
    active ? theme.secondary : theme.primary};

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.focus};
  }
`;
