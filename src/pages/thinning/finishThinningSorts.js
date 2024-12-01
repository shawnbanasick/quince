import shuffle from "lodash/shuffle";
import remove from "lodash/remove";
import displayDebugStateNums from "./displayDebugStateNums";

const finishThinningSorts = (newCols, finalSortColData) => {
  let displayObject = displayDebugStateNums(newCols);
  console.log("debug newCols", JSON.stringify(displayObject));

  // shuffle the statementList array so the randoms don't always end up in the same place across parts.
  newCols.statementList = shuffle(newCols.statementList);

  let remainingPink = newCols.statementList.filter(
    (item) => item.pinkChecked === true
  );
  let remainingYellow = newCols.statementList.filter(
    (item) => item.yellowChecked === true
  );
  let remainingGreen = newCols.statementList.filter(
    (item) => item.greenChecked === true
  );

  console.log("remainingPink", remainingPink.length);
  console.log("remainingYellow", remainingYellow.length);
  console.log("remainingGreen", remainingGreen.length);
  console.log("statementList", newCols.statementList.length);

  let counter1 = 0;
  let counter1b = 0;
  let counter2 = 0;
  let counter2b = 0;
  let counter3 = 0;
  let counter3b = 0;

  // console.log("debug", JSON.stringify(finalSortColData));

  while (remainingPink.length > 0 && counter1 < 50) {
    // iterate through each column
    finalSortColData.forEach((colInfoArray) => {
      const colName = colInfoArray[0];
      const colMax = colInfoArray[1];
      // console.log("colName", colName);

      // if there is room in the column, place a pink card
      if (newCols.vCols[colName].length < colMax) {
        do {
          // pop off the last item in the remainingPink array and push it to the column
          if (remainingPink.length > 0) {
            let poppedItem = remainingPink.pop();
            if (poppedItem) {
              let objId = poppedItem.id;
              newCols.vCols[colName].unshift(poppedItem);
              remove(newCols.statementList, (n) => n.id === objId);
            }
          }
          counter1b = counter1b + 1;
        } while (
          remainingPink.length > 0 &&
          newCols.vCols[colName].length < colMax &&
          counter1b < 50
        );
      }
      counter1 = counter1 + 1;
    });
  }

  // let displayObject2 = displayDebugStateNums(newCols);
  // console.log("debug newCols2", JSON.stringify(displayObject2));

  while (remainingYellow.length > 0 && counter2 < 50) {
    // iterate through each column
    finalSortColData.forEach((colInfoArray) => {
      const colName = colInfoArray[0];
      const colMax = colInfoArray[1];
      // console.log("colName", colName);

      // if there is room in the column, place a yellow card
      if (newCols.vCols[colName].length < colMax) {
        do {
          // pop off the last item in the remainingYellow array and push it to the column
          if (remainingYellow.length > 0) {
            let poppedItem = remainingYellow.pop();
            if (poppedItem) {
              let objId = poppedItem.id;
              newCols.vCols[colName].push(poppedItem);
              remove(newCols.statementList, (n) => n.id === objId);
            }
          }
          counter2b = counter2b + 1;
        } while (
          remainingYellow.length > 0 &&
          newCols.vCols[colName].length < colMax &&
          counter2b < 50
        );
      }
      counter2 = counter2 + 1;
    });
  }

  // let displayObject3 = displayDebugStateNums(newCols);
  // console.log("debug newCols3", JSON.stringify(displayObject3));

  while (remainingGreen.length > 0 && counter3 < 50) {
    // console.log("running green");
    // iterate through each column
    finalSortColData.forEach((colInfoArray) => {
      const colName = colInfoArray[0];
      const colMax = colInfoArray[1];
      // console.log("colName", colName, colMax);

      // if there is room in the column, place a green card
      if (newCols.vCols[colName].length < colMax) {
        do {
          // pop off the last item in the remainingGreen array and push it to the column
          if (remainingGreen.length > 0) {
            let poppedItem = remainingGreen.pop();
            if (poppedItem) {
              let objId = poppedItem.id;
              newCols.vCols[colName].unshift(poppedItem);
              remove(newCols.statementList, (n) => n.id === objId);
            }
          }
          counter3b = counter3b + 1;
        } while (
          remainingGreen.length > 0 &&
          newCols.vCols[colName].length < colMax &&
          counter3b < 50
        );
      }
      counter3 = counter3 + 1;
    });
  }
  // let displayObject4 = displayDebugStateNums(newCols);
  // console.log("debug newCols4", JSON.stringify(displayObject4));

  // console.log(JSON.stringify(newCols.statementList, null, 2));
  return newCols;
};

export default finishThinningSorts;
