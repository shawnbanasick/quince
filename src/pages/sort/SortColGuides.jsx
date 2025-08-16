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

  const qSortHeaderNumbers = [...mapObj.qSortHeaderNumbers];
  const columnHeadersColorsArray = [...mapObj.columnHeadersColorsArray];
  let columnWidth = +props.columnWidth + 11;

  const textHeaders = [...mapObj.mobileHeadersText];

  let shouldDisplayNums;
  let displayNumbers = mapObj?.useColLabelNumsDesktop;
  if (displayNumbers !== undefined || displayNumbers !== null) {
    if (displayNumbers === false || displayNumbers.toString() === "false") {
      shouldDisplayNums = false;
    } else {
      shouldDisplayNums = true;
    }
  }

  console.log(textHeaders);

  // let textHeaders2 = textHeaders.reverse();
  // console.log(textHeaders2);

  let shouldDisplayEmojis = true;
  shouldDisplayNums = false;
  let shouldDisplayText = true;

  return (
    <ColorBarDivContainer id="colorBarDivContainer">
      {qSortHeaderNumbers.map((value, index) => {
        return (
          <ColorBarDiv key={uuid()} width={columnWidth} color={columnHeadersColorsArray[index]}>
            <ContentWrapper>
              {shouldDisplayNums && <HeaderNumber>{value}</HeaderNumber>}
              {shouldDisplayEmojis && <EmojiDiv>{emoji4Array[index]}</EmojiDiv>}

              {/* {shouldDisplayEmojis && <EmojiDiv>{emoji4Array[index]}</EmojiDiv>} */}
              {/* {shouldDisplayEmojis && <EmojiDiv>{emoji4Array[index]}</EmojiDiv>} */}
              {shouldDisplayText && <HeaderText>{textHeaders[index]}</HeaderText>}
              {shouldDisplayEmojis && <EmojiDiv>{emoji4Array[index]}</EmojiDiv>}
            </ContentWrapper>
          </ColorBarDiv>
        );
      })}
    </ColorBarDivContainer>
  );
};

export default SortColGuides;

const ColorBarDiv = styled.div`
  background-color: ${(props) => props.color};
  width: ${(props) => +props.width}px;
  margin-right: 1px;
  margin-left: 1px;
  height: 28px;
  border-bottom: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ColorBarDivContainer = styled.div`
  display: flex;
  padding-left: 2px;
  flex-direction: row;
  background-color: #d8d8d8;
  margin-bottom: 0px;
  height: 30px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 100%;
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

  svg {
    width: 100%;
    height: 100%;
  }
`;

const HeaderText = styled.div`
  display: flex;
  padding-top: 2px;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  font-size: 0.8vw;
  text-align: center;
  line-height: 0.8rem;
  width: 6vw;
`;
