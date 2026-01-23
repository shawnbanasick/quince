// components/SortStatementsContainer.jsx
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import SortColumn from "./SortColumn";

const SortStatementsContainer = ({
  partitionArray,
  characteristicsArray,
  mobileColHeaders,
  // sortArray1,
  mobileSortFontSize,
  mobileSortViewSize,
  persistedMobileSortFontSize,
  persistedMobileSortViewSize,
  onCardSelected,
  onClickUp,
  onClickDown,
  onScroll,
}) => {
  let sortArray = [];
  let externalIndex = -1;

  (partitionArray || []).map((subArray, index) => {
    const columnItems = (subArray || []).map((item) => {
      externalIndex++;
      return {
        ...item,
        externalIndex,
        characteristics: characteristicsArray[externalIndex],
      };
    });

    sortArray.push(
      <SortColumn
        key={uuid()}
        items={columnItems}
        header={mobileColHeaders[index]}
        color={characteristicsArray[externalIndex]?.color}
        mobileSortFontSize={mobileSortFontSize}
        persistedMobileSortFontSize={persistedMobileSortFontSize}
        onCardSelected={onCardSelected}
        onClickUp={onClickUp}
        onClickDown={onClickDown}
      />,
    );
  });

  return (
    <Container
      onScroll={onScroll}
      viewSize={
        mobileSortViewSize === +persistedMobileSortViewSize
          ? mobileSortViewSize
          : persistedMobileSortViewSize
      }
    >
      {sortArray}
    </Container>
  );
};

export default SortStatementsContainer;

const Container = styled.div`
  display: flex;
  align-self: top;
  justify-self: center;
  margin-top: 10px;
  margin-bottom: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  width: 96vw;
  height: ${(props) => `${props.viewSize}vh`};
  align-items: center;
  gap: 15px;
  justify-content: space-between;
  border-radius: 3px;
  text-align: center;
  overflow-x: none;
  overflow-y: auto;
`;
