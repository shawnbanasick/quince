const mobileConvertObjectToBaserowResults = (sortResults, sortCharacteristicsArray) => {
  let resultsText = "";
  let presortTraceText = "";

  sortResults.forEach((item, index) => {
    let value2 = sortCharacteristicsArray[index].value;
    let value = value2.replace("+", "");
    item.sortValue = value;
    item.number = +item.statementNum;
  });

  sortResults.sort((a, b) => {
    return a.number - b.number;
  });

  sortResults.forEach((item) => {
    if (item.psValue > 0) {
      item.presortVal = "p";
    }
    if (item.psValue === 0) {
      item.presortVal = "u";
    }
    if (item.psValue < 0) {
      item.presortVal = "n";
    }

    resultsText += `${item.sortValue}|`;
    presortTraceText += `${item.statementNum}*${item.presortVal}*${item.sortValue}|`;
  });

  // remove trailing bar
  if (resultsText.charAt(resultsText.length - 1) === "|") {
    resultsText = resultsText.substring(0, resultsText.length - 1);
  }
  // remove trailing bar
  if (presortTraceText.charAt(presortTraceText.length - 1) === "|") {
    presortTraceText = presortTraceText.substring(0, presortTraceText.length - 1);
  }

  return { r20: `sort: ${resultsText}`, r21: `presortTrace: ${presortTraceText}` };
};

export default mobileConvertObjectToBaserowResults;
