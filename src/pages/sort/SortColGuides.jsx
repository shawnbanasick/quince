import styled from "styled-components";
import { v4 as uuid } from "uuid";
import useSettingsStore from "../../globalState/useSettingsStore";
import EmojiN5 from "../../assets/emojiN5.svg?react";

const getMapObj = (state) => state.mapObj;

const SortColGuides = (props) => {
  // STATE
  const mapObj = useSettingsStore(getMapObj);

  const qSortHeaderNumbers = [...mapObj.qSortHeaderNumbers];
  const columnHeadersColorsArray = [...mapObj.columnHeadersColorsArray];
  let columnWidth = +props.columnWidth + 11;

  let shouldDisplayNums;
  let displayNumbers = mapObj?.useColLabelNumsDesktop;
  console.log(displayNumbers[0]);
  if (displayNumbers !== undefined || displayNumbers !== null) {
    if (displayNumbers === false || displayNumbers.toString() === "false") {
      console.log("correct branch");
      shouldDisplayNums = false;
    } else {
      console.log("wrong branch");
      shouldDisplayNums = true;
    }
  }

  console.log(shouldDisplayNums);

  return (
    <ColorBarDivContainer id="colorBarDivContainer">
      {qSortHeaderNumbers.map((value, index) => {
        return (
          <ColorBarDiv key={uuid()} width={columnWidth} color={columnHeadersColorsArray[index]}>
            {shouldDisplayNums ? value : ""}
            <EmojiDiv>
              <EmojiN5 />
            </EmojiDiv>
          </ColorBarDiv>
        );
      })}
    </ColorBarDivContainer>
  );
};

export default SortColGuides;

const ColorBarDiv = styled.div`
  flex-direction: row;
  background-color: ${(props) => props.color};
  width: ${(props) => +props.width}px;
  margin-right: 1px;
  margin-left: 1px;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  height: 28px;
  border-bottom: 2px solid black;
`;

const ColorBarDivContainer = styled.div`
  display: flex;
  padding-left: 2px;
  flex-direction: row;
  background-color: #d8d8d8;
  margin-bottom: 0px;
  height: 30px;
`;

const EmojiDiv = styled.div`
  width: 50px;
  height: 50px;
`;
