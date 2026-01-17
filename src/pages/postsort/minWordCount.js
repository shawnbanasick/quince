const minWordCount = (comment) => {
  // Unicode ranges for CJ characters
  const regex = /[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uFF66-\uFF9F]/g;
  const matches = comment.match(regex) || [];

  const words = comment.split(" ") || [];

  // Calculate totals
  const totalWords = words.length + matches.length;
  return {
    cjk: matches.length,
    nonCJK: words.length,
    totalWords: totalWords,
  };
};
export { minWordCount };
