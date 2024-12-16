import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";

const VerticalList = (props) => {
  console.log(JSON.stringify(props.items[0], null, 2));
  const [list, setList] = useState(props.items);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.index !== destination.index) {
      const updatedList = Array.from(list);
      const [movedItem] = updatedList.splice(source.index, 1);
      updatedList.splice(destination.index, 0, movedItem);
      setList(updatedList);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="vertical-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            {list.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <InternalDiv
                    color={item.color}
                    onClick={props.onClick}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      padding: "16px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      //   backgroundColor: "#f9f9f9",
                      textAlign: "center",
                      ...provided.draggableProps.style,
                    }}
                  >
                    {item.statement}
                  </InternalDiv>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default VerticalList;

// Usage example:
// const items = [
//   { id: "1", name: "Item 1" },
//   { id: "2", name: "Item 2" },
//   { id: "3", name: "Item 3" },
// ];
// <VerticalList items={items} />

const InternalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  width: 80vw;
  height: 12vh;
  font-size: 2vh;
  border-radius: 3px;
  text-align: center;
  outline: 1px solid black;
  padding: 5px;
`;
