// components/SortItem.jsx
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import DownArrows from "../../../assets/downArrows.svg?react";
import UpArrows from "../../../assets/upArrows.svg?react";

const SortItem = ({ item, fontSize, onCardSelected, onClickUp, onClickDown }) => {
  return (
    <ItemContainer key={uuid()}>
      <DownArrowContainer id={item.id} onClick={onClickDown} color={item.characteristics.color}>
        <DownArrows style={{ pointerEvents: "none", opacity: "0.95" }} />
      </DownArrowContainer>

      <InternalDiv
        onClick={onCardSelected}
        id={item.id}
        key={uuid()}
        fontSize={fontSize}
        color={item.selected ? "lightyellow" : item.characteristics.color}
      >
        <div
          data-index={item.externalIndex}
          data-id={item.id}
          data-color={item.characteristics.color}
          data-group_num={item.characteristics.value}
          data-statement_text={item.statement}
          data-font_size={fontSize}
          data-header={item.characteristics.header}
        >
          {item.statement}
        </div>
      </InternalDiv>

      <UpArrowContainer id={item.id} onClick={onClickUp} color={item.characteristics.color}>
        <UpArrows style={{ pointerEvents: "none", opacity: "0.95" }} />
      </UpArrowContainer>
    </ItemContainer>
  );
};

export default SortItem;

const ItemContainer = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 10vh;
  flex-direction: row;
  user-select: none;
  width: 96%;
`;

const InternalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  position: relative;
  width: 80%;
  min-height: 10vh;
  font-size: ${(props) => `${props.fontSize}vh`};
  text-align: center;
  color: ${(props) => props.theme.mobileText};
  border: 1px solid #36454f;
  border-radius: 8px;
  padding: 5px;
  -webkit-transition: background-color 300ms linear;
  -moz-transition: background-color 300ms linear;
  -o-transition: background-color 300ms linear;
  -ms-transition: background-color 300ms linear;
  transition: all 300ms linear;
  user-select: none;
`;

const UpArrowContainer = styled.button`
  display: flex;
  width: 10vw;
  background-color: ${(props) => props.color};
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vh;
  border: 0px;
  cursor: pointer;
`;

const DownArrowContainer = styled.button`
  width: 10vw;
  background-color: ${(props) => props.color};
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vh;
  border: 0px;
  cursor: pointer;
`;
