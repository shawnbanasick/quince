import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import LogInSubmitButton from "./LogInSubmitButton";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getDisplayAccessCodeWarning = (state) => state.displayAccessCodeWarning;
const getDisplayPartIdWarning = (state) => state.displayPartIdWarning;
const getSetUserInputPartId = (state) => state.setUserInputPartId;
const getSetUserInputAccessCode = (state) => state.setUserInputAccessCode;
const getUserInputPartId = (state) => state.userInputPartId;
const getUserInputAccessCode = (state) => state.userInputAccessCode;
const getSetDisplayLandingContent = (state) => state.setDisplayLandingContent;
const getSetPartId = (state) => state.setPartId;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetIsLoggedIn = (state) => state.setIsLoggedIn;
const getSetDisplayAccessCodeWarning = (state) =>
  state.setDisplayAccessCodeWarning;
const getSetDisplayPartIdWarning = (state) => state.setDisplayPartIdWarning;

const LogInScreen = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const displayAccessCodeWarning = useStore(getDisplayAccessCodeWarning);
  const displayPartIdWarning = useStore(getDisplayPartIdWarning);
  const setUserInputPartId = useStore(getSetUserInputPartId);
  const setUserInputAccessCode = useStore(getSetUserInputAccessCode);
  const userInputPartId = useStore(getUserInputPartId);
  const userInputAccessCode = useStore(getUserInputAccessCode);
  const setDisplayLandingContent = useStore(getSetDisplayLandingContent);
  const setPartId = useStore(getSetPartId);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  const setIsLoggedIn = useStore(getSetIsLoggedIn);
  const setDisplayAccessCodeWarning = useStore(getSetDisplayAccessCodeWarning);
  const setDisplayPartIdWarning = useStore(getSetDisplayPartIdWarning);

  // refs to track pending warning timeouts so we can clear them on unmount (#6)
  const accessTimeoutRef = useRef(null);
  const partIdTimeoutRef = useRef(null);
  // ref to track storage-failure warning timeout (#10)
  const storageTimeoutRef = useRef(null);

  const welcomeText =
    ReactHtmlParser(decodeHTML(langObj.loginWelcomeText)) || "";
  const loginHeaderText =
    ReactHtmlParser(decodeHTML(langObj.loginHeaderText)) || "";
  const loginPartIdText =
    ReactHtmlParser(decodeHTML(langObj.loginPartIdText)) || "";
  const partIdWarning =
    ReactHtmlParser(decodeHTML(langObj.partIdWarning)) || "";
  const accessCodeWarning =
    ReactHtmlParser(decodeHTML(langObj.accessCodeWarning)) || "";
  const accessInputText =
    ReactHtmlParser(decodeHTML(langObj.accessInputText)) || "";

  const handleInput = (e) => {
    setUserInputPartId(e.target.value);
  };

  const handleAccess = (e) => {
    setUserInputAccessCode(e.target.value);
  };

  // Set initial next-button visibility once on mount (#3: no longer depends
  // on the input values, so it doesn't re-run on every keystroke)
  useEffect(() => {
    setDisplayNextButton(false);
  }, [setDisplayNextButton]);

  // Clean up any pending warning timeouts on unmount (#6)
  useEffect(() => {
    return () => {
      clearTimeout(accessTimeoutRef.current);
      clearTimeout(partIdTimeoutRef.current);
      clearTimeout(storageTimeoutRef.current);
    };
  }, []);

  // Single shared validation/login handler used by both the Enter key and
  // the submit button (#2: removes duplicated logic)
  const validateAndLogin = () => {
    try {
      const trimmedPartId = userInputPartId.trim();
      const trimmedAccessCode = userInputAccessCode.trim();

      // #8: single-character part IDs are now valid (length > 0 instead of > 1)
      // #9: both inputs are trimmed before validation
      const userPartIdOK = trimmedPartId.length > 0;
      const userAccessOK = trimmedAccessCode === configObj.accessCode;

      // #5: both warnings are now independent, so both can display at once
      setDisplayAccessCodeWarning(!userAccessOK);
      setDisplayPartIdWarning(!userPartIdOK);

      if (userAccessOK && userPartIdOK) {
        setDisplayLandingContent(true);
        setPartId(trimmedPartId);

        // #10: surface a warning instead of silently failing if localStorage
        // is unavailable, and don't mark the user as logged in in that case
        try {
          localStorage.setItem("partId", trimmedPartId);
        } catch (storageError) {
          console.log(storageError);
          setDisplayAccessCodeWarning(true);
          storageTimeoutRef.current = setTimeout(() => {
            setDisplayAccessCodeWarning(false);
          }, 5000);
          return;
        }

        setDisplayNextButton(true);
        setIsLoggedIn(true);
        return;
      }

      setDisplayNextButton(false);

      if (!userAccessOK) {
        console.log("no access code");
        accessTimeoutRef.current = setTimeout(() => {
          setDisplayAccessCodeWarning(false);
        }, 5000);
      }
      if (!userPartIdOK) {
        console.log("no id");
        partIdTimeoutRef.current = setTimeout(() => {
          setDisplayPartIdWarning(false);
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // #4: Enter-key handling is now scoped to the login container instead of
  // a window-level listener, so it won't fire from unrelated elements
  const handleContainerKeyUp = (e) => {
    if (e.key === "Enter") {
      validateAndLogin();
    }
  };

  return (
    <React.Fragment>
      <LogInWelcomeText>{welcomeText}</LogInWelcomeText>
      <Container onKeyUp={handleContainerKeyUp}>
        <div>
          <h2>{loginHeaderText}</h2>
          <StyledHr />
        </div>
        <div>
          <h3>{loginPartIdText}</h3>
          <StyledInputDiv>
            <StyledInput
              onChange={handleInput}
              type="text"
              autoFocus
              autoCapitalize="none"
            />
            {displayPartIdWarning && <WarningText>{partIdWarning}</WarningText>}
          </StyledInputDiv>
        </div>
        <div>
          <h3>{accessInputText}</h3>
          <StyledInputDiv>
            <StyledInput
              onChange={handleAccess}
              type="text"
              autoCapitalize="none"
            />
            {displayAccessCodeWarning && (
              <WarningText>{accessCodeWarning}</WarningText>
            )}
          </StyledInputDiv>
        </div>
        <LogInSubmitButton
          onClick={validateAndLogin}
          size={"1.5em"}
          width={"200px"}
          height={"50px"}
        />
      </Container>
      {/* #7: removed dead <WarningText>{}</WarningText> element */}
    </React.Fragment>
  );
};

export default LogInScreen;

const Container = styled.div`
  display: grid;
  grid-template-rows: 23% 28% 28% 1fr;
  margin-top: 50px;
  width: 800px;
  padding: 20px;
  min-height: 400px;
  margin-bottom: 200px;
  border: 2px solid black;
  justify-self: center;
  background-color: whitesmoke;
`;

const LogInWelcomeText = styled.div`
  width: 900px;
  font-size: 25px;
  line-height: 1.3em;
  padding-left: 35px;
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
