const convertObjectToResults = (
  columnStatements,
  resultsPresort,
  traceSorts,
) => {
  if (!columnStatements || Object.keys(columnStatements).length === 0) {
    return;
  }

  let columnSortValues = Object.keys(columnStatements.vCols);

  const sortArray = [];

  let posStateNums = [];
  let neuStateNums = [];
  let negStateNums = [];

  if (resultsPresort) {
    posStateNums = (resultsPresort?.posStateNums ?? "")
      .toString()
      .split(",")
      .filter(Boolean);
    neuStateNums = (resultsPresort?.neuStateNums ?? "")
      .toString()
      .split(",")
      .filter(Boolean);
    negStateNums = (resultsPresort?.negStateNums ?? "")
      .toString()
      .split(",")
      .filter(Boolean);
  }
  // old style loops for speed
  //
  for (let i = 0; i < columnSortValues.length; i++) {
    let tempArray1 = columnStatements?.vCols[columnSortValues[i]];
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
      let statementNum2 = tempArray1[j].statementNum.toString();

      let statementNum = parseInt(tempArray1[j].statementNum, 10);
      tempObject.statement = statementNum;
      tempObject.sortValue = sortValue;

      let presortVal = "error";
      if (posStateNums.includes(statementNum2)) {
        presortVal = "p";
      } else if (neuStateNums.includes(statementNum2)) {
        presortVal = "u";
      } else if (negStateNums.includes(statementNum2)) {
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
    presortTraceText = presortTraceText.substring(
      0,
      presortTraceText.length - 1,
    );
  }

  if (traceSorts === true || traceSorts === "true") {
    return { sort: resultsText, presortTrace: presortTraceText };
  } else {
    return { sort: resultsText };
  }
};

export default convertObjectToResults;
