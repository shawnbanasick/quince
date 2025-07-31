import { useEffect } from "react";
import styled from "styled-components";
import LogInSubmitButton from "./LogInSubmitButton";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getDisplayPartIdWarning = (state) => state.displayPartIdWarning;
const getSetUserInputPartId = (state) => state.setUserInputPartId;
const getUserInputPartId = (state) => state.userInputPartId;
const getSetDisplayLandingContent = (state) => state.setDisplayLandingContent;
const getSetPartId = (state) => state.setPartId;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetIsLoggedIn = (state) => state.setIsLoggedIn;
const getSetDisplayPartIdWarning = (state) => state.setDisplayPartIdWarning;

const MobilePartIdScreen = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const displayPartIdWarning = useStore(getDisplayPartIdWarning);
  const setUserInputPartId = useStore(getSetUserInputPartId);
  const userInputPartId = useStore(getUserInputPartId);
  const setDisplayLandingContent = useStore(getSetDisplayLandingContent);
  const setPartId = useStore(getSetPartId);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  const setIsLoggedIn = useStore(getSetIsLoggedIn);
  const setDisplayPartIdWarning = useStore(getSetDisplayPartIdWarning);

  const loginHeaderText = ReactHtmlParser(decodeHTML(langObj.loginHeaderText)) || "";
  const loginPartIdText = ReactHtmlParser(decodeHTML(langObj.loginPartIdText)) || "";
  const partIdWarning = ReactHtmlParser(decodeHTML(langObj.partIdWarning)) || "";

  const handleInput = (e) => {
    setUserInputPartId(e.target.value);
  };

  useEffect(() => {
    setDisplayNextButton(false);

    const handleKeyUpStart = (event) => {
      if (event.key === "Enter") {
        console.log("Enter");
        let userPartIdOK = false;

        // get user input
        if (userInputPartId.length > 0) {
          userPartIdOK = true;
          setDisplayLandingContent(true);
          setPartId(userInputPartId);
          localStorage.setItem("partId", userInputPartId);
          setDisplayNextButton(true);
          setIsLoggedIn(true);
        }

        // invalid input ==> display warnings
        if (userPartIdOK === false) {
          setDisplayPartIdWarning(true);
          setTimeout(() => {
            setDisplayPartIdWarning(false);
          }, 5000);
        }
      }
    }; // end keyup

    window.addEventListener("keyup", handleKeyUpStart);

    return () => window.removeEventListener("keyup", handleKeyUpStart);
  }, [
    setDisplayLandingContent,
    setPartId,
    setDisplayNextButton,
    setIsLoggedIn,
    userInputPartId,
    setDisplayPartIdWarning,
  ]);

  const handleSubmit = (e) => {
    let userPartIdOK = false;

    // get user input
    if (userInputPartId.length > 0) {
      userPartIdOK = true;
      setDisplayLandingContent(true);
      setPartId(userInputPartId);
      localStorage.setItem("partId", userInputPartId);
      setDisplayNextButton(true);
      setIsLoggedIn(true);
    }

    // invalid input ==> display warnings
    if (userPartIdOK === false) {
      setDisplayPartIdWarning(true);
      setTimeout(() => {
        setDisplayPartIdWarning(false);
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
        <TextSpan1>{loginPartIdText}</TextSpan1>
        <StyledInputDiv>
          <StyledInput onChange={handleInput} type="text" autoFocus />
          {displayPartIdWarning && <WarningText>{partIdWarning}</WarningText>}
        </StyledInputDiv>
      </div>

      <LogInSubmitButton onClick={handleSubmit} size={"1.0em"} width={"100px"} height={"30px"} />
    </Container>
  );
};

export default MobilePartIdScreen;

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  margin-top: 50px;
  width: 90vw;
  padding: 1.5vw;
  min-height: 300px;
  margin-bottom: 100px;
  border: 2px solid black;
  justify-self: center;
  background-color: whitesmoke;
  border-radius: 5px;
`;

const StyledHr = styled.hr`
  margin-top: 5px;
  margin-bottom: 30px;
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
  font-size: 1.5em;
  font-weight: bold;
`;
