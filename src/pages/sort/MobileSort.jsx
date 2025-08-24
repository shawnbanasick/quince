// MobileSort.jsx
import { useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import useSettingsStore from "../../globalState/useSettingsStore";
// import useLocalStorage from "../../utilities/useLocalStorage";
import MobileSortSwapModal from "./MobileSortSwapModal";
// import ReactHtmlParser from "html-react-parser";
// import decodeHTML from "../../utilities/decodeHTML";
import useScreenOrientation from "../../utilities/useScreenOrientation";
import debounce from "lodash/debounce";
import MobileModal from "../../utilities/MobileModal";

import SortTitleBar from "./mobileSortComponents/SortTitleBar";
import SortStatementsContainer from "./mobileSortComponents/SortStatementContainer";
import OrientationMessage from "./mobileSortComponents/OrientationMessage";
import ExpandViewMessage from "./mobileSortComponents/ExpandViewMessage";
import { useEmojiArrays } from "./mobileSortHooks/useEmojiArrays";
import { useSortLogic } from "./mobileSortHooks/useSortLogic";
import { useTextLocalization } from "./mobileSortHooks/useTextLocalization";

// Store selectors
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getMapObj = (state) => state.mapObj;
const getConfigObj = (state) => state.configObj;
const getMobileSortFontSize = (state) => state.mobileSortFontSize;
const getMobileSortViewSize = (state) => state.mobileSortViewSize;
const getSetTriggerMobileSortSwapModal = (state) => state.setTriggerMobileSortSwapModal;
const getLangObj = (state) => state.langObj;
const getSetTriggerMobileSortHelpModal = (state) => state.setTriggerMobileSortHelpModal;
const getSetHasScrolledToBottomSort = (state) => state.setHasScrolledToBottomSort;
const getTriggerHelpModal = (state) => state.triggerMobileSortHelpModal;
const getSetTriggerHelpModal = (state) => state.setTriggerMobileSortHelpModal;
const getTriggerScrollBottomModal = (state) => state.triggerMobileSortScrollBottomModal;
const getSetTriggerScrollBottomModal = (state) => state.setTriggerMobileSortScrollBottomModal;

const MobileSort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const mapObj = useSettingsStore(getMapObj);
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const mobileSortFontSize = useStore(getMobileSortFontSize);
  const mobileSortViewSize = useStore(getMobileSortViewSize);
  // const setTriggerMobileSortSwapModal = useStore(getSetTriggerMobileSortSwapModal);
  const setTriggerMobileSortHelpModal = useStore(getSetTriggerMobileSortHelpModal);
  const setHasScrolledToBottomSort = useStore(getSetHasScrolledToBottomSort);
  const triggerHelpModal = useStore(getTriggerHelpModal);
  const setTriggerHelpModal = useStore(getSetTriggerHelpModal);
  const triggerScrollBottomModal = useStore(getTriggerScrollBottomModal);
  const setTriggerScrollBottomModal = useStore(getSetTriggerScrollBottomModal);

  const screenOrientation = useScreenOrientation();

  // Custom hooks
  const { displayArray } = useEmojiArrays(mapObj);
  const textLocalization = useTextLocalization(langObj);
  const {
    sortArray1,
    setSortArray1,
    targetArray,
    partitionArray,
    characteristicsArray,
    mobileColHeaders,
    handleCardSelected,
    handleStatementSwap,
    clearSelected,
    handleOnClickUp,
    handleOnClickDown,
  } = useSortLogic(mapObj, displayArray);

  const persistedMobileSortFontSize = JSON.parse(localStorage.getItem("m_FontSizeObject")).sort;
  const persistedMobileSortViewSize = JSON.parse(localStorage.getItem("m_ViewSizeObject")).sort;

  // Page initialization
  const startTimeRef = useRef(null);
  useEffect(() => {
    startTimeRef.current = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("sort");
      localStorage.setItem("currentPage", "sort");
      await setProgressScore(20);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTimeRef.current, "sortPage", "sortPage");
    };
  }, [setCurrentPage, setProgressScore]);

  // Event handlers
  const triggerHelp = () => {
    setTriggerMobileSortHelpModal(true);
  };

  const handleScroll = useCallback(
    debounce((event) => {
      const target = event.target;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const threshold = 100;

      if (distanceFromBottom <= threshold) {
        console.log("at bottom");
        setHasScrolledToBottomSort(true);
      }
    }, 100),
    [setHasScrolledToBottomSort]
  );

  // Early return for landscape orientation
  if (screenOrientation === "landscape-primary") {
    return <OrientationMessage text={textLocalization.screenOrientationText} />;
  }

  return (
    <Container>
      <SortTitleBar
        background={configObj.headerBarColor}
        conditionsOfInstruction={textLocalization.conditionsOfInstruction}
        onHelpClick={triggerHelp}
      />

      <MobileModal
        head={textLocalization.helpModalHead}
        text={textLocalization.helpModalText}
        trigger={triggerHelpModal}
        setTrigger={setTriggerHelpModal}
        showArrow={true}
        height={"450px"}
      />

      <MobileModal
        head={textLocalization.scrollBottomModalHead}
        text={textLocalization.scrollBottomModalText}
        trigger={triggerScrollBottomModal}
        setTrigger={setTriggerScrollBottomModal}
        showArrow={false}
        height={"150px"}
      />

      <MobileSortSwapModal
        clearSelected={clearSelected}
        targetArray={targetArray.current}
        handleStatementSwap={handleStatementSwap}
      />

      <SortStatementsContainer
        partitionArray={partitionArray}
        characteristicsArray={characteristicsArray}
        mobileColHeaders={mobileColHeaders}
        sortArray1={sortArray1}
        mobileSortFontSize={mobileSortFontSize}
        mobileSortViewSize={mobileSortViewSize}
        persistedMobileSortFontSize={persistedMobileSortFontSize}
        persistedMobileSortViewSize={persistedMobileSortViewSize}
        onCardSelected={handleCardSelected}
        onClickUp={handleOnClickUp}
        onClickDown={handleOnClickDown}
        onScroll={handleScroll}
      />

      <ExpandViewMessage text={textLocalization.expandViewMessage} />
    </Container>
  );
};

export default MobileSort;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  user-select: none;
  background-color: #f3f4f6;
`;
