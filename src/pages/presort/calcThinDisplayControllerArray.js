const calcThinDisplayControllerArray = (
  remainingPosCount,
  remainingNegCount,
  sortRightArrays,
  sortLeftArrays
) => {
  try {
    let totalNumPosItems = sortRightArrays.length;
    let totalNumNegItems = sortLeftArrays.length;
    let totalArraysNum = Math.max(totalNumPosItems, totalNumNegItems);

    let thinDisplayControllerArray = [];

    for (let i = 0; i < totalArraysNum; i++) {
      let tempObject = {};
      let tempObject2 = {};

      if (+sortRightArrays?.[i]?.[1] < remainingPosCount) {
        tempObject = {
          targetCol: sortRightArrays?.[i]?.[0],
          maxNum: sortRightArrays?.[i]?.[1],
          side: "right",
          iteration: i + 1,
        };
        thinDisplayControllerArray.push(tempObject);
        remainingPosCount = remainingPosCount - sortRightArrays?.[i]?.[1];
      }

      if (+sortLeftArrays?.[i]?.[1] < remainingNegCount) {
        tempObject2 = {
          targetCol: sortLeftArrays?.[i]?.[0],
          maxNum: sortLeftArrays?.[i]?.[1],
          side: "left",
          iteration: i + 1,
        };
        thinDisplayControllerArray.push(tempObject2);
        remainingNegCount = remainingNegCount - sortLeftArrays?.[i]?.[1];
      }
    }

    return thinDisplayControllerArray;
  } catch (e) {
    console.error(e);
    alert(
      "There was an error calculating the thin display controller array. Please contact the developer"
    );
  }
};

export default calcThinDisplayControllerArray;
