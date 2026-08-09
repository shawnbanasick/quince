// utilities/getPostsortRequiredColumns.js
export default function getPostsortRequiredColumns(mapObj, configObj) {
  const keys = Object.keys(mapObj.postsortConvertObj);

  const agreeColDisp1 = keys.pop();
  const agreeColDisp2 = keys.pop();
  const disagreeColDisp1 = keys.shift();
  const disagreeColDisp2 = keys.shift();

  const requiredColumns = [agreeColDisp1, disagreeColDisp1];

  if (configObj.showSecondPosColumn) {
    requiredColumns.push(agreeColDisp2);
  }
  if (configObj.showSecondNegColumn) {
    requiredColumns.push(disagreeColDisp2);
  }

  return {
    agreeColDisp1,
    agreeColDisp2,
    disagreeColDisp1,
    disagreeColDisp2,
    requiredColumns, // columns that actually need postsort comments
  };
}
