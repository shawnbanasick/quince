import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import SubmitSuccessModal from "./SubmitSuccessModal";
import SubmitFailureModal from "./SubmitFailureModal";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PromptUnload from "../../utilities/PromptUnload";
import axios from "axios";
import MobileSubmitButtonEmail from "./MobileSubmitButtonEmail";

const getLangObj = (state) => state.langObj;
const getTransmittingData = (state) => state.transmittingData;
const getSetTransmittingData = (state) => state.setTransmittingData;
const getCheckInternetConnection = (state) => state.checkInternetConnection;
const getSetCheckInternetConnection = (state) =>
  state.setCheckInternetConnection;
const getConfigObj = (state) => state.configObj;
const getSetTrigTransOKModal = (state) => state.setTriggerTransmissionOKModal;
const getSetDisplayGoodbyeMessage = (state) => state.setDisplayGoodbyeMessage;
const getSetDisplayBelowButtonText = (state) => state.setDisplayBelowButtonText;

const SubmitResultsButton = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  let transmittingData = useStore(getTransmittingData);
  const setTransmittingData = useStore(getSetTransmittingData);
  let checkInternetConnection = useStore(getCheckInternetConnection);
  const setCheckInternetConnection = useStore(getSetCheckInternetConnection);
  const configObj = useSettingsStore(getConfigObj);
  const setTriggerTransmissionOKModal = useStore(getSetTrigTransOKModal);
  const setDisplayGoodbyeMessage = useStore(getSetDisplayGoodbyeMessage);
  const checkInternetMessage =
    ReactHtmlParser(decodeHTML(langObj.checkInternetMessage)) || "";
  const setDisplayBelowButtonText = useStore(getSetDisplayBelowButtonText);

  const btnTransferText =
    ReactHtmlParser(decodeHTML(langObj.btnTransfer)) || "";

  const [failureCount, setFailureCount] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Track timers so we can clear them on unmount / re-trigger, instead of
  // letting them fire against a component that's no longer on screen.
  const connectionTimeoutRef = useRef(null);
  const failureTimeoutRef = useRef(null);

  // Clean up any in-flight timers if the component unmounts before they fire.
  useEffect(() => {
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (failureTimeoutRef.current) {
        clearTimeout(failureTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (failureCount > 1) {
      setCheckInternetConnection(false);
    }
  }, [failureCount, setCheckInternetConnection]);

  const handleClick = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setDisplayBelowButtonText(true);
    // setup for client-side internet connection fail case
    setTransmittingData(true);
    setCheckInternetConnection(false);

    connectionTimeoutRef.current = setTimeout(() => {
      setTransmittingData(false);
      setCheckInternetConnection(true);
      setDisplayBelowButtonText(false);
    }, 10000);

    let token = configObj.baserowToken;
    let databaseId = configObj.baserowDatabaseIdNumber;

    if (token === undefined || token === null) {
      console.log("Baserow token is not set");
      setButtonDisabled(false);
      return;
    }

    if (databaseId === undefined || databaseId === null) {
      console.log("Baserow database id is not set");
      setButtonDisabled(false);
      return;
    }

    axios({
      method: "POST",
      url: `https://api.baserow.io/api/database/rows/table/${databaseId}/?user_field_names=true`,
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      data: props.results,
    })
      .then(() => {
        clearTimeout(connectionTimeoutRef.current);
        setTransmittingData(false);
        setCheckInternetConnection(false);
        setDisplayGoodbyeMessage(true);
        setTriggerTransmissionOKModal(true);
      })
      .catch((error) => {
        console.log(error);
        // Clear the fallback timer too
        clearTimeout(connectionTimeoutRef.current);
        setTransmittingData(false);
        setButtonDisabled(false);

        failureTimeoutRef.current = setTimeout(() => {
          setFailureCount((prev) => prev + 1);
        }, 10000);
      });
  };

  return (
    <React.Fragment>
      <PromptUnload />
      <SubmitSuccessModal />
      <SubmitFailureModal />
      {transmittingData ? (
        <TransmittingSpin />
      ) : (
        <StyledButton
          tabIndex="0"
          disabled={buttonDisabled}
          onClick={(e) => handleClick(e)}
        >
          {btnTransferText}
        </StyledButton>
      )}
      {checkInternetConnection && (
        <WarningDiv>{checkInternetMessage}</WarningDiv>
      )}
      {failureCount > 1 && (
        <DownloadEmailFallback>
          <MobileSubmitButtonEmail results={props.results} />
        </DownloadEmailFallback>
      )}
    </React.Fragment>
  );
};
export default SubmitResultsButton;

const StyledButton = styled.button`
  border-color: #2e6da4;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  padding: 0.25em 1em;
  border-radius: 3px;
  text-decoration: none;
  width: auto;
  height: 50px;
  justify-self: right;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
  background-color: ${({ theme, active }) =>
    active ? theme.secondary : theme.primary};

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.focus};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TransmittingSpin = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  margin-top: 30px;
  margin-bottom: 20px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #337ab7;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }
`;

const WarningDiv = styled.div`
  display: flex;
  padding-top: 30px;
  justify-content: center;
  align-items: center;
  width: 70vw;
  height: fit-content;
  font-size: 0.9em;
  text-align: center;
  background-color: #ffc067;
  padding: 5px;
  margin-bottom: 30px;
  border-radius: 10px;
  font-weight: bold;
`;

const DownloadEmailFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70vw;
  height: fit-content;
  font-size: 0.8em;
  text-align: center;
  background-color: #ffc067;
  margin-bottom: 30px;
  padding: 5px;
  border-radius: 10px;
  font-weight: bold;
`;
