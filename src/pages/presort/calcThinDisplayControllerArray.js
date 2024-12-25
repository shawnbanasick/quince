const calcThinDisplayControllerArray = (
  remainingPosCount,
  remainingNegCount,
  sortRightArrays,
  sortLeftArrays
) => {
  let totalNumPosItems = sortRightArrays.length;
  let totalNumNegItems = sortLeftArrays.length;
  let totalArraysNum = Math.max(totalNumPosItems, totalNumNegItems);

  let thinDisplayControllerArray = [];

  for (let i = 0; i < totalArraysNum; i++) {
    let tempObject = {};
    let tempObject2 = {};
    let message = "";

    if (i === 0) {
      message = "initial";
    } else {
      message = "follow-up";
    }

    if (+sortRightArrays?.[i]?.[1] < remainingPosCount) {
      tempObject = {
        targetCol: sortRightArrays?.[i]?.[0],
        maxNum: sortRightArrays?.[i]?.[1],
        side: "right",
        message: message,
      };
      thinDisplayControllerArray.push(tempObject);
      remainingPosCount = remainingPosCount - sortRightArrays[i][1];
    }
    if (+sortLeftArrays?.[i]?.[1] < remainingNegCount) {
      tempObject2 = {
        targetCol: sortLeftArrays?.[i]?.[0],
        maxNum: sortLeftArrays?.[i]?.[1],
        side: "left",
        message: message,
      };
      thinDisplayControllerArray.push(tempObject2);
      remainingNegCount = remainingNegCount - sortLeftArrays[i][1];
    }
  }

  return thinDisplayControllerArray;
  //   localStorage.setItem(
  //     "thinDisplayControllerArray",
  //     JSON.stringify(thinDisplayControllerArray)
  //   );
};

export default calcThinDisplayControllerArray;
