const getColumnDisplayInfo = (mapObj, columnDisplay, placedOn) => {
  const columnKey = Array.isArray(columnDisplay)
    ? columnDisplay[0]
    : columnDisplay;

  const columnSuffix =
    typeof columnKey === "string" ? columnKey.replace(/^column/, "") : "";

  const qSortHeaders = mapObj?.["qSortHeaders"] || [];

  const columnIndex = qSortHeaders.indexOf(columnSuffix);

  let columnLabel = "";
  if (mapObj?.["colTextLabelsArray"] && columnIndex >= 0) {
    columnLabel = mapObj["colTextLabelsArray"][columnIndex] || "";
  }

  let columnNum = "";
  if (mapObj?.["useColLabelNumsPostsort"] && columnIndex >= 0) {
    const rawNum = mapObj?.["qSortHeaderNumbers"]?.[columnIndex];
    if (rawNum !== undefined) {
      const numValue = +rawNum;
      const displaySign = numValue > 0 ? "+" : "";
      columnNum = `${placedOn} ${displaySign}${rawNum}`;
    }
  }

  let backgroundColor;
  const colorsArray = mapObj?.["columnHeadersColorsArray"];
  if (colorsArray && columnIndex >= 0) {
    backgroundColor = colorsArray[columnIndex];
  }

  return { columnLabel, columnNum, backgroundColor, columnIndex };
};

export default getColumnDisplayInfo;
