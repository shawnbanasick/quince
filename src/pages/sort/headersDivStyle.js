const headersDivStyle = (
  index,
  columnWidth,
  headerColorsArray,
  qSortHeaders,
  highlightedColHeader
) => {
  const draggingOverColumnId = highlightedColHeader;

  let location2 = +draggingOverColumnId.slice(6);
  if (isNaN(location2)) {
    location2 = draggingOverColumnId.slice(6);
  }

  const location = qSortHeaders.indexOf(location2);

  let color;
  if (location === index) {
    color = 'lightblue';
  } else {
    color = headerColorsArray[index];
  }
  return {
    height: 50,
    minWidth: columnWidth + 17,
    border: `solid 2px black`,
    background: color,
    fontSize: 25,
    paddingTop: 5,
    textAlign: `center`,
    marginBottom: 10,
    display: `inline-block`,
  };
};

export default headersDivStyle;
