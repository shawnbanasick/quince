import { useEffect, useRef } from "react";
import LowCards from "./LowCards";
import LowCards2 from "./LowCards2";
import HighCards from "./HighCards";
import HighCards2 from "./HighCards2";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import PostsortHelpModal from "./PostsortHelpModal";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PromptUnload from "../../utilities/PromptUnload";
import PostsortPreventNavModal from "./PostsortPreventNavModal";

/* eslint react/prop-types: 0 */

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getMapObj = (state) => state.mapObj;
const getSetProgressScore = (state) => state.setProgressScore;
const getCardHeightPostsort = (state) => state.cardHeightPostsort;
const getCardFontSizePostsort = (state) => state.cardFontSizePostsort;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;

const PostSort = () => {
  const ElementRef = useRef(null);

  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const mapObj = useSettingsStore(getMapObj);
  const configObj = useSettingsStore(getConfigObj);
  const setProgressScore = useStore(getSetProgressScore);
  let cardHeightPostsort = useStore(getCardHeightPostsort);
  let cardFontSizePostsort = useStore(getCardFontSizePostsort);
  const setCurrentPage = useStore(getSetCurrentPage);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);

  // PERSISTENT STATE
  const columnStatements = JSON.parse(localStorage.getItem("columnStatements"));
  let cardFontSizePersist = +JSON.parse(localStorage.getItem("fontSizePostsort"));
  let cardHeightPersist = +JSON.parse(localStorage.getItem("cardHeightPostsort"));

  if (cardFontSizePersist) {
    cardFontSizePostsort = cardFontSizePersist;
  }

  if (cardHeightPersist) {
    cardHeightPostsort = cardHeightPersist;
  }

  // set next button display
  setDisplayNextButton(true);

  const headerBarColor = configObj.headerBarColor;
  const postsortInstructions = ReactHtmlParser(decodeHTML(langObj.postsortInstructions)) || "";

  useEffect(() => {
    const Elementcount = ElementRef.current.childNodes.length;
    localStorage.setItem("postsortCommentCardCount", Elementcount - 1);
  });

  const startTimeRef = useRef(null);
  useEffect(() => {
    startTimeRef.current = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("postsort");
      localStorage.setItem("currentPage", "postsort");
      await setProgressScore(50);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTimeRef.current, "postsortPage", "postsortPage");
    };
  }, [setCurrentPage, setProgressScore]);

  // pull data from localStorage
  const columnWidth = 250;

  const titleText = ReactHtmlParser(decodeHTML(langObj.postsortHeader)) || "";
  const agree = ReactHtmlParser(decodeHTML(langObj.postsortAgreement)) || "";
  const placedOn = ReactHtmlParser(decodeHTML(langObj.postsortPlacedOn)) || "";
  const disagree = ReactHtmlParser(decodeHTML(langObj.postsortDisagreement)) || "";
  const placeholder = langObj.placeholder;

  const keys = Object.keys(mapObj.postsortConvertObj);
  const agreeColDisp1 = keys.pop();
  const agreeColDisp2 = keys.pop();
  const disagreeColDisp1 = keys.shift();
  const disagreeColDisp2 = keys.shift();

  const postsortAgreeColDisp1 = agreeColDisp1;
  const postsortAgreeColDisp2 = agreeColDisp2;
  const showSecondPosColumn = configObj.showSecondPosColumn;
  const postsortDisagreeColDisp1 = disagreeColDisp1;
  const postsortDisagreeColDisp2 = disagreeColDisp2;
  const showSecondNegColumn = configObj.showSecondNegColumn;

  const agreeObj = {};
  agreeObj.agreeText = agree;
  agreeObj.columnDisplay = [postsortAgreeColDisp1];
  agreeObj.columnDisplay2 = [postsortAgreeColDisp2];
  agreeObj.displaySecondColumn = showSecondPosColumn;
  agreeObj.placeholder = placeholder;
  agreeObj.placedOn = placedOn;

  const disagreeObj = {};
  disagreeObj.disagreeText = disagree;
  disagreeObj.columnDisplay = [postsortDisagreeColDisp1];
  disagreeObj.columnDisplay2 = [postsortDisagreeColDisp2];
  disagreeObj.displaySecondColumn = showSecondNegColumn;
  disagreeObj.placeholder = placeholder;
  disagreeObj.placedOn = placedOn;

  const highCards = columnStatements?.vCols[agreeObj.columnDisplay];
  const highCards2 = columnStatements?.vCols[agreeObj.columnDisplay2];
  // const neutralCards = columnStatements.vCols[neutralObj.columnDisplay];
  const lowCards = columnStatements?.vCols[disagreeObj.columnDisplay];
  const lowCards2 = columnStatements?.vCols[disagreeObj.columnDisplay2];

  return (
    <div>
      <PromptUnload />
      <PostsortHelpModal />
      <PostsortPreventNavModal />
      <SortTitleBar background={headerBarColor}>{titleText}</SortTitleBar>
      <CardsContainer ref={ElementRef}>
        <PostsortInstructions>{postsortInstructions}</PostsortInstructions>
        <HighCards
          agreeObj={agreeObj}
          height={cardHeightPostsort}
          cardFontSize={cardFontSizePostsort}
          width={columnWidth}
          highCards={highCards}
        />
        {agreeObj.displaySecondColumn && (
          <HighCards2
            agreeObj={agreeObj}
            height={cardHeightPostsort}
            cardFontSize={cardFontSizePostsort}
            width={columnWidth}
            highCards2={highCards2}
          />
        )}
        {disagreeObj.displaySecondColumn && (
          <LowCards2
            disagreeObj={disagreeObj}
            height={cardHeightPostsort}
            cardFontSize={cardFontSizePostsort}
            width={columnWidth}
            lowCards2={lowCards2}
          />
        )}
        <LowCards
          disagreeObj={disagreeObj}
          height={cardHeightPostsort}
          cardFontSize={cardFontSizePostsort}
          width={columnWidth}
          lowCards={lowCards}
        />
      </CardsContainer>
    </div>
  );
};

export default PostSort;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 150px;
  margin-top: 50px;
`;

const SortTitleBar = styled.div`
  width: 100vw;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 50px;
  background-color: ${(props) => props.background};
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  color: white;
  font-weight: bold;
  font-size: 28px;
  position: fixed;
  top: 0;
`;

const PostsortInstructions = styled.div`
  display: flex;
  justify-self: center;
  align-self: center;
  margin-top: 30px;
  text-align: center;
  user-select: none;
  color: black;
  font-size: 2vh;
  font-weight: normal;
  max-width: 1100px;
`;
