import { toArray, getText, getAttr } from "../utilities/xmlHelpers";

const processLanguageXMLData = (dataObject) => {
  // No try/catch here on purpose: let parsing errors propagate to the
  // caller (App.js), which already handles load failures with a proper
  // error screen. Swallowing the error here would leave langObj undefined
  // and cause a harder-to-diagnose crash later.

  const langObj = {};

  // --- language file version ---
  const infoArray = toArray(dataObject?.language?.info);
  const versionObject = infoArray.find(
    (infoItem) => getAttr(infoItem, "id") === "languageFileVersion",
  );
  if (!versionObject) {
    console.warn(
      'processLanguageXMLData: no <info id="languageFileVersion"> element found in language.xml',
    );
  }
  langObj.langFileVersion = getText(versionObject);

  // --- language strings ---
  const items = toArray(dataObject?.language?.item);
  for (let i = 0; i < items.length; i++) {
    const itemEl = items[i];
    const key = getAttr(itemEl, "id");

    if (!key) {
      console.warn(
        `processLanguageXMLData: item at position ${i} is missing an "id" attribute`,
      );
      continue;
    }

    langObj[key] = getText(itemEl);
  }

  return langObj;
};

export default processLanguageXMLData;
