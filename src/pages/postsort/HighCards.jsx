import { useState } from "react";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import sanitizeString from "../../utilities/sanitizeString";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import { Modal } from "react-responsive-modal";
import useLocalStorage from "../../utilities/useLocalStorage";
import Emoji2 from "../../assets/emoji2.svg?react";
import Emoji3 from "../../assets/emoji3.svg?react";
import Emoji5 from "../../assets/emoji5.svg?react";

/* eslint react/prop-types: 0 */

// format example ===> {high: ["column4"], middle: ["column0"], low: ["columnN4"]}

const getPostsortCommentCheckObj = (state) => state.postsortCommentCheckObj;
const getSetPostsortCommentCheckObj = (state) => state.setPostsortCommentCheckObj;
const getConfigObj = (state) => state.configObj;
const getMapObject = (state) => state.mapObj;
const getShowPostsortCommentHighlighting = (state) => state.showPostsortCommentHighlighting;
const getPostsortDualImageArray = (state) => state.postsortDualImageArray;
const getSetPostsortDualImageArray = (state) => state.setPostsortDualImageArray;

const HighCards = (props) => {
  // console.log("props", props);
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
    "HC-requiredCommentsObj",
    {}
  );

  // GLOBAL STATE
  const postsortCommentCheckObj = useStore(getPostsortCommentCheckObj);
  const setPostsortCommentCheckObj = useStore(getSetPostsortCommentCheckObj);
  const configObj = useSettingsStore(getConfigObj);
  const mapObj = useSettingsStore(getMapObject);
  const showPostsortCommentHighlighting = useStore(getShowPostsortCommentHighlighting);
  const postsortDualImageArray = useStore(getPostsortDualImageArray);
  const setPostsortDualImageArray = useStore(getSetPostsortDualImageArray);
  const { agreeObj, cardFontSize, width, height } = props;
  const highCards = columnStatements?.vCols[agreeObj.columnDisplay];
  let { placeholder, placedOn } = agreeObj;
  let columnDisplay = agreeObj.columnDisplay;

  // IMAGES RELATED
  let useImages = configObj.useImages;
  if (useImages === "false") useImages = false;
  if (useImages === "true") useImages = true;

  // get header text
  let columnLabel = "";
  if (mapObj["mobileHeadersText"]) {
    let headersTextArray = [...mapObj["mobileHeadersText"]];
    columnLabel = headersTextArray[headersTextArray.length - 1];
  }

  let columnNum = "";
  if (mapObj["useNumsPostsort"]) {
    let headersNumArray = [...mapObj["qSortHeaderNumbers"]];
    columnNum = `${placedOn} +${headersNumArray[headersNumArray.length - 1]}`;
  }

  const getEmoji = (selector) => {
    if (selector[0] === "emoji5Array") {
      return <Emoji5 key="emoji5" />;
    }
    if (selector[0] === "emoji4Array") {
      return <Emoji5 key="emoji5" />;
    }
    if (selector[0] === "emoji3Array") {
      return <Emoji3 key="emoji3" />;
    }
    if (selector[0] === "emoji2Array") {
      return <Emoji2 key="emoji2" />;
    }
  };

  const backgroundColor1 = [...mapObj["columnHeadersColorsArray"]];
  const backgroundColor = backgroundColor1[backgroundColor1.length - 1];

  let highlighting = true;
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

  let agreeTextElement = (
    <RowDiv>
      {shouldDisplayEmojis && <EmojiDiv>{getEmoji(mapObj["emojiArrayType"])}</EmojiDiv>}
      {/* {agreeText} */}
      {shouldDisplayText && <HeaderText>{columnLabel}</HeaderText>}
      {shouldDisplayNums && <HeaderNumber>{columnNum}</HeaderNumber>}
      {shouldDisplayEmojis && <EmojiDiv>{getEmoji(mapObj["emojiArrayType"])}</EmojiDiv>}
    </RowDiv>
  );

  let noResponseCheckArrayHC1 = [];
  props.highCards.forEach((item, index) => {
    let idString = `${columnDisplay}_${index}: ${item.id}`;
    noResponseCheckArrayHC1.push(idString);
  });
  localStorage.setItem("noResponseCheckArrayHC1", JSON.stringify(noResponseCheckArrayHC1));

  // on double click of card, enlarge image
  const handleOpenImageModal = (e) => {
    console.log(e);
    if (!e.target) return;
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

  // on leaving card comment section
  const handleChange = (event, itemId) => {
    event.preventDefault();
    const results = JSON.parse(localStorage.getItem("resultsPostsort")) || {};
    let allCommentsObj = JSON.parse(localStorage.getItem("allCommentsObj")) || {};

    // set comment check object for Results formatting on Submit page
    let commentLength = event.target.value.length;
    if (commentLength > 0) {
      postsortCommentCheckObj[`hc-${itemId}`] = true;
      setPostsortCommentCheckObj(postsortCommentCheckObj);
    } else {
      postsortCommentCheckObj[`hc-${itemId}`] = false;
      setPostsortCommentCheckObj(postsortCommentCheckObj);
    }
    const cards = columnStatements.vCols[agreeObj.columnDisplay];
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
        let comment = comment2.replace(/,/g, " ").trim();
        // assign to main data object for confirmation / debugging
        if (comment.length > 0) {
          el.comment = sanitizeString(comment);

          results[identifier] = `(${el.id}): ${comment}`;
          // setup persistence for comments
          allCommentsObj[identifier] = `(${el.id}): ${comment}`;
          allCommentsObj[`textArea-${columnDisplay}_${itemId + 1}`] = `${comment}`;
          setRequiredCommentsObject((requiredCommentsObject) => {
            return { ...requiredCommentsObject, [`hc-${itemId}`]: true };
          });
        } else {
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
  }; // END handleChange

  // MAP cards to DOM
  return highCards.map((item, index) => {
    let content = ReactHtmlParser(`<div>${decodeHTML(item.statement)}</div>`);
    let allCommentsObj = JSON.parse(localStorage.getItem("allCommentsObj")) || {};
    let cardComment = allCommentsObj[`textArea-${columnDisplay}_${+index + 1}`];

    if (configObj.useImages === true) {
      content = ReactHtmlParser(
        `<img src="${item.element.props.src}" style="pointer-events: all" alt=${item.element.props.alt} />`
      );
    }

    if (
      configObj.postsortCommentsRequired === "true" ||
      configObj.postsortCommentsRequired === true
    ) {
      // if comments are required, highlight if no comment
      if (showPostsortCommentHighlighting === true) {
        highlighting = requiredCommentsObject[`hc-${index}`];
      }
    }

    return (
      <Container id="postSortImageModal" key={item.statement}>
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
          {agreeTextElement}{" "}
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
                handleChange(e, index);
              }}
            />
          </TagContainerDiv>
        </CardAndTextHolder>
      </Container>
    );
  });
};

export default HighCards;

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
  text-align: center;
  /* padding-top: 3px; */
  width: 100%;
  background: ${(props) => `${props.backgroundColor}`};
  font-size: ${(props) => `${props.cardFontSize}px`};
  color: black;
  text-align: center;
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
  //max-width: ${(props) => (props.useImages ? `none` : `${props.width}px;`)};
  border-radius: 5px;
  font-size: ${(props) => `${props.cardFontSize}px`};
  display: flex;
  align-items: center;
  user-select: none;
  justify-content: center;
  border: 2px solid darkslategray;
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
  text-align: center;
  font-weight: bold;
  font-size: clamp(1rem, 1vw, 1.5rem);
  user-select: none;

  text-align: center;
  line-height: 0.8rem;
`;

const HeaderNumber = styled.span`
  font-weight: bold;
  padding-top: 3px;
  font-size: clamp(1rem, 1vw, 1.5rem);
  line-height: 1;
`;
