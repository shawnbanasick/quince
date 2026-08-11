// to reorder within the same column
const reorder = (
  columnToBeReordered,
  startIndex,
  endIndex,
  columnStatements,
) => {
  try {
    // no re-ordering of statements list / it's arranged by flexbox "order" css property
    if (columnToBeReordered === "statements") {
      return columnStatements;
    }
    const list = columnStatements.vCols[columnToBeReordered];
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    columnStatements.vCols[columnToBeReordered] = [...result];

    return { ...columnStatements };
  } catch (error) {
    console.error(error);
    // fail safe: return the state unchanged rather than undefined,
    // so callers don't accidentally wipe columnStatements on error
    return columnStatements;
  }
};

export default reorder;
