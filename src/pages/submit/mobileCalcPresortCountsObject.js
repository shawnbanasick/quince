const mobileCalcPresortCountsObject = (sortResults) => {
  try {
    let npos = 0;
    let nneg = 0;
    let nneu = 0;
    let posStateNums = [];
    let negStateNums = [];
    let neuStateNums = [];
    const presortObject = {};

    sortResults.forEach((item) => {
      if (item.yellowChecked === true) {
        nneu++;
        neuStateNums.push(item.statementNum);
      } else if (item.greenChecked === true) {
        npos++;
        posStateNums.push(item.statementNum);
      } else if (item.pinkChecked === true) {
        nneg++;
        negStateNums.push(item.statementNum);
      }
    });

    presortObject["npos"] = npos;
    presortObject["posStateNums"] = posStateNums.join("|");
    presortObject["nneu"] = nneu;
    presortObject["neuStateNums"] = neuStateNums.join("|");
    presortObject["nneg"] = nneg;
    presortObject["negStateNums"] = negStateNums.join("|");
    return presortObject;
  } catch (error) {
    console.log("Error in calculating createPresortObject", error);
    return;
  }
};

export default mobileCalcPresortCountsObject;
