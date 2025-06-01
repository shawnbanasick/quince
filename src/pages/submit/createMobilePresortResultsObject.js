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
      posNums += item.id + ", ";
    } else if (item.psValue < 0) {
      nneg++;
      negNums += item.id + ", ";
    } else {
      nneu++;
      neuNums += item.id + ", ";
    }
  });

  return {
    npos: npos,
    nneg: nneg,
    nneu: nneu,
    posStateNums: posNums.slice(0, -2), // Remove trailing comma and space
    negStateNums: negNums.slice(0, -2), // Remove trailing comma and space
    neuStateNums: neuNums.slice(0, -2), // Remove trailing comma and space
  };
};

export default createMobilePresortResultsObject;
