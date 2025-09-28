import remove from "lodash/remove";

const mobileMoveSelectedNegCards = (selectedNegItems, newCols2) => {
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

  return newCols2;
};

export default mobileMoveSelectedNegCards;
