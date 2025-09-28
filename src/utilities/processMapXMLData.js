import useStore from "../globalState/useStore";

const processMapXMLData = (dataObject) => {
  const mapObj = {};
  const data = dataObject.map;
  const vColsObj = {};
  const colInfoArray = [];

  let info = dataObject.map.info;
  let versionObject = info.find((infoItem) => infoItem._attributes.id === "mapFileVersion");
  mapObj.mapFileVersion = versionObject._text;

  // COLUMN LOOP -> get card counts per column
  for (let i = 0; i < data.column.length; i++) {
    let keyVal;
    let label = data.column[i]._attributes.id;
    let labelInt = parseInt(label, 10);
    if (labelInt < 0) {
      keyVal = `columnN${Math.abs(labelInt)}`;
      vColsObj[keyVal] = [];
    } else {
      keyVal = `column${labelInt}`;
      vColsObj[keyVal] = [];
    }
    let tempObj = {};
    tempObj.colNum = i + 1;
    tempObj.label = label;
    tempObj.colour = `#${data.column[i]._attributes.colour}`;
    tempObj.numCards = data.column[i]._text;
    colInfoArray.push(tempObj);
  }

  // ITEMS VALUES ---> get color arrays and q sort pattern, etc...
  const itemsArray = dataObject.map.item;

  // qSortPattern
  let qSortPattern = [];
  const qSortPatternObject = itemsArray.find(
    (itemsArray) => itemsArray._attributes.id === "qSortPattern"
  );
  const qSortPatternText = qSortPatternObject._text;
  qSortPattern = qSortPatternText.split(",").map((x) => +x);
  mapObj.qSortPattern = qSortPattern;

  // qSortHeaderNumbers
  // qSortHeaders
  // columnHeadersColorsArray
  // columnColorsArray
  // colTextLabelsArray
  // emojiArrayType
  // useColLabelEmojiPresort
  // useColLabelNums
  // useColLabelText
  // useColLabelEmoji
  // useColLabelEmojiPostsort
  // useColLabelTextPostsort
  // useColLabelNumsPostsort

  for (let j = 0; j < data.item.length; j++) {
    let splitArray = [];
    let value = data.item[j]._text;
    let key = data.item[j]._attributes.id;
    // numerical array ==> convert to integers
    if (value === undefined || value === null) {
      value = "";
    } else if (value.includes(",")) {
      splitArray = value.split(",");
      mapObj[key] = splitArray;
    } else {
      mapObj[key] = [value];
    }
  }

  // create converter object for postsort
  const postsortConvertObj = {};
  const headerNumbers = [...mapObj.qSortHeaders];
  for (let j = 0; j < headerNumbers.length; j++) {
    let key = `column${headerNumbers[j]}`;
    postsortConvertObj[key] = mapObj.qSortHeaderNumbers[j];
  }
  mapObj.postsortConvertObj = postsortConvertObj;

  useStore.setState({ vColsObj: vColsObj });
  const returnObj = {};
  returnObj.vColsObj = vColsObj;
  returnObj.mapObj = mapObj;
  return returnObj;
};

export default processMapXMLData;
