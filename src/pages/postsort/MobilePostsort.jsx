import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import useSettingsStore from "../../globalState/useSettingsStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import HelpSymbol from "../../assets/helpSymbol.svg?react";
import useLocalStorage from "../../utilities/useLocalStorage";
import { v4 as uuid } from "uuid";
import DebouncedTextarea from "./DebouncedTextArea";
import useScreenOrientation from "../../utilities/useScreenOrientation";
import MobileModal from "../../utilities/MobileModal";
import { useEmojiArrays } from "../sort/mobileSortHooks/useEmojiArrays";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getMapObj = (state) => state.mapObj;
const getMobilePostsortFontSize = (state) => state.mobilePostsortFontSize;
const getMobilePostsortViewSize = (state) => state.mobilePostsortViewSize;
const getShowPostsortCommentHighlighting = (state) => state.showPostsortCommentHighlighting;
const getSetTriggerMobilePostsortHelpModal = (state) => state.setTriggerMobilePostsortHelpModal;
const getTriggerHelpModal = (state) => state.triggerMobilePostsortHelpModal;
const getSetTriggerHelpModal = (state) => state.setTriggerMobilePostsortHelpModal;
const getTriggerPreventNavModal = (state) => state.triggerMobilePostsortPreventNavModal;
const getSetTriggerPreventNavModal = (state) => state.setTriggerMobilePostsortPreventNavModal;

const MobilePostsort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const langObj = useSettingsStore(getLangObj);
  const mapObj = useSettingsStore(getMapObj);
  const configObj = useSettingsStore(getConfigObj);
  let mobilePostsortFontSize = useStore(getMobilePostsortFontSize);
  let required = configObj.postsortCommentsRequired;
  const showPostsortCommentHighlighting = useStore(getShowPostsortCommentHighlighting);
  const setTriggerMobilePostsortHelpModal = useStore(getSetTriggerMobilePostsortHelpModal);
  const triggerHelpModal = useStore(getTriggerHelpModal);
  const setTriggerHelpModal = useStore(getSetTriggerHelpModal);
  const triggerPreventNavModal = useStore(getTriggerPreventNavModal);
  const setTriggerPreventNavModal = useStore(getSetTriggerPreventNavModal);

  // ***************************
  // *** TEXT LOCALIZATION *******************
  // ***************************
  const sortbarText = ReactHtmlParser(decodeHTML(langObj.mobilePostsortSortbarText)) || "";
  const agree = ReactHtmlParser(decodeHTML(langObj.postsortAgreement)) || "";
  const disagree = ReactHtmlParser(decodeHTML(langObj.postsortDisagreement)) || "";
  const placeholder = langObj.placeholder;
  const screenOrientationText = ReactHtmlParser(decodeHTML(langObj.screenOrientationText)) || "";
  const expandViewMessage = ReactHtmlParser(decodeHTML(langObj.expandViewMessage)) || "";
  const helpHead = ReactHtmlParser(decodeHTML(langObj.mobilePostsortHelpModalHead)) || "";
  const helpText = ReactHtmlParser(decodeHTML(langObj.mobilePostsortHelpModalText)) || "";
  const preventNavHead =
    ReactHtmlParser(decodeHTML(langObj.mobilePostsortPreventNavModalHead)) || "";
  const preventNavText =
    ReactHtmlParser(decodeHTML(langObj.mobilePostsortPreventNavModalText)) || "";

  let emojiArray = useEmojiArrays(mapObj);
  let emojiDisplayArray = [...emojiArray.displayArray];
  let posEmojiArray = [];
  let negEmojiArray = [];
  let posNumValues = [];
  let negNumValues = [];
  let headerNumsArray = [...mapObj["qSortHeaderNumbers"]];

  let shouldDisplayNums;
  let displayNumbers = mapObj["useNumsPostsort"][0];
  if (displayNumbers !== undefined || displayNumbers !== null) {
    if (displayNumbers === false || displayNumbers === "false") {
      shouldDisplayNums = false;
    } else {
      shouldDisplayNums = true;
    }
  }

  let shouldDisplayText;
  let displayText = mapObj["useHeaderLabelsPostsort"][0];
  if (displayText !== undefined || displayText !== null) {
    if (displayText === false || displayText === "false") {
      shouldDisplayText = false;
    } else {
      shouldDisplayText = true;
    }
  }

  let shouldDisplayEmojis;
  let displayEmoji = mapObj["useEmojiPostsort"][0];
  if (displayEmoji !== undefined || displayEmoji !== null) {
    if (displayEmoji === false || displayEmoji === "false") {
      shouldDisplayEmojis = false;
    } else {
      shouldDisplayEmojis = true;
    }
  }

  // ***************************
  // *** INITIALIZATION *******************
  // ***************************
  const cardsArray = useMemo(() => {
    let postSortResultsObj = {};
    // ranking of all statements
    const cards2 = JSON.parse(localStorage.getItem("m_SortArray1")) || [];
    const cards = [...cards2];
    // array of objects with Q sort values for each position
    const sortCharacteristicsArray = JSON.parse(localStorage.getItem("m_SortCharacteristicsArray"));
    const showSecondPosColumn = configObj.showSecondPosColumn;
    const showSecondNegColumn = configObj.showSecondNegColumn;
    const qSortPattern = [...mapObj.qSortPattern];

    // most positive and negative values
    let posStatementsNum = qSortPattern[0];
    let negStatementsNum = qSortPattern[qSortPattern.length - 1];

    // 2nd most positive and negative values
    const posStatementsNum2 = qSortPattern[1];
    const negStatementsNum2 = qSortPattern[qSortPattern.length - 2];

    let mostPosEmoji = emojiDisplayArray[emojiDisplayArray.length - 1];
    let nextMostPosEmoji = emojiDisplayArray[emojiDisplayArray.length - 2];
    let mostNegEmoji = emojiDisplayArray[0];
    let nextMostNegEmoji = emojiDisplayArray[1];
    for (let i = 0; i < posStatementsNum; i++) {
      posEmojiArray.push(mostPosEmoji);
      posNumValues.push(headerNumsArray[headerNumsArray.length - 1].toString());
    }
    for (let j = 0; j < negStatementsNum; j++) {
      negEmojiArray.push(mostNegEmoji);
      negNumValues.push(headerNumsArray[0].toString());
    }

    // check setup
    if (showSecondPosColumn === true || showSecondPosColumn === "true") {
      posStatementsNum = +posStatementsNum + +posStatementsNum2;
      for (let i = 0; i < posStatementsNum2; i++) {
        posEmojiArray.push(nextMostPosEmoji);
        posNumValues.push(headerNumsArray[headerNumsArray.length - 2].toString());
      }
    }
    if (showSecondNegColumn === true || showSecondNegColumn === "true") {
      negStatementsNum = +negStatementsNum + +negStatementsNum2;
      for (let j = 0; j < negStatementsNum2; j++) {
        negEmojiArray.unshift(nextMostNegEmoji);
        negNumValues.unshift(headerNumsArray[1].toString());
      }
    }

    const posStatements = cards.slice(0, posStatementsNum);
    let negStatements = cards.slice(-negStatementsNum);
    let negStatementsCharacteristics = sortCharacteristicsArray.slice(-negStatementsNum);

    let posResponsesObject = {};
    let negResponsesObject = {};
    posStatements.forEach((statement, index) => {
      statement.sortValue = sortCharacteristicsArray[index].value;
      statement.header = sortCharacteristicsArray[index].header;
      statement.color = sortCharacteristicsArray[index].color;
      posResponsesObject[statement.id] = "";
    });
    negStatements.forEach((statement, index) => {
      statement.sortValue = negStatementsCharacteristics[index].value;
      statement.header = negStatementsCharacteristics[index].header;
      statement.color = negStatementsCharacteristics[index].color;
      negResponsesObject[statement.id] = "";
    });

    localStorage.setItem("m_PostSortResultsObj", JSON.stringify(postSortResultsObj));

    return [posStatements, negStatements, posResponsesObject, negResponsesObject];
  }, [mapObj.qSortPattern, configObj, emojiDisplayArray, posEmojiArray, negEmojiArray]);

  // ***************************
  // *** STATE *******************
  // ***************************
  const persistedMobilePostsortFontSize = JSON.parse(
    localStorage.getItem("m_FontSizeObject")
  ).postsort;
  const persistedMobilePostsortViewSize = JSON.parse(
    localStorage.getItem("m_ViewSizeObject")
  ).postsort;
  const mobilePostsortViewSize = useStore(getMobilePostsortViewSize);

  const [mobilePosResponses, setMobilePosResponses] = useLocalStorage(
    "m_PosRequiredStatesObj",
    cardsArray[2]
  );
  const [mobileNegResponses, setMobileNegResponses] = useLocalStorage(
    "m_NegRequiredStatesObj",
    cardsArray[3]
  );

  // ***************************
  // *** HOOKS *******************
  // ***************************

  let screenOrientation = useScreenOrientation();

  const startTimeRef = useRef(null);
  useEffect(() => {
    startTimeRef.current = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("postsort");
      localStorage.setItem("currentPage", "postsort");
      await setProgressScore(20);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTimeRef.current, "postsortPage", "postsortPage");
    };
  }, [setCurrentPage, setProgressScore]);

  // ********************************************************
  // *** EVENT HANDLING *************************************
  // ********************************************************

  const displayHelpModal = () => {
    setTriggerMobilePostsortHelpModal(true);
  };

  const handleTextareaChange = (event) => {
    const resp = JSON.parse(localStorage.getItem("m_PostSortResultsObj"));
    let resultsPostsort = JSON.parse(localStorage.getItem("resultsPostsort")) || {};

    if (resultsPostsort === null || resultsPostsort === undefined) {
      resultsPostsort = {};
    }

    const newValue2 = event.target.sortValue;
    const newValue3 = newValue2.replace("+", "");
    const newValue = newValue3.replace("-", "N");

    if (event.target.side === "positive") {
      resp[`column${newValue}:(${event.target.commentId})`] = event.target.value;
      mobilePosResponses[event.target.statementId] = event.target.value;
      setMobilePosResponses(mobilePosResponses);
    }
    if (event.target.side === "negative") {
      resp[`column${newValue}:(${event.target.commentId})`] = event.target.value;
      mobileNegResponses[event.target.statementId] = event.target.value;
      setMobileNegResponses(mobileNegResponses);
    }

    localStorage.setItem("m_PostSortResultsObj", JSON.stringify(resp));
    localStorage.setItem("resultsPostsort", JSON.stringify(resp));
  };

  // ***************************
  // *** EARLY RETURN *******************
  // ***************************

  if (screenOrientation === "landscape-primary") {
    return (
      <OrientationDiv>
        <h1>{screenOrientationText}</h1>
      </OrientationDiv>
    );
  }

  // ***************************
  // *** ELEMENTS *******************
  // ***************************

  // let shouldDisplayEmojis = true;
  // let shouldDisplayNums = false;
  // let shouldDisplayText = true;

  let posStatements = cardsArray[0].map((card, index) => {
    return (
      <div key={uuid()}>
        <InternalDiv
          fontSize={"2"}
          color={card.color}
          card={card}
          index={index}
          sortValue={card.sortValue}
          commentId={card.id}
          agree={agree}
          disagree={disagree}
        >
          <ContentWrapper>
            {shouldDisplayEmojis && <EmojiDiv>{posEmojiArray[index]}</EmojiDiv>}
            <TextDiv>
              {shouldDisplayNums && <HeaderNumber>{"+" + posNumValues[index]}</HeaderNumber>}
              {shouldDisplayText && <HeaderText>{card.header}</HeaderText>}
            </TextDiv>
            {shouldDisplayEmojis && <EmojiDiv>{posEmojiArray[index]}</EmojiDiv>}
          </ContentWrapper>

          {/* <HeaderDivPos>{card.header}</HeaderDivPos> */}
          <HeaderCardStatement>{card.statement}</HeaderCardStatement>
        </InternalDiv>
        <DebouncedTextarea
          delay={500}
          id={`m_PostsortComment(${card.id})`}
          placeholder={placeholder}
          required={required}
          index={index}
          commentId={card.id}
          sortValue={card.sortValue}
          onChange={handleTextareaChange}
          statementId={card.id}
          side="positive"
          highlight={showPostsortCommentHighlighting}
        />
      </div>
    );
  });

  let negStatements = cardsArray[1].map((card, index) => {
    return (
      <div key={uuid()}>
        <InternalDiv
          card={card}
          color={card.color}
          index={index}
          agree={agree}
          commentId={card.id}
          sortValue={card.sortValue}
          disagree={disagree}
        >
          <ContentWrapper>
            {shouldDisplayEmojis && <EmojiDiv>{negEmojiArray[index]}</EmojiDiv>}
            <TextDiv>
              {shouldDisplayNums && <HeaderNumber>{negNumValues[index]}</HeaderNumber>}
              {shouldDisplayText && <HeaderText>{card.header}</HeaderText>}
            </TextDiv>
            {shouldDisplayEmojis && <EmojiDiv>{negEmojiArray[index]}</EmojiDiv>}
          </ContentWrapper>
          <HeaderCardStatement>{card.statement}</HeaderCardStatement>
        </InternalDiv>
        <DebouncedTextarea
          onChange={handleTextareaChange}
          delay={500}
          id={`m_PostsortComment(${card.id})`}
          placeholder={placeholder}
          index={index}
          required={required}
          sortValue={card.sortValue}
          commentId={card.id}
          side="negative"
          statementId={card.id}
          highlight={showPostsortCommentHighlighting}
        ></DebouncedTextarea>
      </div>
    );
  });

  return (
    <Container>
      <SortTitleBar background={configObj.headerBarColor}>
        {sortbarText}
        <HelpContainer onClick={displayHelpModal}>
          <HelpSymbol />
        </HelpContainer>
      </SortTitleBar>

      <MobileModal
        head={preventNavHead}
        text={preventNavText}
        trigger={triggerPreventNavModal}
        setTrigger={setTriggerPreventNavModal}
        showArrow={false}
        height={"150px"}
      />

      <MobileModal
        head={helpHead}
        text={helpText}
        trigger={triggerHelpModal}
        setTrigger={setTriggerHelpModal}
        showArrow={false}
        height={"150px"}
      />
      <InnerContainer
        viewSize={
          mobilePostsortViewSize === +persistedMobilePostsortViewSize
            ? mobilePostsortViewSize
            : persistedMobilePostsortViewSize
        }
        fontSize={
          mobilePostsortFontSize === +persistedMobilePostsortFontSize
            ? mobilePostsortFontSize
            : persistedMobilePostsortFontSize
        }
      >
        {posStatements}
        {negStatements}
      </InnerContainer>
      <BoxSizeMessage>{expandViewMessage}</BoxSizeMessage>
    </Container>
  );
};

export default MobilePostsort;

const SortTitleBar = styled.div`
  display: flex;
  width: 100vw;
  padding-left: 10px;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 30px;
  background-color: ${(props) => props.background};
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 4.5vw;
  user-select: none;
`;

const HelpContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 5px;
  align-items: center;
  padding-bottom: 5px;
  width: 20px;
  height: 20px;
  color: black;
  font-size: 2.5vh;
  font-weight: bold;
  user-select: none;
`;

const InnerContainer = styled.div`
  display: flex;
  align-self: top;
  justify-self: center;
  margin-top: 10px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }};
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  background-color: #e5e5e5;
  width: 90vw;
  height: ${(props) => `${props.viewSize}vh`};
  align-items: center;
  border-radius: 3px;
  text-align: center;
  overflow-x: none;
  overflow-y: auto;
  padding-bottom: 10px;
  padding-top: 10px;
  border-radius: 5px;
  border: 1px solid black;
`;

const InternalDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  box-sizing: border-box;
  background-color: ${(props) => props.color};
  width: 80vw;
  min-height: 8vh;
  /* font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }}; */
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  text-align: center;
  outline: 1px solid black;
  padding: 5px;
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

const OrientationDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  width: 100vw;
  height: 100vh;
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

const HeaderDivPos = styled.div`
  height: 16px;
  margin-bottom: 4px;
`;

const HeaderCardStatement = styled.div`
  background-color: lightgray;
  border-radius: 3px;
  padding: 5px;
  outline: 1px solid darkgray;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-right: 2px;
  padding-left: 2px;
`;

const HeaderNumber = styled.span`
  font-weight: bold;
  font-size: 16px;
  line-height: 1;
`;

const EmojiDiv = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderText = styled.div`
  display: flex;
  padding-top: 2px;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  font-size: 4vw;
  text-align: center;
  line-height: 0.8rem;
`;

const TextDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;
