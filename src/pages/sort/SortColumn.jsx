import React, { useEffect } from "react";
import {
  Droppable,
  Draggable,
} from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import styled from "styled-components";
import getItemStyle from "./getItemStyle";
import getListStyle from "./getListStyle";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useStore from "../../globalState/useStore";

/* eslint react/prop-types: 0 */

// Syncs "which column is being dragged over" into global state.
// Isolated in its own component so the setState calls happen in an
// effect (after commit) instead of during SortColumn's render.
const DragOverSync = ({ isDraggingOver, columnId, sortValue }) => {
  useEffect(() => {
    if (isDraggingOver) {
      useStore.setState({
        draggingOverColumnId: columnId,
        currentSortValue: sortValue,
      });
    }
  }, [isDraggingOver, columnId, sortValue]);

  return null;
};

const SortColumn = (props) => {
  const {
    forcedSorts,
    columnWidth,
    cardHeight,
    columnId,
    sortValue,
    columnStatementsArray,
    columnColor,
    cardFontSize,
    greenCardColor,
    yellowCardColor,
    pinkCardColor,
    fontColor,
  } = props;

  return (
    <SortColumnsDiv id="sortColumnsDiv">
      <Droppable id="ColDroppable" droppableId={columnId} direction="vertical">
        {(provided, snapshot) => (
          <DroppableColDiv
            id="DroppableColDiv"
            ref={provided.innerRef}
            style={getListStyle(
              snapshot.isDraggingOver,
              props,
              forcedSorts,
              columnWidth,
              columnColor,
              cardHeight,
            )}
          >
            <DragOverSync
              isDraggingOver={snapshot.isDraggingOver}
              columnId={columnId}
              sortValue={sortValue}
            />
            {columnStatementsArray.map((item, index) => {
              const statementHtml = ReactHtmlParser(
                `<div>${decodeHTML(item.statement)}</div>`,
              );
              return (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  cardColor={item.cardColor}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <StatementDiv
                      id="StatementDiv"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      cardHeight={cardHeight}
                      fontSize={cardFontSize}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        columnWidth,
                        cardHeight,
                        cardFontSize,
                        `${item.cardColor}`,
                        greenCardColor,
                        yellowCardColor,
                        pinkCardColor,
                        fontColor,
                      )}
                    >
                      {statementHtml}
                    </StatementDiv>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </DroppableColDiv>
        )}
      </Droppable>
    </SortColumnsDiv>
  );
};

export default React.memo(SortColumn);

const SortColumnsDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const DroppableColDiv = styled.div`
  justify-items: center;
`;

const StatementDiv = styled.div`
  display: flex;
  width: 96%;
  margin-left: 2%;
  margin-bottom: 5px !important;
  height: ${(props) => `${props.cardHeight}px`};
  font-size: calc(${(props) => props.fontSize}px + 1.3vw);
  justify-content: center;
`;
