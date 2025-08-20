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
  let columnWidth = +props.columnWidth;

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

  // console.log(textHeaders);

  // let textHeaders2 = textHeaders.reverse();
  // console.log(textHeaders2);

  let shouldDisplayEmojis = true;
  shouldDisplayNums = false;
  let shouldDisplayText = true;
  // let widthVal;
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

const ColorBarDivContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  /* background-color: #d8d8d8; */
  margin-bottom: 0px;
  /* border-right: 1px solid whitesmoke;
  border-left: 1px solid whitesmoke; */
  height: 28px;
`;

const ColorBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: ${(props) => props.color};
  width: ${(props) => +props.width}px;
  /* width: calc(99.1vw / ${(props) => props.count}); */
  border-right: 1px solid whitesmoke;
  border-left: 1px solid whitesmoke;
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
  font-size: 0.75vw;
  text-align: center;
  line-height: 0.8rem;

  /* width: ${(shouldDisplayEmojis) => (shouldDisplayEmojis ? "6vw" : "8vw")}; */
`;
