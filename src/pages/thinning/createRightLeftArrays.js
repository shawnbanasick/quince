import takeRight from "lodash/takeRight";
import take from "lodash/take";

const createRightLeftArrays = (finalSortColData, maxIterations) => {
  let rightArray = takeRight(finalSortColData, maxIterations);
  let leftArray = take(finalSortColData, maxIterations);
  rightArray.reverse();
  return [leftArray, rightArray];
};

export default createRightLeftArrays;
