import remove from "lodash/remove";

const moveSelectedPosCards = (selectedPosItems) => {
  console.log("move", selectedPosItems);

  let newCols2 = JSON.parse(localStorage.getItem("newCols"));
  selectedPosItems.forEach((obj) => {
    let objId = obj.id;
    let targetcol = obj.targetcol;
    newCols2.statementList.forEach((item) => {
      // console.log("targetcol: ", targetcol);
      if (item.id === objId) {
        newCols2.vCols[targetcol].push(item);
        remove(newCols2.statementList, (n) => n.id === objId);
      }
    });
  });
  localStorage.setItem("newCols", JSON.stringify(newCols2));
  return;
};

export default moveSelectedPosCards;
