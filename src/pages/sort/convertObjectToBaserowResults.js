const convertObjectToBaserowResults = (columnStatements, resultsPresort) => {
  // columnStatements is an object with a key of vCols = sort results
  // resultsPresort is an object with keys posStateNums, neuStateNums, negStateNums

  if (
    !columnStatements ||
    !columnStatements.vCols ||
    Object.keys(columnStatements.vCols).length === 0
  ) {
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

  for (let i = 0; i < columnSortValues.length; i++) {
    // iterate through each column sort value
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

      let statementNum = parseInt(tempArray1[j].statementNum, 10);
      let statementNum2 = tempArray1[j].statementNum.toString();

      tempObject.statement = statementNum;
      tempObject.sortValue = sortValue;

      let presortVal;

      if (resultsPresort) {
        // prefer explicit presort lookup arrays when resultsPresort was provided
        if (posStateNums.includes(statementNum2)) {
          presortVal = "p";
        } else if (neuStateNums.includes(statementNum2)) {
          presortVal = "u";
        } else if (negStateNums.includes(statementNum2)) {
          presortVal = "n";
        } else {
          presortVal = "error";
        }
      } else {
        // fallback to original psValue-on-vCols-entry behavior
        const psValue = Number(tempArray1[j].psValue);

        if (psValue > 0) {
          presortVal = "p";
        } else if (psValue === 0) {
          presortVal = "u";
        } else if (psValue < 0) {
          presortVal = "n";
        } else {
          presortVal = "error"; // or whatever is appropriate
        }
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

  return {
    r20: `sort: ${resultsText}`,
    r21: `presortTrace: ${presortTraceText}`,
  };
};

export default convertObjectToBaserowResults;
