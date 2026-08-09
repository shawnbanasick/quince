import { toArray, getText, getAttr } from "../utilities/xmlHelpers";

const processMapXMLData = (dataObject) => {
  const mapObj = {};
  const data = dataObject.map;
  const vColsObj = {};
  const colInfoArray = [];

  // --- map file version ---
  const infoArray = toArray(dataObject?.map?.info);
  const versionObject = infoArray.find(
    (infoItem) => getAttr(infoItem, "id") === "mapFileVersion",
  );
  if (!versionObject) {
    console.warn(
      'processMapXMLData: no <info id="mapFileVersion"> element found in map.xml',
    );
  }
  mapObj.mapFileVersion = getText(versionObject);

  // COLUMN LOOP -> get card counts per column
  const columns = toArray(data.column);
  for (let i = 0; i < columns.length; i++) {
    const columnEl = columns[i];
    const label = getAttr(columnEl, "id");
    const labelInt = parseInt(label, 10);

    if (Number.isNaN(labelInt)) {
      console.warn(
        `processMapXMLData: column at position ${i} has a non-numeric or missing "id" attribute`,
      );
    }

    const keyVal =
      labelInt < 0 ? `columnN${Math.abs(labelInt)}` : `column${labelInt}`;
    vColsObj[keyVal] = [];

    colInfoArray.push({
      colNum: i + 1,
      label,
      colour: `#${getAttr(columnEl, "colour")}`,
      numCards: getText(columnEl),
    });
  }
  mapObj.colInfoArray = colInfoArray;

  // ITEMS VALUES ---> get color arrays and q sort pattern, etc...
  const items = toArray(dataObject?.map?.item);

  // qSortPattern
  const qSortPatternObject = items.find(
    (item) => getAttr(item, "id") === "qSortPattern",
  );
  if (!qSortPatternObject) {
    console.warn(
      'processMapXMLData: no <item id="qSortPattern"> element found in map.xml',
    );
  }
  const qSortPatternText = getText(qSortPatternObject);
  mapObj.qSortPattern = qSortPatternText
    ? qSortPatternText.split(",").map((x) => +x)
    : [];

  for (let j = 0; j < items.length; j++) {
    const itemEl = items[j];
    const key = getAttr(itemEl, "id");
    const value = getText(itemEl, "");

    if (!key) {
      console.warn(
        `processMapXMLData: item at position ${j} is missing an "id" attribute`,
      );
      continue;
    }

    mapObj[key] = value.includes(",") ? value.split(",") : [value];
  }

  // create converter object for postsort
  const postsortConvertObj = {};
  const headerNumbers = mapObj.qSortHeaders ?? [];
  const headerValues = mapObj.qSortHeaderNumbers ?? [];

  if (!mapObj.qSortHeaders || !mapObj.qSortHeaderNumbers) {
    console.warn(
      "processMapXMLData: qSortHeaders or qSortHeaderNumbers missing — postsortConvertObj may be incomplete",
    );
  } else if (headerNumbers.length !== headerValues.length) {
    console.warn(
      "processMapXMLData: qSortHeaders and qSortHeaderNumbers have different lengths",
    );
  }

  for (let j = 0; j < headerNumbers.length; j++) {
    const key = `column${headerNumbers[j]}`;
    postsortConvertObj[key] = headerValues[j];
  }
  mapObj.postsortConvertObj = postsortConvertObj;

  return {
    vColsObj,
    mapObj,
  };
};

export default processMapXMLData;
