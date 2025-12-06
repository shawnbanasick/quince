const decodeHTML = (string) => {
  if (string === undefined || string === null) {
    return "";
  }

  try {
    let shouldDoReplace = string.includes("{{{");

    if (shouldDoReplace === true) {
      let string2 = `${string}`;

      const replaceAmp = /&amp;/gi;
      const replaceLeft = /{{{/gi;
      const replaceRight = /}}}/gi;
      const replaceQuote = /&quot;/gi;
      const replaceSingleQuote = /&apos;/gi;
      const stringText2 = string2.replace(replaceLeft, "<");
      const stringText25 = stringText2.replace(replaceSingleQuote, "'");
      const stringText3 = stringText25.replace(replaceRight, ">");
      const stringText5 = stringText3.replace(replaceQuote, '"');
      const stringText6 = stringText5.replace(replaceAmp, "&");

      return `<div>${stringText6}</div>`;
    } else {
      return string;
    }
  } catch (error) {
    console.log("There was an error decoding into HTML");
    console.error(error);
  }
};

export default decodeHTML;
