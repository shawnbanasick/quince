import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import useSettingsStore from "../../globalState/useSettingsStore";
import { v4 as uuid } from "uuid";
import DownArrows from "../../assets/downArrows.svg?react";
import UpArrows from "../../assets/upArrows.svg?react";
import useLocalStorage from "../../utilities/useLocalStorage";
import MobileSortSwapModal from "./MobileSortSwapModal";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import HelpSymbol from "../../assets/helpSymbol.svg?react";
import MobileSortHelpModal from "./MobileSortHelpModal";
import useScreenOrientation from "../../utilities/useScreenOrientation";
import MobileSortScrollBottomModal from "./MobileSortScrollBottomModal";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getMapObj = (state) => state.mapObj;
const getConfigObj = (state) => state.configObj;
const getMobileSortFontSize = (state) => state.mobileSortFontSize;
const getMobileSortViewSize = (state) => state.mobileSortViewSize;
const getSetTriggerMobileSortSwapModal = (state) =>
  state.setTriggerMobileSortSwapModal;
const getLangObj = (state) => state.langObj;
const getSetTriggerMobileSortHelpModal = (state) =>
  state.setTriggerMobileSortHelpModal;
const getSetHasScrolledToBottomSort = (state) =>
  state.setHasScrolledToBottomSort;

const MobileSort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const mapObj = useSettingsStore(getMapObj);
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const mobileSortFontSize = useStore(getMobileSortFontSize);
  const mobileSortViewSize = useStore(getMobileSortViewSize);
  const setTriggerMobileSortSwapModal = useStore(
    getSetTriggerMobileSortSwapModal
  );
  const setTriggerMobileSortHelpModal = useStore(
    getSetTriggerMobileSortHelpModal
  );
  const setHasScrolledToBottomSort = useStore(getSetHasScrolledToBottomSort);

  // *********************************
  // *** TEXT LOCALIZATION **********************************************
  // *********************************
  const conditionsOfInstruction =
    ReactHtmlParser(decodeHTML(langObj.mobileSortConditionsOfInstruction)) ||
    "";
  const screenOrientationText =
    ReactHtmlParser(decodeHTML(langObj.screenOrientationText)) || "";

  // *********************************
  // *** HELPER FUNCTIONS **********************************************
  // *********************************
  // function doPartitionArray(array, lengths) {
  //   const result = [];
  //   let index = 0;

  //   for (const length of lengths) {
  //     result.push(array.slice(index, index + length));
  //     index += length;
  //   }

  //   return result;
  // }

  // *********************************
  // *** Local State ****************************************************
  // *********************************
  const targetArray = useRef([]);

  const [sortArray1, setSortArray1] = useLocalStorage("m_SortArray1", [
    ...JSON.parse(localStorage.getItem("m_FinalThinCols")),
  ]);

  // const [viewedBottomSort, setViewedBottomSort] = useLocalStorage(
  //   "m_ViewedBottomSort",
  //   "false"
  // );

  // console.log("sortArray1", sortArray1);

  const persistedMobileSortFontSize = JSON.parse(
    localStorage.getItem("m_FontSizeObject")
  ).sort;

  const persistedMobileSortViewSize = JSON.parse(
    localStorage.getItem("m_ViewSizeObject")
  ).sort;

  // *** record time on page
  useEffect(() => {
    let startTime = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("sort");
      localStorage.setItem("currentPage", "sort");
      await setProgressScore(20);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTime, "sortPage", "sortPage");
    };
  }, [setCurrentPage, setProgressScore]);

  // *********************************
  // *** USE HOOKS ************************************
  // *********************************
  let screenOrientation = useScreenOrientation();

  const partitionArray = useMemo(() => {
    const lengths = [...mapObj.qSortPattern].reverse();
    const result = [];
    let index = 0;
    let tempArray = [...sortArray1];

    for (const length of lengths) {
      result.push(tempArray.slice(index, index + length));
      index += length;
    }
    console.log("result", JSON.stringify(result, null, 2));
  }, [mapObj, sortArray1]);

  const characteristicsArray = useMemo(() => {
    const colorArraySource = [...mapObj.columnHeadersColorsArray].reverse();
    const valuesArraySource = [...mapObj.qSortHeaderNumbers].reverse();
    const headersText = mapObj.mobileHeadersText;
    const qSortPattern = [...mapObj.qSortPattern].reverse();
    const tempArray = [];
    qSortPattern.forEach((item, index) => {
      const tempObj = {};
      for (let i = 0; i < item; i++) {
        tempObj.color = colorArraySource[index];
        tempObj.value = valuesArraySource[index];
        tempObj.header = headersText[index];
        tempArray.push({ ...tempObj });
      }
    });

    localStorage.setItem(
      "m_SortCharacteristicsArray",
      JSON.stringify(tempArray)
    );
    return tempArray;
  }, [mapObj, sortArray1]);

  // *********************************
  // *** Event Handlers *************************
  // *********************************
  const triggerHelp = () => {
    setTriggerMobileSortHelpModal(true);
  };

  const handleCardSelected = (e) => {
    try {
      // error prevention
      if (targetArray.length === 2 || e.target.dataset.id === undefined) {
        return;
      }

      // Toggle selected state
      sortArray1.forEach((item) => {
        if (item.id === e.target.dataset.id) {
          item.selected = !item.selected;
        }
      });
      setSortArray1([...sortArray1]);

      // Check if the card is already selected
      if (targetArray.current[0]?.id === e.target.dataset.id) {
        targetArray.current = [];
        return;
      }

      // Push data to targetArray
      let tempObj = {
        id: e.target.dataset.id,
        statement: e.target.dataset.statement_text,
        color: e.target.dataset.color,
        index: e.target.dataset.index,
        groupNumber: e.target.dataset.group_num,
        fontSize: e.target.dataset.font_size,
        header: e.target.dataset.header,
      };
      targetArray.current = [...targetArray.current, tempObj];

      // trigger MODAL if two cards are selected
      if (targetArray.current.length >= 2) {
        setTriggerMobileSortSwapModal(true);
        console.log(JSON.stringify("open modal"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatementSwap = (index0, index1) => {
    [sortArray1[index0], sortArray1[index1]] = [
      sortArray1[index1],
      sortArray1[index0],
    ];
    setSortArray1([...sortArray1]);
  };

  const clearSelected = () => {
    sortArray1.forEach((item) => {
      item.selected = false;
    });
    setSortArray1([...sortArray1]);
    targetArray.current = [];
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      console.log("at bottom");
      setHasScrolledToBottomSort(true);
    }
  };

  const handleOnClickUp = (e) => {
    let clickedItemIndex = sortArray1.findIndex(
      (item) => item.id === e.target.id
    );
    // check if at start of array
    if (clickedItemIndex === 0) {
      return; // Element is already at the start
    }
    // if not at end, move down
    const temp = sortArray1[clickedItemIndex];
    sortArray1[clickedItemIndex] = sortArray1[clickedItemIndex - 1];
    sortArray1[clickedItemIndex - 1] = temp;
    setSortArray1([...sortArray1]);
    return;
  };

  const handleOnClickDown = (e) => {
    let clickedItemIndex = sortArray1.findIndex(
      (item) => item.id === e.target.id
    );
    // check if at end of array
    if (clickedItemIndex >= sortArray1.length - 1) {
      return; // Element is already at the end
    }
    // if not at the beginning, move up
    const temp = sortArray1[clickedItemIndex];
    sortArray1[clickedItemIndex] = sortArray1[clickedItemIndex + 1];
    sortArray1[clickedItemIndex + 1] = temp;
    setSortArray1([...sortArray1]);
    return;
  };

  // *********************************
  // *** EARLY RETURN *********************************
  // *********************************
  if (screenOrientation === "landscape-primary") {
    return (
      <OrientationDiv>
        <h1>{screenOrientationText}</h1>
      </OrientationDiv>
    );
  }

  // *********************************
  // *** Elements ****************************************************
  // *********************************

  let currentRankings = (sortArray1 || []).map((item, index) => {
    return (
      <ItemContainer key={uuid()}>
        <DownArrowContainer id={item.id} onClick={handleOnClickDown}>
          <DownArrows style={{ pointerEvents: "none", opacity: "0.75" }} />
        </DownArrowContainer>
        <InternalDiv
          onClick={handleCardSelected}
          id={item.id}
          key={uuid()}
          fontSize={
            mobileSortFontSize === +persistedMobileSortFontSize
              ? mobileSortFontSize
              : persistedMobileSortFontSize
          }
          color={
            item.selected ? "lightyellow" : characteristicsArray[index].color
          }
        >
          <div
            data-index={index}
            data-id={item.id}
            data-color={characteristicsArray[index].color}
            data-group_num={characteristicsArray[index].value}
            data-statement_text={item.statement}
            data-font_size={persistedMobileSortFontSize}
            data-header={characteristicsArray[index].header}
          >
            <NumberContainer>
              {characteristicsArray[index].value}&nbsp;&nbsp;
              {characteristicsArray[index].header}
            </NumberContainer>
            {item.statement}
          </div>
        </InternalDiv>
        <UpArrowContainer id={item.id} onClick={handleOnClickUp}>
          <UpArrows style={{ pointerEvents: "none", opacity: "0.75" }} />
        </UpArrowContainer>
      </ItemContainer>
    );
  });

  return (
    <Container>
      <SortTitleBar background={configObj.headerBarColor}>
        {conditionsOfInstruction}
        <HelpContainer onClick={triggerHelp}>
          <HelpSymbol />
        </HelpContainer>
      </SortTitleBar>
      <MobileSortHelpModal />
      <MobileSortScrollBottomModal />
      <MobileSortSwapModal
        clearSelected={clearSelected}
        targetArray={targetArray.current}
        handleStatementSwap={handleStatementSwap}
      />
      <StatementsContainer
        onScroll={handleScroll}
        viewSize={
          mobileSortViewSize === +persistedMobileSortViewSize
            ? mobileSortViewSize
            : persistedMobileSortViewSize
        }
      >
        {currentRankings}
      </StatementsContainer>
    </Container>
  );
};

export default MobileSort;

const SortTitleBar = styled.div`
  display: flex;
  width: 100vw;
  padding-left: 10px;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 30px;
  background-color: ${(props) => props.background};
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 4.5vw;
  user-select: none;
`;

const StatementsContainer = styled.div`
  display: flex;
  align-self: top;
  justify-self: center;
  margin-top: 10px;
  margin-bottom: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #e5e5e5;
  width: 96vw;
  height: ${(props) => `${props.viewSize}vh`};
  /* font-size: 1.1vh; */
  align-items: center;
  gap: 15px;

  justify-content: center;
  border-radius: 3px;
  text-align: center;
  overflow-x: none;
  overflow-y: auto;
  padding-bottom: 10px;
  padding-top: 10px;
  border-radius: 5px;
  border: 0.5px solid black;
`;

const InternalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  position: relative;
  width: 66vw;
  min-height: 10vh;
  font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }};
  text-align: center;
  border: 1px solid black;
  border-radius: 8px;
  padding: 5px;
  padding-top: 22px;
  -webkit-transition: background-color 300ms linear;
  -moz-transition: background-color 300ms linear;
  -o-transition: background-color 300ms linear;
  -ms-transition: background-color 300ms linear;
  transition: all 300ms linear;
  user-select: none;
`;

const UpArrowContainer = styled.button`
  display: flex;
  width: 10vw;
  /* background-color: #d3d3d3; */
  background-color: #e5e5e5;

  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vh;
  border: 0px;
  cursor: pointer;
`;

const DownArrowContainer = styled.button`
  width: 10vw;
  /* background-color: #d3d3d3; */
  background-color: #e5e5e5;

  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vh;
  border: 0px;
  cursor: pointer;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 10vh;
  flex-direction: row;
  user-select: none;
`;

const NumberContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: fit-content;
  text-align: left;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  color: gray;
  height: 16px;
  font-size: 12px;
  padding-bottom: 3px;
  background-color: #e3e3e3;
  outline: 1px solid black;
  border-top-left-radius: 3px;
  border-bottom-right-radius: 3px;
  /* margin-right: 5px; */
`;

const HelpContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 5px;
  align-items: center;
  padding-bottom: 5px;
  width: 20px;
  height: 20px;
  color: black;
  font-size: 2.5vh;
  font-weight: bold;
  user-select: none;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  user-select: none;
  background-color: #f3f4f6;
`;

const OrientationDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
