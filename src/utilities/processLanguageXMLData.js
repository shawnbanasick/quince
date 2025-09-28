import useStore from "../globalState/useStore";

const processLanguageXMLData = (dataObject) => {
  try {
    const data = dataObject.language.item;

    let info = dataObject.language.info;

    const langObj = {};
    let versionObject = info.find((infoItem) => infoItem._attributes.id === "languageFileVersion");
    let version = versionObject._text;
    langObj.langFileVersion = version;

    for (let i = 0; i < data.length; i++) {
      langObj[data[i]._attributes.id] = data[i]._text;
      useStore.setState({ [data[i]._attributes.id]: data[i]._text });
    }
    return langObj;
  } catch (error) {
    console.log("there was a language import error");
    console.log(error);
  }
};

export default processLanguageXMLData;
