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

    baserowObject["r13"] = `(numPos): ${numPos}`;
    baserowObject["r14"] = `(numNeu): ${numNeu}`;
    baserowObject["r15"] = `(numNeg): ${numNeg}`;

    baserowObject["r16"] = `(pos): ${resultsPresort?.posStateNums || []}`;
    baserowObject["r17"] = `(neu): ${resultsPresort?.neuStateNums || []}`;
    baserowObject["r18"] = `(neg): ${resultsPresort?.negStateNums || []}`;

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
