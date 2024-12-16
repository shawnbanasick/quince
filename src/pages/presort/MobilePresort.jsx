import { useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import styled from "styled-components";
// import PresortPreventNavModal from "./PresortPreventNavModal";
import MobilePresortFinishedModal from "./MobilePresortFinishedModal";
import PresortIsComplete from "./PresortIsComplete";
import PleaseLogInFirst from "./PleaseLogInFirst";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
// import PromptUnload from "../../utilities/PromptUnload";
// import PresortDndImages from "./PresortDndImages";
import MobileStatementBox from "./MobileStatementBox";
import MobileValueButton from "./MobileValueButton";
import MobilePreviousAssignmentBox from "./MobilePreviousAssignmentBox";
import useScreenOrientation from "../../utilities/useScreenOrientation";
import mobileCardColor from "./mobileCardColor";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getStatementsObj = (state) => state.statementsObj;
// const getCardFontSizePresort = (state) => state.cardFontSizePresort;
const getIsLoggedIn = (state) => state.isLoggedIn;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getPresortNoReturn = (state) => state.presortNoReturn;
const getResetColumnStatements = (state) => state.resetColumnStatements;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetMobilePresortResults = (state) => state.setMobilePresortResults;
const getMobilePresortResults = (state) => state.mobilePresortResults;
const getSetTriggerMobilePresortFinishedModal = (state) =>
  state.setTriggerMobilePresortFinishedModal;
const getSetPresortFinished = (state) => state.setPresortFinished;

const PresortPage = () => {
  // console.log("Mobile PresortPage");

  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const statementsObj = useSettingsStore(getStatementsObj);
  // let cardFontSize = useStore(getCardFontSizePresort);
  const isLoggedIn = useSettingsStore(getIsLoggedIn);
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const presortNoReturn = useStore(getPresortNoReturn);
  const resetColumnStatements = useSettingsStore(getResetColumnStatements);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  const cardFontSizePersist = +localStorage.getItem("fontSizePresort");
  const setMobilePresortResults = useStore(getSetMobilePresortResults);
  const mobilePresortResults = useStore(getMobilePresortResults);
  const setPresortFinished = useStore(getSetPresortFinished);

  // const setTriggerPresortFinishedModal = useStore(
  //   getSetTriggerMobilePresortFinishedModal
  // );

  let screenOrientation = useScreenOrientation();

  if (cardFontSizePersist) {
    // cardFontSize = cardFontSizePersist;
  }

  let initialText;
  let presortArray = JSON.parse(localStorage.getItem("presortArray"));
  if (
    presortArray === null ||
    presortArray === undefined ||
    presortArray.length === 0
  ) {
    initialText = "Assignment Complete";
  } else {
    initialText = presortArray[0].statement;
  }

  // *** LOCAL STATE
  let [statementText, setStatementText] = useState(initialText);
  if (statementText === undefined) {
    statementText = "Assignment Complete";
  }

  setDisplayNextButton(true);

  useEffect(() => {
    let startTime = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("presort");
      localStorage.setItem("currentPage", "presort");
      await setProgressScore(20);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTime, "presortPage", "presortPage");
    };
  }, [setCurrentPage, setProgressScore]);

  // TODO *** move to landing page - reset statements when reloading for new participant ***
  let columnStatements = statementsObj.columnStatements;
  if (configObj.setupTarget === "local") {
    columnStatements = JSON.parse(JSON.stringify(resetColumnStatements));
  }

  const headerBarColor = configObj.headerBarColor;
  const initialScreen = configObj.initialScreen;
  const statements = cloneDeep(columnStatements.statementList);
  const imageSort = configObj.useImages;

  const titleText =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortConditionsOfInstruction)) ||
    "";
  const completedLabel =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortCompletedLabel)) || "";
  const assignLeft =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortAssignLeft)) || "";
  const assignRight =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortAssignRight)) || "";

  // early return if log-in required and not logged in
  if (initialScreen !== "anonymous") {
    if (isLoggedIn === false) {
      return <PleaseLogInFirst />;
    }
  }
  // early return of presort finished message if complete
  if (presortNoReturn) {
    return <PresortIsComplete />;
  }

  const handleClickNegative = () => {
    processClick(-2);
  };
  const handleClickNeutral = () => {
    processClick(0);
  };
  const handleClickPositive = () => {
    processClick(2);
  };

  const processClick = (value) => {
    let presortArray2 = JSON.parse(localStorage.getItem("presortArray"));
    try {
      if (presortArray2.length > 0) {
        // remove first object from array
        let currentObj = presortArray2.shift();
        localStorage.setItem("presortArray", JSON.stringify(presortArray2));
        // create object
        currentObj.psValue = value;
        currentObj.color = mobileCardColor(value);
        mobilePresortResults.push({ ...currentObj });
        mobilePresortResults.sort((a, b) => b.psValue - a.psValue);

        // send to local storage
        setMobilePresortResults(mobilePresortResults);
        localStorage.setItem(
          "mobilePresortResults",
          JSON.stringify(mobilePresortResults)
        );
        let selectedPosItems = mobilePresortResults.filter((item) => {
          return +item.psValue > 0;
        });
        let selectedNegItems = mobilePresortResults.filter((item) => {
          return +item.psValue < 0;
        });

        localStorage.setItem(
          "selectedPosItems",
          JSON.stringify(selectedPosItems)
        );
        localStorage.setItem(
          "selectedNegItems",
          JSON.stringify(selectedNegItems)
        );

        if (presortArray2.length === 0) {
          console.log("presortArray2.length === 0");
          setStatementText("Assignment Complete");
        } else {
          setStatementText(presortArray2?.[0]?.statement);
        }
      }
    } catch (error) {
      console.error(error);
    }
    if (presortArray2.length === 0) {
      setPresortFinished(true);
    }
  };

  // console.log(screenOrientation);
  if (screenOrientation === "landscape-primary") {
    return (
      <OrientationDiv>
        <h1>Please use Portrait orientation!</h1>
      </OrientationDiv>
    );
  }

  return (
    <Container>
      <SortTitleBar background={configObj.headerBarColor}>
        {titleText}
      </SortTitleBar>
      <MobileStatementBox statement={statementText} />
      <ButtonRowLabel>
        <AssignDiv>{assignLeft}</AssignDiv>
        <AssignDiv>{assignRight}</AssignDiv>
      </ButtonRowLabel>
      <ButtonRow>
        <MobileValueButton
          id={`-2`}
          value={-2}
          text={`-`}
          color={`#FBD5D5`}
          onClick={handleClickNegative}
        />
        <MobileValueButton
          id={`0`}
          value={0}
          text={`?`}
          color={`#F3F4F6`}
          onClick={handleClickNeutral}
        />

        <MobileValueButton
          id={`2`}
          value={2}
          text={`+`}
          color={`#BCF0DA`}
          onClick={handleClickPositive}
        />
      </ButtonRow>
      <RowText>{completedLabel}</RowText>

      <MobilePreviousAssignmentBox statement={statementText} />
      {/* <ModalContainer></ModalContainer>
      <MobilePresortFinishedModal /> */}

      {/* <PromptUnload />
      <PresortModal />
      <PresortPreventNavModal />
      {imageSort ? (
        <PresortDndImages cardFontSize={cardFontSize} />
      ) : (
        <PresortDND statements={statements} cardFontSize={cardFontSize} />
      )} */}
    </Container>
  );
};

export default PresortPage;

const SortTitleBar = styled.div`
  width: 100vw;
  text-align: center;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-top: 2px;
  min-height: 30px;
  background-color: ${(props) => props.background};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 40px 22vh 50px 40px 30px 1fr;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  user-select: none;
  background-color: #f3f4f6;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 85vw;
  height: 30px;
  /* padding-left: 1.5vw; */
  justify-self: center;
`;

const RowText = styled.div`
  display: flex;
  justify-content: left;
  align-items: flex-end;
  font-size: 2.5vh;
  padding-left: 2.5vw;
`;

const OrientationDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90vw;
  height: 100vh;
  padding-right: 10vh;
`;

const ButtonRowLabel = styled.div`
  display: flex;
  justify-self: center;
  justify-content: space-between;
  width: 85vw;
  height: 6vh;
  align-items: flex-end;
  font-size: 2.5vh;
  /* outline: 1px solid darkgray; */
`;

const AssignDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5vh;
  width: 25vw;
  /* outline: 1px solid darkgray; */
`;
