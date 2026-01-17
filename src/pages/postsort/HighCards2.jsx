import { useState } from "react";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import sanitizeString from "../../utilities/sanitizeString";
import useStore from "../../globalState/useStore";
import useSettingsStore from "../../globalState/useSettingsStore";
import { Modal } from "react-responsive-modal";
import useLocalStorage from "../../utilities/useLocalStorage";
import Emoji1 from "../../assets/emoji1.svg?react";
import Emoji2 from "../../assets/emoji2.svg?react";
import Emoji3 from "../../assets/emoji3.svg?react";
import Emoji5 from "../../assets/emoji5.svg?react";
import { minWordCount } from "./minWordCount";

/* eslint react/prop-types: 0 */

// format example ===> {high: ["column4"], middle: ["column0"], low: ["columnN4"]}

const getPostsortCommentCheckObj = (state) => state.postsortCommentCheckObj;
const getSetPostsortCommentCheckObj = (state) => state.setPostsortCommentCheckObj;
const getConfigObj = (state) => state.configObj;
const getShowPostsortCommentHighlighting = (state) => state.showPostsortCommentHighlighting;
const getPostsortDualImageArray = (state) => state.postsortDualImageArray;
const getSetPostsortDualImageArray = (state) => state.setPostsortDualImageArray;
const getMapObject = (state) => state.mapObj;

const HighCards2Display = (props) => {
  // HELPER FUNCTION
  const asyncLocalStorage = {
    async setItem(key, value) {
      await null;
      return localStorage.setItem(key, value);
    },
  };

  // LOCAL STATE
  const [openImageModal, setOpenImageModal] = useState(false);
  const [imageSource, setImageSource] = useState("");
  const [openDualImageModal, setOpenDualImageModal] = useState(false);

  // PERSISTED STATE
  const columnStatements = JSON.parse(localStorage.getItem("sortColumns"));

  const [requiredCommentsObject, setRequiredCommentsObject] = useLocalStorage(
    "HC2-requiredCommentsObj",
    {}
  );
  // GLOBAL STATE
  const postsortCommentCheckObj = useStore(getPostsortCommentCheckObj);
  const setPostsortCommentCheckObj = useStore(getSetPostsortCommentCheckObj);
  const configObj = useSettingsStore(getConfigObj);
  const showPostsortCommentHighlighting = useStore(getShowPostsortCommentHighlighting);
  const postsortDualImageArray = useStore(getPostsortDualImageArray);
  const setPostsortDualImageArray = useStore(getSetPostsortDualImageArray);
  const mapObj = useSettingsStore(getMapObject);
  const { height, width, agreeObj, cardFontSize } = props;
  const highCards2 = columnStatements.vCols[agreeObj.columnDisplay2];
  let { placeholder, placedOn } = agreeObj;
  let columnDisplay = agreeObj.columnDisplay2;

  // IMAGES RELATED
  let useImages = configObj.useImages;
  if (useImages === "false") useImages = false;
  if (useImages === "true") useImages = true;

  // let minWordCountValue = configObj.minWordCountPostsort || 0;
  // const minWordCountRequired = configObj.minWordCountPostsort || false;
  let minWordCountValue = 20;
  let minWordCountRequired = true;

  // get header text
  let columnLabel = "";
  if (mapObj["colTextLabelsArray"]) {
    let headersTextArray = [...mapObj["colTextLabelsArray"]];
    columnLabel = headersTextArray[headersTextArray.length - 2];
  }

  let columnNum = "";
  if (mapObj["useColLabelNumsPostsort"]) {
    let headersNumArray = [...mapObj["qSortHeaderNumbers"]];
    columnNum = `${placedOn} +${headersNumArray[headersNumArray.length - 2]}`;
  }

  const getEmoji = (selector) => {
    if (selector[0] === "emoji5Array") {
      return <Emoji5 key="emoji5" />;
    }
    if (selector[0] === "emoji4Array") {
      return <Emoji3 key="emoji3" />;
    }
    if (selector[0] === "emoji3Array") {
      return <Emoji2 key="emoji2" />;
    }
    if (selector[0] === "emoji2Array") {
      return <Emoji1 key="emoji1" />;
    }
  };

  const backgroundColor1 = [...mapObj["columnHeadersColorsArray"]];
  const backgroundColor = backgroundColor1[backgroundColor1.length - 2];

  let shouldDisplayNums;
  let displayNumbers = mapObj["useColLabelNumsPostsort"][0];

  if (displayNumbers !== undefined || displayNumbers !== null) {
    if (displayNumbers === false || displayNumbers === "false") {
      shouldDisplayNums = false;
    } else {
      shouldDisplayNums = true;
    }
  }

  let shouldDisplayText;
  let displayText = mapObj["useColLabelTextPostsort"][0];

  if (displayText !== undefined || displayText !== null) {
    if (displayText === false || displayText === "false") {
      shouldDisplayText = false;
    } else {
      shouldDisplayText = true;
    }
  }

  let shouldDisplayEmojis;
  let displayEmoji = mapObj["useColLabelEmojiPostsort"][0];
  if (displayEmoji !== undefined || displayEmoji !== null) {
    if (displayEmoji === false || displayEmoji === "false") {
      shouldDisplayEmojis = false;
    } else {
      shouldDisplayEmojis = true;
    }
  }

  let agreeTextElement = (
    <RowDiv>
      {shouldDisplayEmojis && <EmojiDiv>{getEmoji(mapObj["emojiArrayType"])}</EmojiDiv>}
      {/* {agreeText} */}
      {shouldDisplayText && <HeaderText>{columnLabel}</HeaderText>}
      {shouldDisplayNums && <HeaderNumber>{columnNum}</HeaderNumber>}
      {shouldDisplayEmojis && <EmojiDiv>{getEmoji(mapObj["emojiArrayType"])}</EmojiDiv>}
    </RowDiv>
  );

  let noResponseCheckArrayHC2 = [];
  props.highCards2.forEach((item, index) => {
    let idString = `${columnDisplay}_${index}: ${item.id}`;
    noResponseCheckArrayHC2.push(idString);
  });
  localStorage.setItem("noResponseCheckArrayHC2", JSON.stringify(noResponseCheckArrayHC2));

  // enlarge images on double click
  const handleOpenImageModal = (e) => {
    if (e.detail === 2) {
      if (e.shiftKey) {
        postsortDualImageArray.push(e.target.src);
        setPostsortDualImageArray(postsortDualImageArray);
        if (postsortDualImageArray.length === 2) {
          setOpenDualImageModal(true);
        }
      } else {
        setImageSource(e.target.src);
        setOpenImageModal(true);
      }
    }
  };

  // on leaving card comment section,
  const onChange = (event, itemId) => {
    const results = JSON.parse(localStorage.getItem("resultsPostsort")) || {};
    let allCommentsObj = JSON.parse(localStorage.getItem("allCommentsObj")) || {};

    // set comment check object for Results formatting on Submit page
    let commentLength = event.target.value.length;
    if (commentLength > 0) {
      postsortCommentCheckObj[`hc2-${itemId}`] = true;
      setPostsortCommentCheckObj(postsortCommentCheckObj);
    } else {
      postsortCommentCheckObj[`hc2-${itemId}`] = false;
      setPostsortCommentCheckObj(postsortCommentCheckObj);
    }
    const cards = columnStatements?.vCols[agreeObj.columnDisplay2];
    const targetCard = event.target.id;
    const userEnteredText = event.target.value;
    const identifier = `${columnDisplay}_${+itemId}`;

    // to update RESULTS storage for just the card that changed
    // results format  ===> { column3_1: "(image3) yes I think so" }
    cards.map((el) => {
      if (el.id === targetCard) {
        const comment3 = userEnteredText;
        // remove new line and commas to make csv export easier
        const comment2 = comment3.replace(/\n/g, " ");
        const comment = comment2.replace(/,/g, " ").trim();
        // assign to main data object for confirmation / debugging
        let cleanedComment = sanitizeString(comment);
        el.comment = cleanedComment;
        // input word count default value to 0
        let inputWordCount = 0;
        // if there is comment text
        if (cleanedComment.length > 0) {
          // check word count total of non-CJ words and CJ characters
          const minWordCountObj = minWordCount(cleanedComment);
          let totalNonCjk = minWordCountObj.totalWords;
          let totalCJK = minWordCountObj.totalCJK;
          inputWordCount = totalNonCjk + totalCJK;

          // setup persistence for comments
          results[identifier] = `(${el.id}): ${cleanedComment}`;
          allCommentsObj[identifier] = `(${el.id}): ${cleanedComment}`;
          allCommentsObj[`textArea-${columnDisplay}_${itemId + 1}`] = `${cleanedComment}`;

          // if min word count is required
          if (minWordCountRequired) {
            if (inputWordCount > minWordCountValue) {
              // enough word = allow navigation
              setRequiredCommentsObject((requiredCommentsObject) => {
                return { ...requiredCommentsObject, [`hc-${itemId}`]: true };
              });
            } else {
              // not enough words = prevent navigation
              setRequiredCommentsObject((requiredCommentsObject) => {
                return { ...requiredCommentsObject, [`hc-${itemId}`]: false };
              });
            }
          } else {
            // no min word count required = allow navigation because there is a response
            setRequiredCommentsObject((requiredCommentsObject) => {
              return { ...requiredCommentsObject, [`hc-${itemId}`]: true };
            });
          }
        } else {
          // no response = prevent navigation
          el.comment = "";
          results[identifier] = `(${el.id}): no response`;
          allCommentsObj[identifier] = `(${el.id}): no response`;
          allCommentsObj[`textArea-${columnDisplay}_${itemId + 1}`] = "";
          setRequiredCommentsObject((requiredCommentsObject) => {
            return { ...requiredCommentsObject, [`hc-${itemId}`]: false };
          });
        }
      }
      return el;
    });
    asyncLocalStorage.setItem("allCommentsObj", JSON.stringify(allCommentsObj));
    asyncLocalStorage.setItem("resultsPostsort", JSON.stringify(results));
  }; // end onBlur

  // render elements
  return highCards2.map((item, index) => {
    let content = ReactHtmlParser(`<div>${decodeHTML(item.statement)}</div>`);
    let allCommentsObj = JSON.parse(localStorage.getItem("allCommentsObj")) || {};
    let cardComment = allCommentsObj[`textArea-${columnDisplay}_${+index + 1}`] || "";

    if (configObj.useImages === true) {
      content = ReactHtmlParser(
        `<img src="${item.element.props.src}" style="pointer-events: all" alt=${item.element.props.alt} />`
      );
    }

    let highlighting = true;
    if (
      configObj.postsortCommentsRequired === "true" ||
      configObj.postsortCommentsRequired === true
    ) {
      if (showPostsortCommentHighlighting === true) {
        highlighting = requiredCommentsObject[`hc2-${index}`];
      }
    }

    return (
      <Container key={item.statement}>
        <Modal
          open={openImageModal}
          center
          onClose={() => setOpenImageModal(false)}
          classNames={{
            modal: `${configObj.imageFormat}`,
            overlay: "dualImageOverlay",
          }}
        >
          <img src={imageSource} width="100%" height="auto" alt="modalImage" />
        </Modal>
        <Modal
          open={openDualImageModal}
          center
          onClose={() => {
            setOpenDualImageModal(false);
            setPostsortDualImageArray([]);
          }}
          classNames={{ overlay: "dualImageOverlay", modal: "dualImageModal" }}
        >
          <img src={postsortDualImageArray[0]} width="49.5%" height="auto" alt="modalImage" />
          <img
            src={postsortDualImageArray[1]}
            width="49.5%"
            height="auto"
            style={{ marginLeft: "1%" }}
            alt="modalImage2"
          />
        </Modal>
        <CardTag cardFontSize={cardFontSize} backgroundColor={backgroundColor}>
          {agreeTextElement}
        </CardTag>
        <CardAndTextHolder>
          {useImages ? (
            <Card
              cardFontSize={cardFontSize}
              width={width}
              height={height}
              cardColor={item.cardColor}
              onClick={(e) => handleOpenImageModal(e, item.element.props.src)}
            >
              {content}
            </Card>
          ) : (
            <Card
              cardFontSize={cardFontSize}
              width={width}
              height={height}
              cardColor={item.cardColor}
            >
              {content}
            </Card>
          )}
          <TagContainerDiv>
            <CommentArea
              bgColor={highlighting}
              border={highlighting}
              data-gramm_editor="false"
              height={height}
              cardFontSize={cardFontSize}
              id={item.id}
              placeholder={placeholder}
              defaultValue={cardComment}
              onChange={(e) => {
                onChange(e, index);
              }}
            />
          </TagContainerDiv>
        </CardAndTextHolder>
      </Container>
    );
  });
};

export default HighCards2Display;

const Container = styled.div`
  width: 90vw;
  max-width: 1100px;
  margin-top: 50px;
  border-radius: 3px;
  border: 1px solid darkgray;
`;

const CardTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: ${(props) => `${props.backgroundColor}`};
  color: black;
  text-align: center;
  font-size: ${(props) => `${props.cardFontSize}px`};
  height: 1.5em;
`;

const CardAndTextHolder = styled.div`
  display: flex;
  align-content: center;
  background: rgb(224, 224, 224);
  width: 100%;
`;

const CommentArea = styled.textarea`
  padding: 10px;
  margin-top: 2px;
  background-color: ${(props) => (props.bgColor ? "whitesmoke" : "rgba(253, 224, 71, .5)")};
  height: ${(props) => `${props.height}px;`};
  font-size: ${(props) => `${props.cardFontSize}px`};
  width: calc(100% - 6px);
  border: 2px solid darkgray;
  border-radius: 3px;
  outline: ${(props) => (props.border ? "none" : "dashed 3px black")};
`;

const TagContainerDiv = styled.div`
  padding-top: 3px;
  width: 100%;
`;

const Card = styled.div`
  user-select: "none";
  padding: 0 2px 0 2px;
  margin: 5px 5px 5px 5px;
  line-height: 1em;
  height: ${(props) => `${props.height}px;`};
  width: 35vw;
  // max-width: ${(props) => `${props.width}px;`};
  border-radius: 5px;
  font-size: ${(props) => `${props.cardFontSize}px`};
  display: flex;
  align-items: center;
  user-select: none;
  justify-content: center;
  border: 2px solid black;
  background-color: #f6f6f6;
  text-align: center;

  img {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }
`;

const EmojiDiv = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const HeaderText = styled.div`
  display: flex;
  padding-top: 3px;
  justify-content: center;
  flex-wrap: wrap;
  font-weight: bold;
  text-align: center;
  font-size: clamp(1rem, 1vw, 1.5rem);
  text-align: center;
  line-height: 0.8rem;
`;

const HeaderNumber = styled.span`
  font-weight: bold;
  padding-top: 3px;
  font-size: clamp(1rem, 1vw, 1.5rem);
  line-height: 1;
`;
