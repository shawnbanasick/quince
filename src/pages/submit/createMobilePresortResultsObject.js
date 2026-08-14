const createMobilePresortResultsObject = (presortResults) => {
  let npos = 0;
  let nneg = 0;
  let nneu = 0;
  let posNums = "";
  let negNums = "";
  let neuNums = "";

  presortResults.forEach((item) => {
    if (item.psValue > 0) {
      npos++;
      posNums += item.statementNum + ",";
    } else if (item.psValue < 0) {
      nneg++;
      negNums += item.statementNum + ",";
    } else {
      nneu++;
      neuNums += item.statementNum + ",";
    }
  });

  return {
    npos: npos,
    nneg: nneg,
    nneu: nneu,
    posStateNums: posNums.slice(0, -1), // Remove trailing comma
    negStateNums: negNums.slice(0, -1), // Remove trailing comma
    neuStateNums: neuNums.slice(0, -1), // Remove trailing comma
  };
};

export default createMobilePresortResultsObject;
