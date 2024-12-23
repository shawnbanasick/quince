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
import useLocalStorage from "../../utilities/useLocalStorage";

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
  // const setMobilePresortResults = useStore(getSetMobilePresortResults);
  // const mobilePresortResults = useStore(getMobilePresortResults);
  const setPresortFinished = useStore(getSetPresortFinished);
  const mobilePresortFontSize = useStore(getMobilePresortFontSize);

  // const setTriggerPresortFinishedModal = useStore(
  //   getSetTriggerMobilePresortFinishedModal
  // );

  let screenOrientation = useScreenOrientation();

  if (cardFontSizePersist) {
    // cardFontSize = cardFontSizePersist;
  }

  // let initialText;
  // let presortArray = JSON.parse(localStorage.getItem("presortArray"));
  // if (
  //   presortArray === null ||
  //   presortArray === undefined ||
  //   presortArray.length === 0
  // ) {
  //   initialText = "Assignment Complete";
  // } else {
  //   initialText = presortArray[0].statement;
  // }

  let initialArray = [...JSON.parse(localStorage.getItem("presortArray"))];
  console.log(JSON.stringify(initialArray.length));

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

  // console.log(JSON.stringify(presortArray2));

  // if (statementText === undefined) {
  //   statementText = "Assignment Complete";
  // }

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

  // const headerBarColor = configObj.headerBarColor;
  const initialScreen = configObj.initialScreen;
  // const statements = cloneDeep(columnStatements.statementList);
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
    // let presortArray2 = JSON.parse(localStorage.getItem("presortArray"));
    try {
      if (presortArray2.length > 0) {
        // remove first object from array
        let currentObj = presortArray2.shift();
        let newCount = statementCount + 1;
        // localStorage.setItem("presortArray", JSON.stringify(presortArray2));
        setPresortArray2(presortArray2);
        setStatementCount(newCount);
        // create object
        currentObj.psValue = value;
        currentObj.color = mobileCardColor(value);
        mobilePresortResults.push({ ...currentObj });
        mobilePresortResults.sort((a, b) => b.psValue - a.psValue);

        // send to local storage
        setMobilePresortResults(mobilePresortResults);
        // localStorage.setItem(
        //   "mobilePresortResults",
        //   JSON.stringify(mobilePresortResults)
        // );
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
          let totalNumPosItems = sortRightArrays.length;
          let totalNumNegItems = sortLeftArrays.length;
          let totalArraysNum = Math.max(totalNumPosItems, totalNumNegItems);

          let thinDisplayControllerArray = [];
          let remainingPosCount = selectedPosItems.length;
          let remainingNegCount = selectedNegItems.length;

          for (let i = 0; i < totalArraysNum; i++) {
            let tempObject = {};
            let tempObject2 = {};
            let message = "";

            if (i === 0) {
              message = "initial";
            } else {
              message = "follow-up";
            }

            if (+sortRightArrays?.[i]?.[1] < remainingPosCount) {
              tempObject = {
                targetCol: sortRightArrays?.[i]?.[0],
                maxNum: sortRightArrays?.[i]?.[1],
                side: "right",
                message: message,
              };
              thinDisplayControllerArray.push(tempObject);
              remainingPosCount = remainingPosCount - sortRightArrays[i][1];
            }
            if (+sortLeftArrays?.[i]?.[1] < remainingNegCount) {
              tempObject2 = {
                targetCol: sortLeftArrays?.[i]?.[0],
                maxNum: sortLeftArrays?.[i]?.[1],
                side: "left",
                message: message,
              };
              thinDisplayControllerArray.push(tempObject2);
              remainingNegCount = remainingNegCount - sortLeftArrays[i][1];
            }
          }
          // console.log(JSON.stringify(thinDisplayControllerArray));
          localStorage.setItem(
            "thinDisplayControllerArray",
            JSON.stringify(thinDisplayControllerArray)
          );
          // setStatementText("Assignment Complete");
        } else {
          // setStatementText(presortArray2?.[0]?.statement);
        }
      }
    } catch (error) {
      console.error(error);
    }
    if (presortArray2.length === 0) {
      console.log("presortArray2.length === 0");
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
  // console.log(JSON.stringify(columnStatements.statementList.length));
  let totalStatements = columnStatements.statementList.length;
  // console.log("presortArray2: ", JSON.stringify(presortArray2));

  return (
    <Container>
      <SortTitleBar background={configObj.headerBarColor}>
        {titleText}
      </SortTitleBar>
      <MobileStatementBox
        fontSize={mobilePresortFontSize}
        statement={presortArray2?.[0]?.statement}
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

      <MobilePreviousAssignmentBox statements={mobilePresortResults} />
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

// const ModalContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 90vw;
//   height: 100vh;
//   padding-right: 10vh;
// `;

const ButtonRowLabel = styled.div`
  display: flex;
  justify-self: center;
  justify-content: space-between;
  width: 85vw;
  min-height: 6vh;
  margin-top: 5px;
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
  width: 28vw;
  /* outline: 1px solid darkgray; */
`;

const CountDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  /* padding-top: 5px; */
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  width: 28vw;
  height: 7vh;
  /* outline: 1px solid darkgray; */
`;
