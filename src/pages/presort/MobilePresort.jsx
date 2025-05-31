import { useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import PleaseLogInFirst from "./PleaseLogInFirst";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import MobileStatementBox from "./MobileStatementBox";
import MobileValueButton from "./MobileValueButton";
import MobilePreviousAssignmentBox from "./MobilePreviousAssignmentBox";
import useScreenOrientation from "../../utilities/useScreenOrientation";
import mobileCardColor from "./mobileCardColor";
import useLocalStorage from "../../utilities/useLocalStorage";
import calcThinDisplayControllerArray from "./calcThinDisplayControllerArray";
import MobilePresortHelpModal from "../../utilities/MobileModal";
import MobilePresortRedoModal from "./MobilePresortRedoModal";
import MobilePresortFinishedModal from "./MobilePresortFinishedModal";
import HelpSymbol from "../../assets/helpSymbol.svg?react";
import MobilePresortPreventNavModal from "./MobilePresortPreventNavModal";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getStatementsObj = (state) => state.statementsObj;
const getIsLoggedIn = (state) => state.isLoggedIn;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getResetColumnStatements = (state) => state.resetColumnStatements;
const getSetTriggerMobilePresortFinishedModal = (state) =>
  state.setTriggerMobilePresortFinishedModal;
const getSetPresortFinished = (state) => state.setPresortFinished;
const getMobilePresortFontSize = (state) => state.mobilePresortFontSize;
const getSetTriggerMobilePresortRedoModal = (state) => state.setTriggerMobilePresortRedoModal;
const getSetTriggerMobilePresortHelpModal = (state) => state.setTriggerMobilePresortHelpModal;

const MobilePresortPage = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const statementsObj = useSettingsStore(getStatementsObj);
  const isLoggedIn = useSettingsStore(getIsLoggedIn);
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const resetColumnStatements = useSettingsStore(getResetColumnStatements);
  const setPresortFinished = useStore(getSetPresortFinished);
  const mobilePresortFontSize = useStore(getMobilePresortFontSize);
  const setTriggerMobilePresortRedoModal = useStore(getSetTriggerMobilePresortRedoModal);
  const setTriggerMobilePresortHelpModal = useStore(getSetTriggerMobilePresortHelpModal);
  const setTriggerPresortFinishedModal = useStore(getSetTriggerMobilePresortFinishedModal);

  // ***********************
  // *** TEXT LOCALIZATION *****************
  // ***********************
  const titleText = ReactHtmlParser(decodeHTML(langObj.mobilePresortConditionsOfInstruction)) || "";
  const completedLabel = ReactHtmlParser(decodeHTML(langObj.mobilePresortCompletedLabel)) || "";
  const assignLeft = ReactHtmlParser(decodeHTML(langObj.mobilePresortAssignLeft)) || "";
  const assignRight = ReactHtmlParser(decodeHTML(langObj.mobilePresortAssignRight)) || "";
  const mobilePresortProcessCompleteMessage =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortProcessCompleteMessage)) || "";
  const screenOrientationText = ReactHtmlParser(decodeHTML(langObj.screenOrientationText)) || "";
  const expandViewMessage = ReactHtmlParser(decodeHTML(langObj.expandViewMessage)) || "";
  const presortHelpModalHead =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortHelpModalHead)) || "";
  const presortHelpModalText =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortHelpModalText)) || "";

  // ******************* //
  // *** LOCAL STATE **************************** //
  //******************** //
  let [presortArray2, setPresortArray2] = useLocalStorage("presortArray2", [
    ...JSON.parse(localStorage.getItem("presortArray")),
  ]);
  let [statementCount, setStatementCount] = useLocalStorage("m_PresortStatementCount", 0);
  let [m_PresortResults, setm_PresortResults] = useLocalStorage("m_PresortResults", []);

  // ***********************
  // *** USE HOOKS ******************
  // ***********************
  let screenOrientation = useScreenOrientation();
  let redoCardId = useRef({ id: "", statement: "" });
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

  // const headerBarColor = configObj.headerBarColor;
  const initialScreen = configObj.initialScreen;
  // const imageSort = configObj.useImages;

  // // early return of presort finished message if complete
  // if (presortNoReturn) {
  //   return <PresortIsComplete />;
  // }

  // ***********************
  // *** EVENT HANDLERS ***************
  // ***********************
  const handleOpenHelpModal = () => {
    setTriggerMobilePresortHelpModal(true);
  };

  const handleRedo = (e) => {
    setTriggerMobilePresortRedoModal(true);
    redoCardId.current.id = e.target.dataset.id;
    redoCardId.current.statement = e.target.dataset.statement;
  };
  const handleClickNegative = () => {
    processClick(-2);
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };
  const handleClickNeutral = () => {
    processClick(0);
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };
  const handleClickPositive = () => {
    processClick(2);
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const handleRedoClick = (value) => {
    setTriggerMobilePresortRedoModal(false);
    let selectedStatementObject = m_PresortResults.find(
      (item) => item.id === redoCardId.current.id
    );
    selectedStatementObject.psValue = value;
    selectedStatementObject.color = mobileCardColor(value);

    if (value > 0) {
      selectedStatementObject.pinkChecked = false;
      selectedStatementObject.yellowChecked = false;
      selectedStatementObject.greenChecked = true;
    } else if (value < 0) {
      selectedStatementObject.pinkChecked = true;
      selectedStatementObject.yellowChecked = false;
      selectedStatementObject.greenChecked = false;
    } else {
      selectedStatementObject.pinkChecked = false;
      selectedStatementObject.yellowChecked = true;
      selectedStatementObject.greenChecked = false;
    }

    m_PresortResults.sort((a, b) => {
      let aVal = +a.id.slice(1);
      let bVal = +b.id.slice(1);
      if (a.psValue === b.psValue) {
        return aVal - bVal;
      }
      return b.psValue - a.psValue;
    });
    setm_PresortResults([...m_PresortResults]);

    let selectedPosItems = m_PresortResults.filter((item) => {
      return +item.psValue > 0;
    });
    let selectedNegItems = m_PresortResults.filter((item) => {
      return +item.psValue < 0;
    });

    localStorage.setItem("selectedPosItems", JSON.stringify(selectedPosItems));
    localStorage.setItem("selectedNegItems", JSON.stringify(selectedNegItems));

    let sortRightArrays = JSON.parse(localStorage.getItem("sortRightArrays"));
    let sortLeftArrays = JSON.parse(localStorage.getItem("sortLeftArrays"));
    let remainingPosCount = selectedPosItems.length;
    let remainingNegCount = selectedNegItems.length;

    calcThinDisplayControllerArray(
      remainingPosCount,
      remainingNegCount,
      sortRightArrays,
      sortLeftArrays
    );
  };

  const processClick = useCallback((value) => {
    try {
      if (presortArray2.length > 0) {
        // remove first object from array
        let currentObj = presortArray2.shift();
        let newCount = statementCount + 1;
        setPresortArray2(presortArray2);
        setStatementCount(newCount);

        // create object
        if (value > 0) {
          currentObj.pinkChecked = false;
          currentObj.yellowChecked = false;
          currentObj.greenChecked = true;
        } else if (value < 0) {
          currentObj.pinkChecked = true;
          currentObj.yellowChecked = false;
          currentObj.greenChecked = false;
        } else {
          currentObj.pinkChecked = false;
          currentObj.yellowChecked = true;
          currentObj.greenChecked = false;
        }

        currentObj.psValue = value;
        currentObj.color = mobileCardColor(value);
        m_PresortResults.push({ ...currentObj });
        m_PresortResults.sort((a, b) => {
          let aVal = +a.id.slice(1);
          let bVal = +b.id.slice(1);
          if (a.psValue === b.psValue) {
            return aVal - bVal;
          }
          return b.psValue - a.psValue;
        });

        // send to local storage
        setm_PresortResults(m_PresortResults);
        let selectedPosItems = m_PresortResults.filter((item) => {
          return +item.psValue > 0;
        });
        let selectedNegItems = m_PresortResults.filter((item) => {
          return +item.psValue < 0;
        });

        localStorage.setItem("selectedPosItems", JSON.stringify(selectedPosItems));
        localStorage.setItem("selectedNegItems", JSON.stringify(selectedNegItems));

        if (presortArray2.length === 0) {
          let sortRightArrays = JSON.parse(localStorage.getItem("sortRightArrays"));
          let sortLeftArrays = JSON.parse(localStorage.getItem("sortLeftArrays"));
          let newCols = JSON.parse(localStorage.getItem("newCols"));
          let remainingPosCount = selectedPosItems.length;
          let remainingNegCount = selectedNegItems.length;

          let thinDisplayControllerArray = calcThinDisplayControllerArray(
            remainingPosCount,
            remainingNegCount,
            sortRightArrays,
            sortLeftArrays
          );

          localStorage.setItem(
            "thinDisplayControllerArray",
            JSON.stringify(thinDisplayControllerArray)
          );

          // *** update newCols ***
          newCols.statementList = m_PresortResults;
          localStorage.setItem("newCols", JSON.stringify(newCols));

          setTriggerPresortFinishedModal(true);
          localStorage.setItem("m_PresortFinished", "true");
          // setDisplayMobileHelpButton(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  // *******************************************
  // *** KEYBOARD SHORTCUTS (FOR DEV TESTING) ***************
  // ****************************************
  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === "1" || event.key === 1) {
        processClick(-2);
      } else if (event.key === "2" || event.key === 2) {
        processClick(0);
      } else if (event.key === "3" || event.key === 3) {
        processClick(2);
      } else {
        return;
      }
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [processClick]);

  // **************************
  // *** EARLY RETURNS ***************
  // **************************
  if (presortArray2.length === 0) {
    setTimeout(() => {
      setPresortFinished(true);
    }, 100);
    // setDisplayMobileHelpButton(false);
  }

  if (initialScreen !== "anonymous") {
    if (isLoggedIn === false) {
      return <PleaseLogInFirst />;
    }
  }

  if (screenOrientation === "landscape-primary") {
    return (
      <OrientationDiv>
        <h1>{screenOrientationText}</h1>
      </OrientationDiv>
    );
  }

  // **************************
  // *** RENDER VARIABLES ******************
  // **************************
  let totalStatements = columnStatements.statementList.length;
  let displayStatements = JSON.parse(localStorage.getItem("m_PresortDisplayStatements"));

  // **************************
  // *** ELEMENTS ******************
  // **************************
  return (
    <Container>
      <ModalDiv>
        <MobilePresortHelpModal head={presortHelpModalHead} text={presortHelpModalText} />
        <MobilePresortRedoModal clickFunction={handleRedoClick} statement={redoCardId} />
        <MobilePresortFinishedModal />
        <MobilePresortPreventNavModal />
      </ModalDiv>
      <SortTitleBar background={configObj.headerBarColor}>
        {titleText}
        <HelpContainer onClick={handleOpenHelpModal}>
          <HelpSymbol />
        </HelpContainer>
      </SortTitleBar>

      {displayStatements.display ? (
        <>
          <MobileStatementBox
            fontSize={mobilePresortFontSize}
            statement={presortArray2?.[0]?.statement}
            backgroundColor={"#e5e5e5"}
          />
          <ButtonRowLabel>
            <AssignDiv>{assignLeft}</AssignDiv>
            <CountDiv>{`${statementCount} / ${totalStatements}`}</CountDiv>
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

          <MobilePreviousAssignmentBox statements={m_PresortResults} onClick={handleRedo} />
          <BoxSizeMessage>{expandViewMessage}</BoxSizeMessage>
        </>
      ) : (
        <FinishedMessage>
          <p>{mobilePresortProcessCompleteMessage}</p>
        </FinishedMessage>
      )}

      {/* <ModalContainer></ModalContainer> */}
      <MobilePresortFinishedModal />

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

export default MobilePresortPage;

const SortTitleBar = styled.div`
  display: flex;
  width: 100vw;
  padding-left: 10px;
  padding-right: 1.5vw;
  padding-top: 5px;
  padding-bottom: 5px;
  min-height: 30px;
  background-color: ${(props) => props.background};
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 4.5vw;
  user-select: none;
  margin-bottom: 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  user-select: none;
  background-color: #f3f4f6;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 20px;
  width: 85vw;
  height: 30px;
  justify-self: center;
`;

const RowText = styled.div`
  display: flex;
  justify-content: left;
  align-items: flex-end;
  font-size: 2.5vh;
  padding-left: 2.5vw;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
`;

const OrientationDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const ButtonRowLabel = styled.div`
  display: flex;
  justify-self: center;
  justify-content: space-between;
  width: 85vw;
  min-height: 6vh;
  margin-top: 5px;
  align-items: flex-end;
  font-size: 2.5vh;
`;

const AssignDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5vh;
  width: 28vw;
`;

const CountDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  width: 28vw;
  height: 7vh;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
`;

const HelpContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 5px;
  margin-left: 5px;
  align-items: center;
  padding-bottom: 5px;
  width: 20px;
  height: 20px;
  color: black;
  font-size: 2.5vh;
  font-weight: bold;
  user-select: none;
`;

const FinishedMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 3.5vh;
  font-weight: bold;
  min-height: 30vh;
  margin-top: 30px;
  width: 80vw;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  font-size: 22px;
`;

const BoxSizeMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5vh;
  font-weight: bold;
  margin-top: 10px;
  width: 80vw;
`;

const ModalDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
