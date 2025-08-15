import useSettingsStore from "../../globalState/useSettingsStore";
// import DownArrows from "../../assets/downArrows.svg?react";

const generateColHeaders = () => {
  const mapObj = useSettingsStore.getState().mapObj;
  console.log(mapObj.emojiArrayType);
};

export { generateColHeaders };
