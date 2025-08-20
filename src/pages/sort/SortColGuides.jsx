import styled from "styled-components";
import { v4 as uuid } from "uuid";
import useSettingsStore from "../../globalState/useSettingsStore";
import EmojiN5 from "../../assets/emojiN5.svg?react";
import EmojiN4 from "../../assets/emojiN4.svg?react";
import EmojiN3 from "../../assets/emojiN3.svg?react";
import EmojiN2 from "../../assets/emojiN2.svg?react";
import EmojiN1 from "../../assets/emojiN1.svg?react";
import Emoji0 from "../../assets/emoji0.svg?react";
import Emoji1 from "../../assets/emoji1.svg?react";
import Emoji2 from "../../assets/emoji2.svg?react";
import Emoji3 from "../../assets/emoji3.svg?react";
import Emoji4 from "../../assets/emoji4.svg?react";
import Emoji5 from "../../assets/emoji5.svg?react";

const getMapObj = (state) => state.mapObj;

const SortColGuides = (props) => {
  // STATE
  const mapObj = useSettingsStore(getMapObj);

  const emoji5Array = [
    <EmojiN5 key={uuid()} />,
    <EmojiN4 key={uuid()} />,
    <EmojiN3 key={uuid()} />,
    <EmojiN2 key={uuid()} />,
    <EmojiN1 key={uuid()} />,
    <Emoji0 key={uuid()} />,
    <Emoji1 key={uuid()} />,
    <Emoji2 key={uuid()} />,
    <Emoji3 key={uuid()} />,
    <Emoji4 key={uuid()} />,
    <Emoji5 key={uuid()} />,
  ];

  const emoji4Array = [
    <EmojiN5 key={uuid()} />,
    <EmojiN3 key={uuid()} />,
    <EmojiN2 key={uuid()} />,
    <EmojiN1 key={uuid()} />,
    <Emoji0 key={uuid()} />,
    <Emoji1 key={uuid()} />,
    <Emoji2 key={uuid()} />,
    <Emoji3 key={uuid()} />,
    <Emoji5 key={uuid()} />,
  ];

  const emoji3Array = [
    <EmojiN3 key={uuid()} />,
    <EmojiN2 key={uuid()} />,
    <EmojiN1 key={uuid()} />,
    <Emoji0 key={uuid()} />,
    <Emoji1 key={uuid()} />,
    <Emoji2 key={uuid()} />,
    <Emoji3 key={uuid()} />,
  ];

  const emoji2Array = [
    <EmojiN2 key={uuid()} />,
    <EmojiN1 key={uuid()} />,
    <Emoji0 key={uuid()} />,
    <Emoji1 key={uuid()} />,
    <Emoji2 key={uuid()} />,
  ];

  let displayArray = [];
  if (mapObj["emojiArrayType"][0] === "emoji5Array") {
    displayArray = [...emoji5Array];
  }
  if (mapObj["emojiArrayType"][0] === "emoji4Array") {
    displayArray = [...emoji4Array];
  }
  if (mapObj["emojiArrayType"][0] === "emoji3Array") {
    displayArray = [...emoji3Array];
  }
  if (mapObj["emojiArrayType"][0] === "emoji2Array") {
    displayArray = [...emoji2Array];
  }

  const qSortHeaderNumbers = [...mapObj.qSortHeaderNumbers];
  const columnHeadersColorsArray = [...mapObj.columnHeadersColorsArray];
  let columnWidth = +props.columnWidth;
  const textHeaders = [...mapObj.mobileHeadersText];

  let shouldDisplayNums;
  let displayNumbers = mapObj["useColLabelNums"][0];
  if (displayNumbers !== undefined || displayNumbers !== null) {
    if (displayNumbers === false || displayNumbers === "false") {
      shouldDisplayNums = false;
    } else {
      shouldDisplayNums = true;
    }
  }

  let shouldDisplayText;
  let displayText = mapObj["useColLabelText"][0];
  if (displayText !== undefined || displayText !== null) {
    if (displayText === false || displayText === "false") {
      shouldDisplayText = false;
    } else {
      shouldDisplayText = true;
    }
  }

  let shouldDisplayEmojis;
  let displayEmoji = mapObj["useColLabelEmoji"][0];
  if (displayEmoji !== undefined || displayEmoji !== null) {
    if (displayEmoji === false || displayEmoji === "false") {
      shouldDisplayEmojis = false;
    } else {
      shouldDisplayEmojis = true;
    }
  }

  return (
    <ColorBarDivContainer id="colorBarDivContainer">
      {qSortHeaderNumbers.map((value, index) => {
        // widthValue
        return (
          <ColorBarDiv
            key={uuid()}
            width={columnWidth}
            color={columnHeadersColorsArray[index]}
            count={columnHeadersColorsArray.length}
          >
            <ContentWrapper>
              {shouldDisplayEmojis && <EmojiDiv>{displayArray[index]}</EmojiDiv>}
              <TextDiv>
                {shouldDisplayNums && <HeaderNumber>{value}</HeaderNumber>}
                {shouldDisplayText && <HeaderText>{textHeaders[index]}</HeaderText>}
              </TextDiv>
              {shouldDisplayEmojis && <EmojiDiv>{displayArray[index]}</EmojiDiv>}
            </ContentWrapper>
          </ColorBarDiv>
        );
      })}
    </ColorBarDivContainer>
  );
};

export default SortColGuides;

const ColorBarDivContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  margin-bottom: 0px;
  height: 28px;
`;

const ColorBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding-right: 4px;
  padding-left: 4px;
  background-color: ${(props) => props.color};
  width: ${(props) => +props.width}px;
  border-right: 1px solid lightgray;
  border-left: 1px solid lightgray;
  height: 28px;
  border-bottom: 1.5px solid black;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  gap: 10px;
  padding-right: 2px;
  padding-left: 2px;
  /* height: 100%; */
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

  /* svg {
    width: 100%;
    height: 100%;
  } */
`;

const HeaderText = styled.div`
  display: flex;
  padding-top: 2px;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  font-size: 0.75vw;
  text-align: center;
  line-height: 0.8rem;
`;

const TextDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 60%;
`;
