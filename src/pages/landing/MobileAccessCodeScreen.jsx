import { useEffect } from "react";
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
const getSetDisplayAccessCodeWarning = (state) => state.setDisplayAccessCodeWarning;

const MobileAccessCodeScreen = () => {
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

  // Language
  const loginHeaderText = ReactHtmlParser(decodeHTML(langObj.loginHeaderText)) || "";
  const accessInputText = ReactHtmlParser(decodeHTML(langObj.accessInputText)) || "";
  const accessCodeWarning = ReactHtmlParser(decodeHTML(langObj.accessCodeWarning)) || "";

  const handleAccess = (e) => {
    setUserInputAccessCode(e.target.value);
  };

  useEffect(() => {
    setDisplayNextButton(false);

    const handleKeyUpStart = (event) => {
      if (event.key === "Enter") {
        let userAccessOK = false;
        const projectAccessCode = configObj.accessCode;

        // get user input

        if (userInputAccessCode === projectAccessCode) {
          userAccessOK = true;
          setDisplayLandingContent(true);
          setDisplayNextButton(true);
          setIsLoggedIn(true);
        }

        // invalid input ==> display warnings
        if (userAccessOK === false) {
          setDisplayAccessCodeWarning(true);
          setTimeout(() => {
            setDisplayAccessCodeWarning(false);
          }, 3000);
        }
      }
    }; // end keyup
    window.addEventListener("keyup", handleKeyUpStart);

    return () => window.removeEventListener("keyup", handleKeyUpStart);
  }, [
    setDisplayLandingContent,
    setDisplayNextButton,
    setIsLoggedIn,
    configObj.accessCode,
    setDisplayAccessCodeWarning,
    userInputAccessCode,
  ]);

  const handleSubmit = () => {
    let userAccessOK = false;
    const projectAccessCode = configObj.accessCode;

    // get user input

    if (userInputAccessCode === projectAccessCode) {
      userAccessOK = true;
      setDisplayLandingContent(true);
      setDisplayNextButton(true);
      setIsLoggedIn(true);
    }

    // invalid input ==> display warnings
    if (userAccessOK === false) {
      setDisplayAccessCodeWarning(true);
      setTimeout(() => {
        setDisplayAccessCodeWarning(false);
      }, 5000);
    }
  };

  return (
    <Container>
      <div>
        <TextSpan2>{loginHeaderText}</TextSpan2>
        <StyledHr />
      </div>
      <div>
        <TextSpan1>{accessInputText}</TextSpan1>
        <form autoComplete="none">
          <StyledInputDiv>
            <StyledInput onChange={handleAccess} type="text" autoFocus autoCapitalize="none" />
            {displayAccessCodeWarning && <WarningText>{accessCodeWarning}</WarningText>}
          </StyledInputDiv>
        </form>
      </div>

      <LogInSubmitButton onClick={handleSubmit} size={"1em"} width={"100px"} height={"30px"} />
    </Container>
  );
};

export default MobileAccessCodeScreen;

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  margin-top: 50px;
  width: 90vw;
  padding: 1.5vw;
  min-height: 300px;
  margin-bottom: 200px;
  border: 2px solid black;
  justify-self: center;
  background-color: whitesmoke;
  border-radius: 5px;
`;

const StyledHr = styled.hr`
  margin-top: 5px;
  margin-bottom: 30px;
  width: 80vw;
`;

const StyledInput = styled.input`
  margin-top: 5px;
  width: 85vw;
  height: 30px;
  font-size: 1.4em;
  padding-left: 5px;
`;

const StyledInputDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const WarningText = styled.div`
  color: red;
  font-weight: bold;
  font-size: 1.4em;
  margin-left: 10px;
`;

const TextSpan1 = styled.span`
  font-size: 0.9em;
  font-weight: bold;
`;

const TextSpan2 = styled.span`
  font-size: 1.4em;
  font-weight: bold;
`;
