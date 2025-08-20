import useStore from "../../globalState/useStore";

// card and column styling
const getListStyle = (isDraggingOver, props, forcedSorts, columnWidth, columnColor) => {
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
    maxWidth: columnWidth,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    paddingBottom: 0,
    minHeight: props.minHeight - 12,
    borderRadius: `2px`,
    borderTop: "0px solid lightgray",
    borderRight: isUnderMaxCards ? "1px solid lightgray" : "3px dashed black",
    borderLeft: isUnderMaxCards ? "1px solid lightgray" : "3px dashed black",
    borderBottom: isUnderMaxCards ? "1px solid whitesmoke" : "3px dashed black",
  };
};

export default getListStyle;

// border: 'solid 1px #ededed',
