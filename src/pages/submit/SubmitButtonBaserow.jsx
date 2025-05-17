import React from "react";
import styled from "styled-components";
import SubmitSuccessModal from "./SubmitSuccessModal";
import SubmitFailureModal from "./SubmitFailureModal";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PromptUnload from "../../utilities/PromptUnload";
import axios from "axios";

const getLangObj = (state) => state.langObj;
const getDisplaySubmitFallback = (state) => state.displaySubmitFallback;
const getTransmittingData = (state) => state.transmittingData;
const getSetTransmittingData = (state) => state.setTransmittingData;
const getCheckInternetConnection = (state) => state.checkInternetConnection;
const getSetCheckInternetConnection = (state) => state.setCheckInternetConnection;
const getConfigObj = (state) => state.configObj;
// const getSubmitFailNumber = (state) => state.submitFailNumber;
// const getSetTrigTranFailMod = (state) => state.setTriggerTransmissionFailModal;
const getSetTrigTransOKModal = (state) => state.setTriggerTransmissionOKModal;
// const getSetDisplaySubmitFallback = (state) => state.setDisplaySubmitFallback;
const getSetDisplayGoodbyeMessage = (state) => state.setDisplayGoodbyeMessage;

const SubmitResultsButton = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  let displaySubmitFallback = useStore(getDisplaySubmitFallback);
  let transmittingData = useStore(getTransmittingData);
  const setTransmittingData = useStore(getSetTransmittingData);
  let checkInternetConnection = useStore(getCheckInternetConnection);
  const setCheckInternetConnection = useStore(getSetCheckInternetConnection);
  const configObj = useSettingsStore(getConfigObj);
  // let submitFailNumber = useStore(getSubmitFailNumber);
  // const setTriggerTransmissionFailModal = useStore(getSetTrigTranFailMod);
  const setTriggerTransmissionOKModal = useStore(getSetTrigTransOKModal);
  // const setDisplaySubmitFallback = useStore(getSetDisplaySubmitFallback);
  const setDisplayGoodbyeMessage = useStore(getSetDisplayGoodbyeMessage);

  const btnTransferText = ReactHtmlParser(decodeHTML(langObj.btnTransfer)) || "";

  const handleClick = (e) => {
    e.preventDefault();
    e.target.disabled = true;

    // setup for client-side internet connection fail case
    setTransmittingData(true);
    setCheckInternetConnection(false);
    setTimeout(() => {
      setTransmittingData(false);
      setCheckInternetConnection(true);
    }, 20000);

    console.log(JSON.stringify(props.results, null, 2));

    let token = configObj.baserowToken;
    let databaseId = configObj.baserowDatabaseIdNumber;

    if (token === undefined || token === null) {
      console.log("Baserow token is not set");
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
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setTransmittingData(false);
          setCheckInternetConnection(false);
          setDisplayGoodbyeMessage(true);
          setTriggerTransmissionOKModal(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("submission processed");
  };

  if (displaySubmitFallback === true) {
    return (
      <React.Fragment>
        <PromptUnload />
        <SubmitSuccessModal />
        <SubmitFailureModal />
        <DisabledButton tabindex="0">{btnTransferText}</DisabledButton>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <PromptUnload />
      <SubmitSuccessModal />
      <SubmitFailureModal />
      {transmittingData ? (
        <TransmittingSpin />
      ) : (
        <StyledButton tabindex="0" onClick={(e) => handleClick(e)}>
          {btnTransferText}
        </StyledButton>
      )}
      {checkInternetConnection && <WarningDiv>Check your internet connection</WarningDiv>}
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
  background-color: ${({ theme, active }) => (active ? theme.secondary : theme.primary)};

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.focus};
  }
`;

const DisabledButton = styled.button`
  border-color: lightgray;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  padding: 0.25em 1em;
  border-radius: 3px;
  text-decoration: none;
  width: 200px;
  height: 50px;
  justify-self: right;
  margin-right: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
  background-color: lightgray;
`;

const TransmittingSpin = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
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
  background-color: lightpink;
  padding: 5px;
  border-radius: 3px;
  font-weight: bold;
`;
