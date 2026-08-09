const minWordCount = (comment) => {
  if (!comment) return { cjk: 0, nonCJK: 0, totalWords: 0 };

  // Unicode ranges for CJK characters
  const cjkRegex =
    /[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uFF66-\uFF9F]/g;
  const cjkMatches = comment.match(cjkRegex) || [];

  // remove CJK characters first so leftover space-delimited words
  // don't double-count the same characters the regex already caught
  const nonCJKText = comment.replace(cjkRegex, " ");
  const nonCJKWords = nonCJKText.split(/\s+/).filter(Boolean);

  const totalWords = nonCJKWords.length + cjkMatches.length;

  return {
    cjk: cjkMatches.length,
    nonCJK: nonCJKWords.length,
    totalWords,
  };
};

export { minWordCount };
