const createColumnData = (headers, qSortPattern) => {
  let columnData = [];
  headers.forEach((item, index) => {
    let tempArray = [];
    tempArray.push(`column${item}`);
    tempArray.push(qSortPattern[index]);
    columnData.push(tempArray);
  });
  return columnData;
};

export default createColumnData;
