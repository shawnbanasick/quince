const setMaxIterations = (qSortPattern) => {
  if (qSortPattern.length === 0) return;
  let returnValue = Math.ceil((qSortPattern.length - 3) / 2);
  return returnValue;
};

export default setMaxIterations;
