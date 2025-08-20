import useStore from "../../globalState/useStore";

// card and column styling
const getListStyle = (isDraggingOver, props, forcedSorts, columnWidth, columnColor, cardHeight) => {
  // forcedSorts is "warnOverloadedColumn" in configObj
  let isUnderMaxCards;
  if (forcedSorts === true) {
    isUnderMaxCards = props.columnStatementsArray.length <= props.maxCards;
  } else {
    isUnderMaxCards = true;
  }

  // to set highlighting for column headers
  if (isDraggingOver) {
    useStore.setState({ draggingOverColumnId: props.columnId });
  }

  return {
    background: isDraggingOver ? "lightblue" : isUnderMaxCards ? columnColor : "#F4BB44",
    // padding: `3px 0.5px 0px 3.5px`,

    minWidth: columnWidth + 13,
    marginTop: 0,
    marginRight: 0,
    minHeight: props.minHeight - 12,
    borderRadius: `1px`,
    // borderTop: "0px solid #d8d8d8",
    // borderRight: isUnderMaxCards ? "1px solid #d8d8d8" : "3px dashed black",
    // borderLeft: isUnderMaxCards ? "1px solid #d8d8d8" : "3px dashed black",
    // borderBottom: isUnderMaxCards ? "1px solid #d8d8d8" : "3px dashed black",
    borderTop: "0px solid whitesmoke",
    borderRight: isUnderMaxCards ? "1px solid whitesmoke" : "3px dashed black",
    borderLeft: isUnderMaxCards ? "1px solid whitesmoke" : "3px dashed black",
    borderBottom: isUnderMaxCards ? "1px solid whitesmoke" : "3px dashed black",
    // outline: isUnderMaxCards ? "1px solid #d8d8d8" : "3px dashed black",
    // outlineOffset: isUnderMaxCards ? "-1px" : "-3px",
  };
};

export default getListStyle;

// border: 'solid 1px #ededed',
