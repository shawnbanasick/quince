import remove from "lodash/remove";
import displayDebugStateNums from "./displayDebugStateNums";

const moveSelectedNegCards = (selectedNegItems) => {
  console.log("called");
  let newCols2 = JSON.parse(localStorage.getItem("newCols"));
  selectedNegItems.forEach((obj) => {
    let objId = obj.id;
    let targetcol = obj.targetcol;
    newCols2.statementList.forEach((item) => {
      if (item.id === objId) {
        newCols2.vCols[targetcol].push(item);
        remove(newCols2.statementList, (n) => n.id === objId);
      }
    });
  });
  let displayObject2 = displayDebugStateNums(newCols2);
  console.log(JSON.stringify(displayObject2));
  localStorage.setItem("newCols", JSON.stringify(newCols2));
  return;
};

export default moveSelectedNegCards;
