import shuffle from "lodash/shuffle";
import remove from "lodash/remove";
import displayDebugStateNums from "./displayDebugStateNums";

const finishThinningSorts = (newCols, finalSortColData) => {
  // console.log(JSON.stringify(finalSortColData));
  // iterate through the newCols array and move green sort cards and pink sort cards to the column0 array

  let displayObject = displayDebugStateNums(newCols);
  // console.log("debug newCols", JSON.stringify(displayObject));

  // shuffle the statementList array
  newCols.statementList = shuffle(newCols.statementList);

  let counter = 0;

  while (newCols.statementList.length > 0 || counter < 50) {
    console.log(JSON.stringify(newCols.statementList, null, 2));
    // iterate through the shuffled statementList array and place pink cards
    finalSortColData.forEach((colInfoArray, colIndex) => {
      const colName = colInfoArray[0];
      const colMax = colInfoArray[1];

      console.log("colInfoArray: ", colInfoArray);

      console.log(newCols.vCols[colName].length, colMax);

      if (newCols.vCols[colName].length < colMax) {
        console.log("pink branch");
        newCols.statementList.forEach((item) => {
          // console.log(newCols.vCols[colName].length, colMax);
          if (colMax > newCols.vCols[colName].length) {
            if (item.pinkChecked === true) {
              console.log("green item.id: ", item.id);
              let objId = item.id;
              newCols.vCols[colName].push(item);
              remove(newCols.statementList, (n) => n.id === objId);
            }
          }
        });
      }

      if (newCols.vCols[colName].length < colMax) {
        console.log("yellow branch");
        newCols.statementList.forEach((item) => {
          // console.log(newCols.statementList.length);
          // console.log(item.id);
          // console.log(newCols.vCols[colName].length, colMax);
          if (colMax > newCols.vCols[colName].length) {
            // console.log("passed colMax check");
            if (item.yellowChecked === true) {
              console.log("yellow item.id: ", item.id);
              let objId = item.id;
              newCols.vCols[colName].push(item);
              remove(newCols.statementList, (n) => n.id === objId);
            }
          }
        });
      }

      if (newCols.vCols[colName].length < colMax) {
        console.log("green branch");
        newCols.statementList.forEach((item) => {
          // console.log(newCols.vCols[colName].length, colMax);
          if (colMax > newCols.vCols[colName].length) {
            if (item.greenChecked === true) {
              let objId = item.id;
              console.log("objId: ", objId);
              newCols.vCols[colName].push(item);
              remove(newCols.statementList, (n) => n.id === objId);
            }
          }
        });
      }
    });
    counter = counter + 1;
  }
  let displayObject2 = displayDebugStateNums(newCols);
  console.log("debug newCols", JSON.stringify(displayObject2));

  // console.log(JSON.stringify(newCols.statementList, null, 2));
  return newCols;
};

export default finishThinningSorts;
