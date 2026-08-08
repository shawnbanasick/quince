// utilities/getInvalidPostsortKeys.js
import { minWordCount } from "../pages/postsort/minWordCount.js";

export function getInvalidPostsortKeys(
  keys,
  allCommentsObj,
  { minWordCountRequired, minWordCountValue },
) {
  const responseKeys = Object.keys(allCommentsObj).filter((key) =>
    key.startsWith("textArea-"),
  ); // ignore identifier-style keys, only check actual textarea values

  return responseKeys.filter((responseKey) => {
    const comment = allCommentsObj[responseKey];
    if (!comment || comment.length === 0) return true;
    if (minWordCountRequired) {
      return minWordCount(comment).totalWords <= minWordCountValue;
    }
    return false;
  });
}
