import { useState, useEffect } from "react";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import CopyToClipboardButton from "./CopyToClipboardButton";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getSetDisableRefreshCheck = (state) => state.setDisableRefreshCheck;

const SubmitResultsButtonEmail = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const setDisableRefreshCheck = useStore(getSetDisableRefreshCheck);

  // LANGUAGE STRINGS
  const defaultEmailClientFailText =
    ReactHtmlParser(decodeHTML(langObj.defaultEmailClientFail)) || "";
  const databaseFailText =
    ReactHtmlParser(decodeHTML(langObj.submitFailMessage)) || "";
  const databaseFailText2 =
    ReactHtmlParser(decodeHTML(langObj.submitFailMessage2)) || "";
  const databaseFailText3 =
    ReactHtmlParser(decodeHTML(langObj.submitFailMessage3)) || "";
  const unableToConnectText =
    ReactHtmlParser(decodeHTML(langObj.unableToConnect)) || "";

  // Local State for email button visibility
  const [belowButtonMessage, setBelowButtonMessage] =
    useState(databaseFailText);

  // PROPS
  const rawData = props.results;
  const emailAddress = configObj.emailAddress;
  const btnTransferText =
    ReactHtmlParser(decodeHTML(langObj.btnTransferEmail)) || "";

  // HANDLE DOWNLOAD
  const handleClickDownload = (e) => {
    e.preventDefault();
    const formattedResultsTxt = Object.entries(props.results)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const blob = new Blob([formattedResultsTxt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my_Q-sort_results.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setBelowButtonMessage(defaultEmailClientFailText);
    // create results object for transmission - * is a delimiter
    let formattedResultsTxt = "";
    for (const [key, value] of Object.entries(props.results)) {
      formattedResultsTxt = formattedResultsTxt + `${key}:| ${value} | `;
    }

    // Pass to Email client
    if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
      // Do Chrome-related actions  -  %0D%0A is a line break
      window.open(
        `mailto:${configObj.emailAddress}?subject=${langObj.emailSubjectText}`,
      );
      // setShowEmailButtons(true);
    } else {
      // Do non-Chrome-related actions   -  %0D%0A is a line break
      window.location.href = `mailto:${configObj.emailAddress}?subject=${langObj.emailSubjectText}`;
      // setShowEmailButtons(true);
    }
  };

  // set disable refresh check
  useEffect(() => {
    setDisableRefreshCheck(true);
  }, [setDisableRefreshCheck]);

  return (
    <PageContainer>
      <UnableText>{unableToConnectText}</UnableText>
      {belowButtonMessage} ({emailAddress})
      <StyledEmailButton tabindex="0" onClick={(e) => handleClick(e)}>
        {btnTransferText}
      </StyledEmailButton>
      <FailText2Div>{databaseFailText2}</FailText2Div>
      <CopyToClipboardButton
        type={"results"}
        content={rawData}
        text={langObj.clipboardResults}
      />
      <FailText2Div>{databaseFailText3}</FailText2Div>
      <DownloadResultsButton onClick={(e) => handleClickDownload(e)}>
        {langObj.downloadResultsButtonText}
      </DownloadResultsButton>
    </PageContainer>
  );
};
export default SubmitResultsButtonEmail;

const StyledEmailButton = styled.button`
  display: flex;
  border-color: #2e6da4;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  padding: 0.25em 1em;
  border-radius: 3px;
  text-decoration: none;
  width: auto;
  height: 50px;
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

const UnableText = styled.div`
  text-align: center;
  width: 70%;
  font-weight: bold;
  font-size: 2.2em;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
`;

const DownloadResultsButton = styled.button`
  border-color: #2e6da4;
  color: white;
  font-weight: bold;
  padding: 0.25em 1em;
  border-radius: 3px;
  text-decoration: none;
  width: auto;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.primary};
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const FailText2Div = styled.div`
  text-align: center;
  width: 70%;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  font-size: 1.4em;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;
