import { useEffect, useRef } from "react";
import styled from "styled-components";
import LogInSubmitButton from "./LogInSubmitButton";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getDisplayAccessCodeWarning = (state) => state.displayAccessCodeWarning;
const getUserInputAccessCode = (state) => state.userInputAccessCode;
const getSetDisplayLandingContent = (state) => state.setDisplayLandingContent;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetIsLoggedIn = (state) => state.setIsLoggedIn;
const getSetUserInputAccessCode = (state) => state.setUserInputAccessCode;
const getSetDisplayAccessCodeWarning = (state) =>
  state.setDisplayAccessCodeWarning;

const WARNING_DURATION_MS = 3000;

const AccessCodeScreen = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const displayAccessCodeWarning = useStore(getDisplayAccessCodeWarning);
  const userInputAccessCode = useStore(getUserInputAccessCode);
  const setDisplayLandingContent = useStore(getSetDisplayLandingContent);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  const setIsLoggedIn = useStore(getSetIsLoggedIn);
  const setUserInputAccessCode = useStore(getSetUserInputAccessCode);
  const setDisplayAccessCodeWarning = useStore(getSetDisplayAccessCodeWarning);

  // Keep the latest input value available to the keyup handler without
  // needing to re-subscribe the window listener on every keystroke.
  const userInputAccessCodeRef = useRef(userInputAccessCode);
  useEffect(() => {
    userInputAccessCodeRef.current = userInputAccessCode;
  }, [userInputAccessCode]);

  // Track the pending "hide warning" timeout so it can be cancelled if the
  // component unmounts or a new submit attempt comes in before it fires.
  const warningTimeoutRef = useRef(null);

  // Language
  const loginHeaderText =
    ReactHtmlParser(decodeHTML(langObj.loginHeaderText)) || "";
  const accessInputText =
    ReactHtmlParser(decodeHTML(langObj.accessInputText)) || "";
  const accessCodeWarning =
    ReactHtmlParser(decodeHTML(langObj.accessCodeWarning)) || "";

  const handleAccess = (e) => {
    setUserInputAccessCode(e.target.value);
  };

  const handleSubmit = () => {
    const projectAccessCode = configObj.accessCode;
    const userAccessOK = userInputAccessCodeRef.current === projectAccessCode;

    if (userAccessOK) {
      setDisplayLandingContent(true);
      setDisplayNextButton(true);
      setIsLoggedIn(true);
      return;
    }

    // invalid input ==> display warning, clearing any warning already in flight
    setDisplayAccessCodeWarning(true);
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    warningTimeoutRef.current = setTimeout(() => {
      setDisplayAccessCodeWarning(false);
      warningTimeoutRef.current = null;
    }, WARNING_DURATION_MS);
  };

  useEffect(() => {
    setDisplayNextButton(false);

    const handleKeyUpStart = (event) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keyup", handleKeyUpStart);

    return () => window.removeEventListener("keyup", handleKeyUpStart);
    // handleSubmit reads from refs/store setters, so it's intentionally
    // omitted here to avoid re-attaching the listener on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDisplayNextButton]);

  // Clear any pending warning timeout on unmount to avoid calling
  // setState on an unmounted component.
  useEffect(() => {
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Container>
      <div>
        <h2>{loginHeaderText}</h2>
        <StyledHr />
      </div>
      <div>
        <h3>{accessInputText}</h3>
        <StyledInputDiv>
          <StyledInput
            onChange={handleAccess}
            type="text"
            autoFocus
            data-testid="accessCodeInputDiv"
          />
          {displayAccessCodeWarning && (
            <WarningText>{accessCodeWarning}</WarningText>
          )}
        </StyledInputDiv>
      </div>

      <LogInSubmitButton
        data-testid="submitButtonAccess"
        onClick={handleSubmit}
        size={"1.5em"}
        width={"200px"}
        height={"50px"}
      />
    </Container>
  );
};

export default AccessCodeScreen;

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  margin-top: 50px;
  width: 50vw;
  padding: 1.5vw;
  min-height: 300px;
  margin-bottom: 200px;
  border: 2px solid black;
  justify-self: center;
  background-color: whitesmoke;
`;

const StyledHr = styled.hr`
  margin-top: 5px;
  margin-bottom: 30px;
`;

const StyledInput = styled.input`
  margin-top: 5px;
  width: 400px;
  height: 30px;
  font-size: 1.4em;
  padding-left: 5px;
`;

const StyledInputDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const WarningText = styled.div`
  color: red;
  font-weight: bold;
  font-size: 1.4em;
  margin-left: 10px;
`;
