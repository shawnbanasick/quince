const createBaserowObject = () => {
  try {
    const resultsPresort = JSON.parse(localStorage.getItem("resultsPresort"));

    const baserowObject = {};

    let numPos = resultsPresort?.npos;
    if (isNaN(numPos)) {
      numPos = 0;
    }
    let numNeu = resultsPresort?.nneu;
    if (isNaN(numNeu)) {
      numNeu = 0;
    }
    let numNeg = resultsPresort?.nneg;
    if (isNaN(numNeg)) {
      numNeg = 0;
    }

    baserowObject["r14"] = `(numPos): ${numPos}`;
    baserowObject["r15"] = `(numNeu): ${numNeu}`;
    baserowObject["r16"] = `(numNeg): ${numNeg}`;

    baserowObject["r17"] = `(pos): ${resultsPresort?.posStateNums || []}`;
    baserowObject["r18"] = `(neu): ${resultsPresort?.neuStateNums || []}`;
    baserowObject["r19"] = `(neg): ${resultsPresort?.negStateNums || []}`;

    // presortObject["npos"] = numPos;
    // presortObject["posStateNums"] = resultsPresort?.posStateNums || [];
    // presortObject["nneu"] = numNeu;
    // presortObject["neuStateNums"] = resultsPresort?.neuStateNums || [];
    // presortObject["nneg"] = numNeg;
    // presortObject["negStateNums"] = resultsPresort?.negStateNums || [];

    return baserowObject;
  } catch (error) {
    console.log(error);
    return;
  }
};

export default createBaserowObject;
