// utilities/getInvalidPostsortKeys.js
import { minWordCount } from "../pages/postsort/minWordCount.js";

export function getInvalidPostsortKeys(
  keys,
  allCommentsObj,
  { minWordCountRequired, minWordCountValue },
) {
  return keys.filter((key) => {
    const comment = allCommentsObj[key];
    if (!comment || comment.length === 0) return true; // never answered = invalid
    if (minWordCountRequired) {
      return minWordCount(comment).totalWords <= minWordCountValue;
    }
    return false;
  });
}
