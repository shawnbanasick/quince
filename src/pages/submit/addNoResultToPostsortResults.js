const addNoResultToPostsortResults = (resultsPostsort, mapObj, configObj) => {
  const newObject = {};

  // check for missing responses
  const qSortPattern = mapObj.qSortPattern;
  const qSortHeaderNumbers = mapObj.qSortHeaders;
  const highCardNum = +qSortPattern[qSortPattern.length - 1];
  const highCardVal = +qSortHeaderNumbers[qSortHeaderNumbers.length - 1];
  const highCard2Num = +qSortPattern[qSortPattern.length - 2];
  const highCard2Val = +qSortHeaderNumbers[qSortHeaderNumbers.length - 2];
  const lowCardNum = +qSortPattern[0];
  const lowCardVal = qSortHeaderNumbers[0];
  const lowCard2Num = +qSortPattern[1];
  const lowCard2Val = qSortHeaderNumbers[1];
  // const maxValue = Math.max(...qSortPattern);
  // const neuCardNum = maxValue;
  // const neuCardVal = 0;

  console.log(JSON.stringify(resultsPostsort, null, 2));
  let noResponseCheckArrayHC1 = JSON.parse(localStorage.getItem("noResponseCheckArrayHC1")) || [];
  let noResponseCheckArrayHC2 = JSON.parse(localStorage.getItem("noResponseCheckArrayHC2")) || [];
  let noResponseCheckArrayLC1 = JSON.parse(localStorage.getItem("noResponseCheckArrayLC1")) || [];
  let noResponseCheckArrayLC2 = JSON.parse(localStorage.getItem("noResponseCheckArrayLC2")) || [];

  let combinedArray2 = [
    ...noResponseCheckArrayLC2,
    ...noResponseCheckArrayLC1,
    ...noResponseCheckArrayHC2,
    ...noResponseCheckArrayHC1,
  ];

  console.log("zzz", combinedArray2);

  let combinedObject = {};
  combinedArray2.forEach((item) => {
    let item2 = item.split(":");
    let id2 = item2[0].trim();
    let stateNum = item2[1].trim();
    combinedObject[id2] = stateNum;
  });

  console.log("zzz", JSON.stringify(combinedObject));

  // check for high card answers
  const length = highCardNum;
  for (let i = 0; i < length; i++) {
    let identifier = `column${highCardVal}_${i}`;
    if (!Object.prototype.hasOwnProperty.call(resultsPostsort, identifier))
      resultsPostsort[identifier] = `(${combinedObject[identifier]}): no response`;
  }

  // check for high card 2 answers
  if (configObj.showSecondPosColumn === true) {
    const length2 = highCard2Num;
    for (let ii = 0; ii < length2; ii++) {
      let identifier2 = `column${highCard2Val}_${ii}`;
      if (!Object.prototype.hasOwnProperty.call(resultsPostsort, identifier2))
        resultsPostsort[identifier2] = `(${combinedObject[identifier2]}): no response`;
    }
  }

  // check for low card 2 answers
  if (configObj.showSecondNegColumn === true) {
    const length4 = lowCard2Num;
    for (let jj = 0; jj < length4; jj++) {
      let identifier3 = `column${lowCard2Val}_${jj}`;
      if (!Object.prototype.hasOwnProperty.call(resultsPostsort, identifier3))
        resultsPostsort[identifier3] = `(${combinedObject[identifier3]}): no response`;
    }
  }

  // check for low card answers
  const length3 = lowCardNum;
  for (let j = 0; j < length3; j++) {
    let identifier4 = `column${lowCardVal}_${j}`;
    if (!Object.prototype.hasOwnProperty.call(resultsPostsort, identifier4))
      resultsPostsort[identifier4] = `(${combinedObject[identifier4]}): no response`;
  }

  // re-arrange object properties
  let keys = Object.keys(resultsPostsort);

  keys.sort();

  for (let i = 0; i < keys.length; i++) {
    newObject[keys[i]] = resultsPostsort[keys[i]];
  }
  return newObject;
};

export default addNoResultToPostsortResults;
