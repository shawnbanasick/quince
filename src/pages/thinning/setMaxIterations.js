const setMaxIterations = (qSortPattern) => {
  if (qSortPattern.length === 0) return;
  if (qSortPattern.length < 6) return 1;
  if (qSortPattern.length < 8) return 2;
  if (qSortPattern.length < 10) return 3;
  return 4;
};

export default setMaxIterations;
