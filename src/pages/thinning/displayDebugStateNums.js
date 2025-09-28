const displayDebugStateNums = (newCols) => {
  let newColsCopy = JSON.parse(JSON.stringify(newCols)); // deep copy of newCols object
  let displayObject = {};
  let vColsObject = {};

  // iterate through newColsCopy object
  let objectKeysVcols = Object.keys(newColsCopy.vCols);
  objectKeysVcols.forEach((key) => {
    let tempIdArray = [];
    let tempArray = newColsCopy.vCols[key];
    if (tempArray.length > 0) {
      tempArray.forEach((item) => {
        tempIdArray.push(item.id);
      });
    }
    vColsObject[key] = [...tempIdArray];
  });

  displayObject.vCols = vColsObject;

  let statementListIds = [];
  newColsCopy.statementList.forEach((item) => {
    statementListIds.push(item.id);
  });
  displayObject.statementList = statementListIds;

  return displayObject;
};

export default displayDebugStateNums;
