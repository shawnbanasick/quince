const calcPresortTranceAndSortResults = (
  sortResults,
  sortCharacteristicsArray
) => {
  try {
    let formattedSortResults = "";
    let presortTraceText = "";
    let objectArray = [];

    console.log("sortResults", sortResults);

    sortResults.forEach((item, index) => {
      let tempObject = {};
      tempObject.statementNum = item?.statementNum;
      tempObject.sortValue = sortCharacteristicsArray?.[index]?.value;
      if (item.yellowChecked === true) {
        tempObject.presortVal = "u";
      }
      if (item.greenChecked === true) {
        tempObject.presortVal = "p";
      }
      if (item.pinkChecked === true) {
        tempObject.presortVal = "n";
      }
      objectArray.push(tempObject);
    });

    objectArray.sort((a, b) => {
      return a.statementNum - b.statementNum;
    });

    console.log("objectArray", JSON.stringify(objectArray));

    objectArray.forEach((item) => {
      formattedSortResults += `${item.sortValue}|`;
      presortTraceText += `${item.statementNum}*${item.presortVal}*${item.sortValue}|`;
    });

    if (formattedSortResults.charAt(formattedSortResults.length - 1) === "|") {
      formattedSortResults = formattedSortResults.substring(
        0,
        formattedSortResults.length - 1
      );
    }
    if (presortTraceText.charAt(presortTraceText.length - 1) === "|") {
      presortTraceText = presortTraceText.substring(
        0,
        presortTraceText.length - 1
      );
    }
    return { sort: formattedSortResults, presortTrace: presortTraceText };
    // formattedSortResults += `${tempObject.sortValue}|`;
  } catch (error) {
    console.log("Error in calculating createPresortTraceAndSortResults", error);
  }
};

export default calcPresortTranceAndSortResults;
