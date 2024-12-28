import remove from "lodash/remove";
import displayDebugStateNums from "./displayDebugStateNums";

const mobileMoveSelectedPosCards = (selectedPosItems, newCols2) => {
  //   console.log("move", selectedPosItems);
  //   let newCols2 = JSON.parse(localStorage.getItem("newCols"));
  selectedPosItems.forEach((obj) => {
    let objId = obj.id;
    let targetcol = obj.targetcol;
    newCols2.statementList.forEach((item) => {
      if (item.id === objId) {
        newCols2.vCols[targetcol].push(item);
        remove(newCols2.statementList, (n) => n.id === objId);
      }
    });
  });
  //   localStorage.setItem("newCols", JSON.stringify(newCols2));

  let displayObject2 = displayDebugStateNums(newCols2);
  console.log("debug newCols", JSON.stringify(displayObject2));

  return newCols2;
};

export default mobileMoveSelectedPosCards;
