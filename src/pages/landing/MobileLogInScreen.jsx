import React, { useEffect } from "react";
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
const getSetDisplayAccessCodeWarning = (state) => state.setDisplayAccessCodeWarning;
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

  const welcomeText = ReactHtmlParser(decodeHTML(langObj.loginWelcomeText)) || "";
  const loginHeaderText = ReactHtmlParser(decodeHTML(langObj.loginHeaderText)) || "";
  const loginPartIdText = ReactHtmlParser(decodeHTML(langObj.loginPartIdText)) || "";
  const partIdWarning = ReactHtmlParser(decodeHTML(langObj.partIdWarning)) || "";
  const accessCodeWarning = ReactHtmlParser(decodeHTML(langObj.accessCodeWarning)) || "";
  const accessInputText = ReactHtmlParser(decodeHTML(langObj.accessInputText)) || "";

  const handleInput = (e) => {
    setUserInputPartId(e.target.value);
  };

  const handleAccess = (e) => {
    setUserInputAccessCode(e.target.value);
  };

  useEffect(() => {
    const handleKeyUpStart = (event) => {
      if (event.key === "Enter") {
        try {
          let userPartIdOK = false;
          let userAccessOK = false;
          const projectAccessCode = configObj.accessCode;

          // get user input
          if (userInputPartId.length > 1) {
            userPartIdOK = true;
          } else {
            userPartIdOK = false;
          }
          if (userInputAccessCode === projectAccessCode) {
            userAccessOK = true;
          }

          // invalid input ==> display warnings
          if (userAccessOK && userPartIdOK) {
            setDisplayLandingContent(true);
            setPartId(userInputPartId);
            localStorage.setItem("partId", userInputPartId);

            setDisplayNextButton(true);
            setIsLoggedIn(true);
          } else if (userAccessOK === false) {
            console.log("no access code");
            setDisplayAccessCodeWarning(true);
            setDisplayNextButton(false);
            setTimeout(() => {
              setDisplayAccessCodeWarning(false);
            }, 5000);
          } else if (userPartIdOK === false) {
            setDisplayPartIdWarning(true);
            setDisplayNextButton(false);
            console.log("no id");

            setTimeout(() => {
              setDisplayPartIdWarning(false);
            }, 5000);
          }
        } catch (error) {
          console.log(error);
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
    setPartId,
    setDisplayPartIdWarning,
    userInputPartId,
  ]);

  const handleSubmit = () => {
    try {
      let userPartIdOK = false;
      let userAccessOK = false;
      const projectAccessCode = configObj.accessCode;

      // get user input
      if (userInputPartId.length > 1) {
        userPartIdOK = true;
      } else {
        userPartIdOK = false;
      }
      if (userInputAccessCode === projectAccessCode) {
        userAccessOK = true;
      }

      // invalid input ==> display warnings
      if (userAccessOK && userPartIdOK) {
        setDisplayLandingContent(true);
        setPartId(userInputPartId);
        localStorage.setItem("partId", userInputPartId);

        setDisplayNextButton(true);
        setIsLoggedIn(true);
      } else if (userAccessOK === false) {
        console.log("no access code");
        setDisplayAccessCodeWarning(true);
        setDisplayNextButton(false);
        setTimeout(() => {
          setDisplayAccessCodeWarning(false);
        }, 5000);
      } else if (userPartIdOK === false) {
        setDisplayPartIdWarning(true);
        setDisplayNextButton(false);
        console.log("no id");

        setTimeout(() => {
          setDisplayPartIdWarning(false);
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <LogInWelcomeText>{welcomeText}</LogInWelcomeText>
      <Container>
        <div>
          <TextSpan2>{loginHeaderText}</TextSpan2>
          <StyledHr />
        </div>
        <TopContainer>
          <TextSpan1>{loginPartIdText}</TextSpan1>
          <StyledInputDiv>
            <StyledInput onChange={handleInput} type="text" autoCapitalize="none" autoFocus />
            {displayPartIdWarning && <WarningText>{partIdWarning}</WarningText>}
          </StyledInputDiv>
        </TopContainer>
        <BottomContainer>
          <TextSpan1>{accessInputText}</TextSpan1>
          <StyledInputDiv>
            <StyledInput onChange={handleAccess} type="password" autoCapitalize="none" />
            {displayAccessCodeWarning && <WarningText>{accessCodeWarning}</WarningText>}
          </StyledInputDiv>
        </BottomContainer>
        <LogInSubmitButton size={"1.0em"} width={"120px"} height={"30px"} onClick={handleSubmit} />
      </Container>
      <WarningText>{}</WarningText>
    </React.Fragment>
  );
};

export default LogInScreen;

const Container = styled.div`
  display: grid;
  grid-template-rows: 23% 28% 28% 1fr;
  margin-top: 30px;
  width: 96vw;
  padding: 20px;
  /* min-height: 400px; */
  margin-bottom: 10px;
  border: 2px solid black;
  justify-self: center;
  border-radius: 5px;
  background-color: whitesmoke;
`;

const LogInWelcomeText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100vw;
  font-size: 16px;
  line-height: 1.3em;
  /* border: 2px solid red; */
  padding: 10px;
  /* padding-left: 35px; */
`;

const StyledHr = styled.hr`
  margin-top: 5px;
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  margin-top: 5px;
  width: 80vw;
  height: 30px;
  font-size: 1em;
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
  font-size: 1em;
  margin-left: 10px;
`;

const TextSpan2 = styled.span`
  font-size: 1.1em;
  font-weight: bold;
`;

const TextSpan1 = styled.span`
  font-size: 0.8em;
  font-weight: bold;
`;

const TopContainer = styled.div`
  height: 140px;
`;

const BottomContainer = styled.div`
  margin-top: 10px;
  height: 80px;
`;
