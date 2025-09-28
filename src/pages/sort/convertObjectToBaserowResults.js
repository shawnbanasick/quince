const convertObjectToBaserowResults = (columnStatements) => {
  // columnStatements is an object with a key of vCols = sort results
  // resultsPresort is an object with keys posStateNums, neuStateNums, negStateNums
  // traceSorts (get all presort column values) is an object with keys of sortResults, sortResultsPresort, sortResultsTrace

  if (columnStatements.length === 0 || columnStatements === undefined) {
    return;
  }

  let columnSortValues = Object.keys(columnStatements.vCols);

  const sortArray = [];

  for (let i = 0; i < columnSortValues.length; i++) {
    // iterate through each column sort value
    let tempArray1 = columnStatements?.vCols[columnSortValues[i]];
    let presortVal;
    // convert column key to column sort value
    let sortValue1 = columnSortValues[i];
    const replaceColumn = /column/gi;
    const replaceN = /N/gi;
    sortValue1 = sortValue1.replace(replaceColumn, "");
    sortValue1 = sortValue1.replace(replaceN, "-");
    const sortValue = parseInt(sortValue1, 10);

    // push statement sort values into array
    for (let j = 0; j < tempArray1.length; j++) {
      let tempObject = {};
      let statementNum = parseInt(tempArray1[j].statementNum, 10);
      tempObject.statement = statementNum;
      tempObject.sortValue = sortValue;
      if (tempArray1[j].psValue > 0) {
        presortVal = "p";
      }
      if (tempArray1[j].psValue === 0) {
        presortVal = "u";
      }
      if (tempArray1[j].psValue < 0) {
        presortVal = "n";
      }
      tempObject.presortVal = presortVal;
      sortArray.push(tempObject);
    }
  }

  // sort array by statement
  sortArray.sort((a, b) => {
    return a.statement - b.statement;
  });

  // accumulate text string
  let resultsText = "";
  let presortTraceText = "";
  for (let k = 0; k < sortArray.length; k++) {
    resultsText += `${sortArray[k].sortValue}|`;
    presortTraceText += `${sortArray[k].statement}*${sortArray[k].presortVal}*${sortArray[k].sortValue}|`;
  }

  // remove trailing bar
  if (resultsText.charAt(resultsText.length - 1) === "|") {
    resultsText = resultsText.substring(0, resultsText.length - 1);
  }
  // remove trailing bar
  if (presortTraceText.charAt(presortTraceText.length - 1) === "|") {
    presortTraceText = presortTraceText.substring(0, presortTraceText.length - 1);
  }

  //   if (traceSorts === true || traceSorts === "true") {
  // return { sort: resultsText, presortTrace: presortTraceText };
  return { r20: `sort: ${resultsText}`, r21: `presortTrace: ${presortTraceText}` };
  //   } else {
  //     return { r18: `sort: ${resultsText}` };
  //   }
};

export default convertObjectToBaserowResults;
// Compare this snippet from src/pages/sort/convertObjectToResults.js:
