import shuffle from "lodash/shuffle";
import { toArray } from "../utilities/xmlHelpers";

// prep column setup array
const processStatementsXMLData = (dataObject, shuffleCards, vColsObj) => {
  const data = toArray(dataObject?.statements?.statement);

  if (data.length === 0) {
    console.warn(
      "processStatementsXMLData: no <statement> elements found in statements.xml",
    );
  }

  const seenIds = new Set();

  let statementsArray = data.map((statementEl, i) => {
    const rawId = statementEl?._attributes?.id;
    const text = statementEl?._text?.trim() ?? "";

    if (rawId === undefined) {
      console.warn(
        `processStatementsXMLData: statement at position ${i} is missing an "id" attribute`,
      );
    }
    if (text === "") {
      console.warn(
        `processStatementsXMLData: statement id="${rawId}" has no text content`,
      );
    }
    if (seenIds.has(rawId)) {
      console.warn(
        `processStatementsXMLData: duplicate statement id "${rawId}" found`,
      );
    }
    seenIds.add(rawId);

    return {
      id: `s${rawId}`,
      statementNum: rawId,
      divColor: "isUncertainStatement",
      cardColor: "yellowSortCard",
      pinkChecked: false,
      yellowChecked: true,
      greenChecked: false,
      sortValue: 222,
      backgroundColor: "#e0e0e0",
      statement: text,
    };
  });

  if (shuffleCards === true) {
    statementsArray = shuffle(statementsArray);
  }

  const columnStatements = {
    vCols: vColsObj,
    statementList: statementsArray,
  };

  localStorage.setItem("hasBeenLoaded", "true");

  return {
    columnStatements,
    totalStatements: statementsArray.length,
  };
};

export default processStatementsXMLData;
