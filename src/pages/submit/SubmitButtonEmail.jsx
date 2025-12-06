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

const SubmitResultsButton = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const setDisableRefreshCheck = useStore(getSetDisableRefreshCheck);

  const defaultEmailClientFailText =
    ReactHtmlParser(decodeHTML(langObj.defaultEmailClientFail)) || "";
  const databaseFailText = ReactHtmlParser(decodeHTML(langObj.submitFailMessage)) || "";

  // Local State for email button visibility
  const [belowButtonMessage, setBelowButtonMessage] = useState(databaseFailText);
  const [showCopyButtons, setShowCopyButtons] = useState(false);

  const rawData = props.results;
  const emailAddress = configObj.emailAddress;
  const btnTransferText = ReactHtmlParser(decodeHTML(langObj.btnTransferEmail)) || "";

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
    // setShowCopyButtons(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    // setTransmittingData(true);
    // setCheckInternetConnection(false);
    setBelowButtonMessage(defaultEmailClientFailText);
    // create results object for transmission - * is a delimiter
    let formattedResultsTxt = "";
    for (const [key, value] of Object.entries(props.results)) {
      formattedResultsTxt = formattedResultsTxt + `${key}:| ${value} | `;
    }
    console.log("formattedResults: " + formattedResultsTxt);

    // check for internet connection
    // setTimeout(() => {
    //   setTransmittingData(false);
    //   setCheckInternetConnection(true);
    // }, 200);

    console.log(JSON.stringify(formattedResultsTxt, null, 2));

    // Pass to Email client
    if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
      // Do Chrome-related actions  -  %0D%0A is a line break
      window.open(
        `mailto:${configObj.emailAddress}?subject=${langObj.emailSubjectText}&body=${langObj.emailBodyMessage} %0D%0A%0D%0AMy Results:%0D%0A${formattedResultsTxt}`
      );
      // setShowEmailButtons(true);
      setShowCopyButtons(true);
    } else {
      // Do non-Chrome-related actions   -  %0D%0A is a line break
      window.location.href = `mailto:${configObj.emailAddress}?subject=${langObj.emailSubjectText}&body=${langObj.emailBodyMessage} %0D%0A%0D%0AMy Results:%0D%0A${formattedResultsTxt}`;
      // setShowEmailButtons(true);
      setShowCopyButtons(true);
    }
  };

  // set disable refresh check
  useEffect(() => {
    setDisableRefreshCheck(true);
  }, [setDisableRefreshCheck]);

  console.log("urlUsercode: ", props.results.urlUsercode);

  return (
    <PageContainer>
      <ContainerDiv>
        <StyledEmailButton tabindex="0" onClick={(e) => handleClick(e)}>
          {btnTransferText}
        </StyledEmailButton>
        <ContentDiv>{belowButtonMessage}</ContentDiv>
      </ContainerDiv>
      {showCopyButtons ? (
        <EmailButtonDiv>
          <ButtonContainer>
            <CopyToClipboardButton
              type={"email"}
              content={emailAddress}
              text={langObj.clipboardEmail}
            />
            <CopyToClipboardButton
              type={"results"}
              content={rawData}
              text={langObj.clipboardResults}
            />
            <DownloadContainer>
              <DownloadResultsButton onClick={(e) => handleClickDownload(e)}>
                {langObj.downloadResultsButtonText}
              </DownloadResultsButton>
            </DownloadContainer>
          </ButtonContainer>
        </EmailButtonDiv>
      ) : (
        <SpacerDiv />
      )}
    </PageContainer>
  );
};
export default SubmitResultsButton;

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
  margin-top: 30px;
  background-color: ${({ theme, active }) => (active ? theme.secondary : theme.primary)};
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
  &:focus {
    background-color: ${({ theme }) => theme.focus};
  }
`;

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  align-items: center;
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.2em;
  width: 65vw;
  font-size: 1.35em;
  align-self: center;
`;

const SpacerDiv = styled.div`
  height: 300px;
`;

const EmailButtonDiv = styled.div`
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  /* flex-wrap: wrap; */
  height: 180px;
  gap: 30px;
  justify-content: center;
  align-items: center;
`;

const DownloadResultsButton = styled.button`
  border-color: #2e6da4;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  padding: 0.25em 1em;
  border-radius: 3px;
  text-decoration: none;
  width: 220px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 50px;
  background-color: ${({ theme }) => theme.primary};
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const DownloadContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  /* border: 1px solid #2e6da4; */
`;
