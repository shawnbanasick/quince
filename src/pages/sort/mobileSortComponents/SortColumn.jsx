// components/SortColumn.jsx
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import SortItem from "./SortItem";

const SortColumn = ({
  items,
  header,
  color,
  mobileSortFontSize,
  persistedMobileSortFontSize,
  onCardSelected,
  onClickUp,
  onClickDown,
}) => {
  const currentRankings = items.map((item) => (
    <SortItem
      key={uuid()}
      item={item}
      fontSize={
        mobileSortFontSize === +persistedMobileSortFontSize
          ? mobileSortFontSize
          : persistedMobileSortFontSize
      }
      onCardSelected={onCardSelected}
      onClickUp={onClickUp}
      onClickDown={onClickDown}
    />
  ));

  return (
    <Column color={color}>
      <Label margins={{ top: 10, bottom: 0 }}>{header}</Label>
      {currentRankings}
      <Label margins={{ top: 0, bottom: 10 }}>{header}</Label>
    </Column>
  );
};

export default SortColumn;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  align-items: center;
  width: 100%;
  min-height: 80px;
  background-color: ${(props) => props.color};
  border-radius: 3px;
  text-align: center;
  border: 0.5px solid black;
`;

const Label = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  margin-top: ${(props) => `${props.margins.top}px`};
  margin-bottom: ${(props) => `${props.margins.bottom}px`};
  padding: 5px;
  width: 90%;
  min-height: 20px;
  font-size: 20px;
  color: ${(props) => props.theme.mobileText};
  border-radius: 5px;
`;
