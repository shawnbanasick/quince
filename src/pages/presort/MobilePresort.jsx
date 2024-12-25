import { useEffect, useState, useRef } from "react";
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
import useLocalStorage from "../../utilities/useLocalStorage";
import MobilePresortRedoModal from "./MobilePresortRedoModal";
import calcThinDisplayControllerArray from "./calcThinDisplayControllerArray";
import MobilePresortHelpModal from "./MobilePresortHelpModal";

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
// const getSetMobilePresortResults = (state) => state.setMobilePresortResults;
// const getMobilePresortResults = (state) => state.mobilePresortResults;
const getSetTriggerMobilePresortFinishedModal = (state) =>
  state.setTriggerMobilePresortFinishedModal;
const getSetPresortFinished = (state) => state.setPresortFinished;
const getMobilePresortFontSize = (state) => state.mobilePresortFontSize;
const getSetTriggerMobilePresortRedoModal = (state) =>
  state.setTriggerMobilePresortRedoModal;
const getSetDisplayMobileHelpButton = (state) =>
  state.setDisplayMobileHelpButton;

const MobilePresortPage = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const statementsObj = useSettingsStore(getStatementsObj);
  const isLoggedIn = useSettingsStore(getIsLoggedIn);
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const presortNoReturn = useStore(getPresortNoReturn);
  const resetColumnStatements = useSettingsStore(getResetColumnStatements);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  const cardFontSizePersist = +localStorage.getItem("fontSizePresort");
  const setPresortFinished = useStore(getSetPresortFinished);
  const mobilePresortFontSize = useStore(getMobilePresortFontSize);
  const setTriggerMobilePresortRedoModal = useStore(
    getSetTriggerMobilePresortRedoModal
  );
  const setDisplayMobileHelpButton = useStore(getSetDisplayMobileHelpButton);

  // let cardFontSize = useStore(getCardFontSizePresort);
  // const setMobilePresortResults = useStore(getSetMobilePresortResults);
  // const mobilePresortResults = useStore(getMobilePresortResults);

  const setTriggerPresortFinishedModal = useStore(
    getSetTriggerMobilePresortFinishedModal
  );

  let screenOrientation = useScreenOrientation();

  if (cardFontSizePersist) {
    // cardFontSize = cardFontSizePersist;
  }

  let initialArray = [...JSON.parse(localStorage.getItem("presortArray"))];

  // ******************* //
  // *** LOCAL STATE *** //
  //******************** //
  let [presortArray2, setPresortArray2] = useLocalStorage(
    "presortArray2",
    initialArray
  );
  let [statementCount, setStatementCount] = useLocalStorage(
    "mobilePresortStatementCount",
    0
  );
  let [mobilePresortResults, setMobilePresortResults] = useLocalStorage(
    "mobilePresortResults",
    []
  );
  let redoCardId = useRef({ id: "", statement: "" });

  // setDisplayNextButton(true);

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

  const handleRedo = (e) => {
    setTriggerMobilePresortRedoModal(true);
    redoCardId.current.id = e.target.dataset.id;
    redoCardId.current.statement = e.target.dataset.statement;
  };
  const handleClickNegative = () => {
    processClick(-2);
  };
  const handleClickNeutral = () => {
    processClick(0);
  };
  const handleClickPositive = () => {
    processClick(2);
  };

  const handleRedoClick = (value) => {
    setTriggerMobilePresortRedoModal(false);
    console.log(presortArray2);
    let selectedStatementObject = mobilePresortResults.find(
      (item) => item.id === redoCardId.current.id
    );
    selectedStatementObject.psValue = value;
    selectedStatementObject.color = mobileCardColor(value);

    mobilePresortResults.sort((a, b) => {
      let aVal = +a.id.slice(1);
      let bVal = +b.id.slice(1);
      if (a.psValue === b.psValue) {
        return aVal - bVal;
      }
      return b.psValue - a.psValue;
    });
    setMobilePresortResults([...mobilePresortResults]);

    let selectedPosItems = mobilePresortResults.filter((item) => {
      return +item.psValue > 0;
    });
    let selectedNegItems = mobilePresortResults.filter((item) => {
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

  const processClick = (value) => {
    try {
      if (presortArray2.length > 0) {
        // remove first object from array
        let currentObj = presortArray2.shift();
        let newCount = statementCount + 1;
        setPresortArray2(presortArray2);
        setStatementCount(newCount);

        // create object
        currentObj.psValue = value;
        currentObj.color = mobileCardColor(value);
        mobilePresortResults.push({ ...currentObj });
        mobilePresortResults.sort((a, b) => {
          let aVal = +a.id.slice(1);
          let bVal = +b.id.slice(1);
          if (a.psValue === b.psValue) {
            return aVal - bVal;
          }
          return b.psValue - a.psValue;
        });

        // send to local storage
        setMobilePresortResults(mobilePresortResults);
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
          let sortRightArrays = JSON.parse(
            localStorage.getItem("sortRightArrays")
          );
          let sortLeftArrays = JSON.parse(
            localStorage.getItem("sortLeftArrays")
          );
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

          setTriggerPresortFinishedModal(true);
          setDisplayMobileHelpButton(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
    if (presortArray2.length === 0) {
      console.log("presortArray2.length === 0");
      setPresortFinished(true);
      setDisplayMobileHelpButton(false);
    }
  };

  if (screenOrientation === "landscape-primary") {
    return (
      <OrientationDiv>
        <h1>Please use Portrait orientation!</h1>
      </OrientationDiv>
    );
  }
  let totalStatements = columnStatements.statementList.length;

  return (
    <Container>
      <MobilePresortRedoModal
        clickFunction={handleRedoClick}
        statement={redoCardId}
      />
      <MobilePresortHelpModal />
      <SortTitleBar background={configObj.headerBarColor}>
        {titleText}
      </SortTitleBar>
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

      <MobilePreviousAssignmentBox
        statements={mobilePresortResults}
        onClick={handleRedo}
      />
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
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-top: 5px;
  padding-bottom: 5px;
  min-height: 30px;
  height: fit-content;
  width: 100vw;
  font-weight: bold;
  font-size: 14px;
  background-color: ${(props) => props.background};
  align-items: center;
  color: white;
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
`;
