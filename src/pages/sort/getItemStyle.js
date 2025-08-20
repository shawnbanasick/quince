const getItemStyle = (
  isDragging,
  draggableStyle,
  cardWidth,
  cardHeight,
  cardFontSize,
  cardColor,
  greenCardColor,
  yellowCardColor,
  pinkCardColor,
  fontColor
) => {
  // let newCardColor;
  // if (cardColor === "greenSortCard") {
  //   newCardColor = greenCardColor;
  // }
  // if (cardColor === "yellowSortCard") {
  //   newCardColor = yellowCardColor;
  // }
  // if (cardColor === "pinkSortCard") {
  //   newCardColor = pinkCardColor;
  // }

  // cardHeight = "16vh";

  return {
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: `0 2px 0 2px`,
    margin: `0 2px 2px 3px`,
    lineHeight: `1.3em`,
    fontSize: cardFontSize,
    color: fontColor,
    height: cardHeight,
    width: cardWidth,
    // borderRadius: `5px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: `1.5px solid darkgray`,
    filter: isDragging ? "brightness(0.85)" : "brightness(1.00)",
    zIndex: "-1",

    // transitionDelay: "0.2s",
    // change background colour if dragging  (#e6bbad or #FFB266)
    textAlign: `center`,
    // background: isDragging ? newCardColor : newCardColor,
    background: isDragging
      ? // ? "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)""
        "#ffffff"
      : "transparent",
    // styles we need to apply on draggables
    ...draggableStyle,
  };
};

export default getItemStyle;

/*
    // Responsive typography
    fontSize: `clamp(0.75rem, ${responsiveFontSize}px, 1.125rem)`,
    fontWeight: '500',
    lineHeight: '1.4',
    color: fontColor || '#1f2937',
    textAlign: 'center',
    */
