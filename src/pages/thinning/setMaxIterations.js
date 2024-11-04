const setMaxIterations = (qSortPattern) => {
  if (qSortPattern.length === 0) return;
  if (qSortPattern.length < 5) return 1;
  if (qSortPattern.length < 7) return 2;
  if (qSortPattern.length < 9) return 2;
  if (qSortPattern.length < 11) return 3;
  return 4;
};

export default setMaxIterations;
