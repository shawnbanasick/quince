import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import useLocalStorage from "../../utilities/useLocalStorage";
import calcThinDisplayControllerArray from "./calcThinDisplayControllerArray";
import EmojiN3 from "../../assets/emojiN3.svg?react";
import Emoji0 from "../../assets/emoji0.svg?react";
import Emoji3 from "../../assets/emoji3.svg?react";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getStatementsObj = (state) => state.statementsObj;
const getColumnStatements = (state) => state.columnStatements;
const getPreSortedStateNumInit = (state) => state.presortSortedStatementsNumInitial;
const getSetPresortFinished = (state) => state.setPresortFinished;
const getSetTrigPresortFinModal = (state) => state.setTriggerPresortFinishedModal;
const getResults = (state) => state.results;
const getSetResults = (state) => state.setResults;
const getSetProgressScoreAdditional = (state) => state.setProgressScoreAdditional;
const getSetPosSorted = (state) => state.setPosSorted;
const getSetNegSorted = (state) => state.setNegSorted;

function PresortDND(props) {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const statementsObj = useSettingsStore(getStatementsObj);
  const columnStatements = useSettingsStore(getColumnStatements);
  const presortSortedStatementsNumInitial = useStore(getPreSortedStateNumInit);
  const setPresortFinished = useStore(getSetPresortFinished);
  const setTriggerPresortFinishedModal = useStore(getSetTrigPresortFinModal);
  const results = useStore(getResults);
  const setResults = useStore(getSetResults);
  const setProgressScoreAdditional = useStore(getSetProgressScoreAdditional);
  const setPosSorted = useStore(getSetPosSorted);
  const setNegSorted = useStore(getSetNegSorted);

  const statementsName = ReactHtmlParser(decodeHTML(langObj.presortStatements)) || "";
  const btnDisagreement = ReactHtmlParser(decodeHTML(langObj.presortDisagreement)) || "";
  const btnAgreement = ReactHtmlParser(decodeHTML(langObj.presortAgreement)) || "";
  const btnNeutral = ReactHtmlParser(decodeHTML(langObj.presortNeutral)) || "";
  const onPageInstructions = ReactHtmlParser(decodeHTML(langObj.presortOnPageInstructions)) || "";

  // initialize local state
  let [presortSortedStatementsNum, setPresortSortedStatementsNum] = useState(
    presortSortedStatementsNumInitial
  );

  const cardFontSize = `${props.cardFontSize}px`;
  let defaultFontColor = configObj.defaultFontColor;
  let statementsLength = columnStatements.statementList.length;

  const cardHeight = 180;
  // const cardHeight = "19.8vh";

  const [columns, setColumns] = useLocalStorage("columns", {
    cards: {
      name: statementsName,
      items: [...props.statements],
      id: "cards",
    },
    neg: {
      name: btnDisagreement,
      items: [],
      id: "neg",
    },
    neutral: {
      name: btnNeutral,
      items: [],
      id: "neutral",
    },
    pos: {
      name: btnAgreement,
      id: "pos",
      items: [],
    },
  });

  // default = positive sort direction
  let pinkArraySortValue = 333,
    greenArraySortValue = 111;
  if (configObj.sortDirection === "negative") {
    pinkArraySortValue = 111;
    greenArraySortValue = 333;
  }

  const onDragEnd = useCallback(
    (result, columns, setColumns) => {
      if (!result.destination || result.destination.droppableId === "cards") {
        return;
      }
      const { source, destination } = result;

      // update statement characteristics
      const statementsArray = [...columnStatements.statementList];
      const destinationId = result.destination.droppableId;
      const draggableId = result.draggableId;

      // set METADATA FOR SORTING
      for (let i = 0; i < statementsArray.length; i++) {
        if (statementsArray[i].id === draggableId) {
          if (destinationId === "neg") {
            statementsArray[i].divColor = "isNegativeStatement";
            statementsArray[i].cardColor = "pinkSortCard";
            statementsArray[i].pinkChecked = true;
            statementsArray[i].yellowChecked = false;
            statementsArray[i].greenChecked = false;
            statementsArray[i].sortValue = pinkArraySortValue;
            statementsArray[i].psValue = -2;
          }
          if (destinationId === "neutral") {
            statementsArray[i].divColor = "isUncertainStatement";
            statementsArray[i].cardColor = "yellowSortCard";
            statementsArray[i].pinkChecked = false;
            statementsArray[i].yellowChecked = true;
            statementsArray[i].greenChecked = false;
            statementsArray[i].psValue = 0;
            statementsArray[i].sortValue = 222;
          }
          if (destinationId === "pos") {
            statementsArray[i].divColor = "isPositiveStatement";
            statementsArray[i].cardColor = "greenSortCard";
            statementsArray[i].pinkChecked = false;
            statementsArray[i].yellowChecked = false;
            statementsArray[i].greenChecked = true;
            statementsArray[i].sortValue = greenArraySortValue;
            statementsArray[i].psValue = 2;
          }
        }
      }

      // set new ordering
      for (let i = 0; i < statementsArray.length; i++) {
        statementsArray[i].listIndex = i + 1;
      }

      // save to memory
      columnStatements.statementList = [...statementsArray];
      localStorage.setItem("columnStatements", JSON.stringify(columnStatements));

      // when dropped on different droppable
      if (source.droppableId !== destination.droppableId) {
        try {
          const sourceColumn = columns[source.droppableId];
          const destColumn = columns[destination.droppableId];
          const sourceItems = [...sourceColumn.items];
          const destItems = [...destColumn.items];
          const [removed] = sourceItems.splice(source.index, 1);

          // change background color
          if (destColumn.id === "pos") {
            removed.backgroundColor = configObj.greenCardColor;
          }
          if (destColumn.id === "neg") {
            removed.backgroundColor = configObj.pinkCardColor;
          }
          if (destColumn.id === "neutral") {
            removed.backgroundColor = configObj.yellowCardColor;
          }

          destItems.splice(destination.index, 0, removed);

          // update columns
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
            },
          });

          // calc remaining statements
          let sortedStatements;
          if (sourceColumn.id === "cards") {
            sortedStatements = statementsObj.totalStatements - sourceColumn.items.length + 1;
            setPresortSortedStatementsNum(sortedStatements);
            const ratio = sortedStatements / statementsObj.totalStatements;
            const completedPercent = (ratio * 30).toFixed();

            // update Progress Bar State
            setProgressScoreAdditional(completedPercent);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          // MOVING BETWEEN COLUMNS
          const sourceCol = columns[source.droppableId];
          const copiedItems = [...sourceCol.items];
          const [removed] = copiedItems.splice(source.index, 1);
          copiedItems.splice(destination.index, 0, removed);
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...sourceCol,
              items: copiedItems,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    [
      configObj,
      columnStatements,
      statementsObj,
      setProgressScoreAdditional,
      greenArraySortValue,
      pinkArraySortValue,
    ]
  );

  useEffect(() => {
    const handleKeyUp = (event) => {
      let target;
      if (event.key === "1" || event.key === 1) {
        target = "neg";
      } else if (event.key === "2" || event.key === 2) {
        target = "neutral";
      } else if (event.key === "3" || event.key === 3) {
        target = "pos";
      } else {
        return;
      }

      if (columns.cards.items.length > 0) {
        let source = columns.cards.items[0].id;
        const results = {
          draggableId: source,
          type: "DEFAULT",
          source: {
            index: 0,
            droppableId: "cards",
          },
          reason: "DROP",
          mode: "FLUID",
          destination: {
            droppableId: target,
            index: 0,
          },
          combine: null,
        };

        onDragEnd(results, columns, setColumns);
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [onDragEnd, setColumns, columns]);

  useEffect(() => {
    let posText = "";
    let neutralText = "";
    let negText = "";

    columns.pos.items.forEach((item) => {
      if (columns.pos.items[0]) {
        posText += item.statementNum + ",";
      }
    });

    if (columns.neutral.items[0]) {
      columns.neutral.items.forEach((item) => {
        neutralText += item.statementNum + ",";
      });
    }

    if (columns.neg.items[0]) {
      columns.neg.items.forEach((item) => {
        negText += item.statementNum + ",";
      });
    }

    let projectResultsObj = results;
    projectResultsObj.npos = columns.pos.items.length;
    projectResultsObj.posStateNums = posText;
    projectResultsObj.nneu = columns.neutral.items.length;
    projectResultsObj.neuStateNums = neutralText;
    projectResultsObj.nneg = columns.neg.items.length;
    projectResultsObj.negStateNums = negText;
    setResults(projectResultsObj);
    localStorage.setItem("resultsPresort", JSON.stringify(projectResultsObj));
  }, [columns, results, setResults]);

  useEffect(() => {
    if (columns.cards.items.length === 0) {
      setPresortFinished(true);
      setTriggerPresortFinishedModal(true);

      console.log("setting posSorted and negSorted triggered by presortNoReturn");

      let presortColumnStatements = JSON.parse(localStorage.getItem("columnStatements"));
      localStorage.setItem("newCols", JSON.stringify(presortColumnStatements));

      let posSorted2 = [];
      let negSorted2 = [];
      let sortingList = [];
      if (presortColumnStatements !== null) {
        console.log("setting posSorted and negSorted");
        sortingList = [...presortColumnStatements.statementList];
        sortingList.forEach((item) => {
          item.selected = false;
          item.selectedPos = false;
          item.selectedNeg = false;
          return item;
        });

        posSorted2 = sortingList.filter((item) => item.sortValue === 111);
        setPosSorted(posSorted2);
        localStorage.setItem("posSorted", JSON.stringify([...posSorted2]));
        negSorted2 = sortingList.filter((item) => item.sortValue === 333);
        setNegSorted(negSorted2);
        localStorage.setItem("negSorted", JSON.stringify([...negSorted2]));

        let sortRightArrays = JSON.parse(localStorage.getItem("sortRightArrays"));
        let sortLeftArrays = JSON.parse(localStorage.getItem("sortLeftArrays"));
        let remainingPosCount = posSorted2.length;
        let remainingNegCount = negSorted2.length;

        let thinDisplayControllerArray = calcThinDisplayControllerArray(
          remainingPosCount,
          remainingNegCount,
          sortRightArrays,
          sortLeftArrays
        );

        localStorage.setItem(
          "thinDisplayControllerArray",
          JSON.stringify(thinDisplayControllerArray)
        );
      }
    }
  }, [
    columns.cards.items.length,
    setPresortFinished,
    setTriggerPresortFinishedModal,
    setPosSorted,
    setNegSorted,
  ]);

  // Helper function to get column background
  const getColumnBackground = (columnId, isDraggingOver) => {
    switch (columnId) {
      case "cards":
        return isDraggingOver ? "#e6f3ff" : "#f8fafc";
      case "neg":
        return isDraggingOver ? "#fef7f7" : "#fee2e2";
      case "neutral":
        return isDraggingOver ? "#fefdf8" : "#fef3c7";
      case "pos":
        return isDraggingOver ? "#f7fef7" : "#dcfce7";
      default:
        return "#ffffff";
    }
  };

  // RENDER COMPONENT
  return (
    <PresortGrid id="statementsGrid">
      <ImageEnlargeInstructionsDiv id="imageEnlargeInstructionsDiv">
        <div>{onPageInstructions}</div>
      </ImageEnlargeInstructionsDiv>
      <CompletionRatioDiv id="completionRatio">
        {presortSortedStatementsNum}/{statementsLength}
      </CompletionRatioDiv>
      <ColumnNamesNeg id="negColumnHeader">
        <div id="negHeader">
          <EmojiDiv>
            <EmojiN3 />
          </EmojiDiv>
          {columns.neg.name}
          <EmojiDiv>
            <EmojiN3 />
          </EmojiDiv>
        </div>
        <ButtonPressDiv>
          <div>{langObj["press1"]}</div>
        </ButtonPressDiv>
      </ColumnNamesNeg>
      <ColumnNamesNeu id="neutralColumnHeader">
        <div id="neuHeader">
          <EmojiDiv>
            <Emoji0 />
          </EmojiDiv>
          {columns.neutral.name}
          <EmojiDiv>
            <Emoji0 />
          </EmojiDiv>
        </div>
        <ButtonPressDiv>
          <div>{langObj["press2"]}</div>
        </ButtonPressDiv>
      </ColumnNamesNeu>
      <ColumnNamesPos id="posColumnHeader">
        <div id="posHeader">
          <EmojiDiv>
            <Emoji3 />
          </EmojiDiv>
          {columns.pos.name}
          <EmojiDiv>
            <Emoji3 />
          </EmojiDiv>
        </div>
        <ButtonPressDiv>
          <div>{langObj["press3"]}</div>
        </ButtonPressDiv>
      </ColumnNamesPos>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <AllColWrapper key={columnId} id={`${columnId}Div`} className={`${columnId}Div`}>
              <ThreeColCardWrapper>
                <Droppable droppableId={columnId} className={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <DroppableZone
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        id={columnId}
                        className={columnId}
                        columnType={columnId}
                        isDraggingOver={snapshot.isDraggingOver}
                        style={{
                          background: getColumnBackground(columnId, snapshot.isDraggingOver),
                        }}
                      >
                        {column.items.map((item, index) => {
                          const statementHtml = ReactHtmlParser(
                            `<div>${decodeHTML(item.statement)}</div>`
                          );
                          return (
                            <Draggable
                              key={item.id}
                              id={item.id}
                              draggableId={item.id}
                              index={index}
                              className="dragObject"
                            >
                              {(provided, snapshot) => {
                                return (
                                  <DroppableContainer
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 6,
                                      margin: "0 0 8px 0",
                                      width: "100%",
                                      height: cardHeight,
                                      overflow: "hidden",
                                      fontSize: cardFontSize,
                                      filter: snapshot.isDragging
                                        ? "brightness(0.85)"
                                        : "brightness(1.00)",
                                      backgroundColor: snapshot.isDragging
                                        ? item.backgroundColor
                                        : item.backgroundColor,
                                      color: defaultFontColor,
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {statementHtml}
                                  </DroppableContainer>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </DroppableZone>
                    );
                  }}
                </Droppable>
              </ThreeColCardWrapper>
            </AllColWrapper>
          );
        })}
      </DragDropContext>
    </PresortGrid>
  );
}

export default PresortDND;

// Styled Components with enhanced backgrounds
const ColumnNamesNeg = styled.div`
  display: flex;
  flex-direction: column;
  grid-column-start: 2;
  grid-row-start: 2;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;

  #negHeader {
    display: flex;
    gap: 10px;
    outline: 1px solid #fca5a5;
    justify-content: center;
    align-items: center;
    /* background: linear-gradient(135deg, #fecaca, #f87171); */
    background: #fee2e2;
    color: #7f1d1d;
    min-width: 60%;
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
  }
`;

const ColumnNamesNeu = styled.div`
  display: flex;
  flex-direction: column;

  align-self: center;
  grid-column-start: 3;
  grid-row-start: 2;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;

  #neuHeader {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    outline: 1px solid #fbbf24;
    /* background: linear-gradient(135deg, #fde68a, #fbbf24); */
    background: #fef3c7;
    color: #78350f;
    min-width: 60%;
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
  }
`;

const ColumnNamesPos = styled.div`
  display: flex;
  flex-direction: column;
  grid-column-start: 4;
  grid-row-start: 2;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;

  #posHeader {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    /* background: linear-gradient(135deg, #bbf7d0, #34d399); */
    background: #dcfce7;
    color: #064e3b;
    min-width: 60%;
    padding: 8px 12px;
    border-radius: 8px;
    outline: 1px solid #34d399;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  }
`;

const PresortGrid = styled.div`
  padding-top: 10px;
  margin-top: 25px;
  margin-bottom: 55px;
  display: grid;
  min-height: calc(100vh-100px);
  grid-template-rows: 30vh 85px 58vh;
  grid-template-columns: 0.25fr 1.5fr 1.5fr 1.5fr 0.25fr;
  row-gap: 3px;
  column-gap: 15px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const DroppableZone = styled.div`
  padding: 12px;
  width: 100%;
  min-height: 400px;
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;

  ${(props) =>
    props.columnType === "cards" &&
    `
    box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.05);
  `}

  ${(props) =>
    props.columnType === "neg" &&
    `
    box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.05);
  `}
  
  ${(props) =>
    props.columnType === "neutral" &&
    `
    box-shadow: inset 0 0 20px rgba(245, 158, 11, 0.05);
  `}
  
  ${(props) =>
    props.columnType === "pos" &&
    `
    box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.05);
  `}
`;

const DroppableContainer = styled.div`
  background-color: "#83cafe";
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 8px;
  width: 27.8vw;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const ThreeColCardWrapper = styled.div`
  margin: 4px;
  img {
    max-width: 98%;
    max-height: 98%;
    padding: 0px;
  }
`;

const CompletionRatioDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  font-size: 60px;
  font-weight: bold;
  padding-left: 3px;
  padding-right: 3px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ImageEnlargeInstructionsDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 70px;
  font-size: 16px;
  padding: 16px 20px;
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-radius: 12px;
  border-left: 4px solid #0ea5e9;
  color: #0c4a6e;
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.1);
`;

const AllColWrapper = styled.div`
  margin: 4px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonPressDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  padding-top: 2px;
  background-color: #f2f2f2;
  border-radius: 5px;
  font-size: 12px;
  border: 1px solid darkgray;
  width: 150px;
  text-align: center;
  height: 20px;
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
