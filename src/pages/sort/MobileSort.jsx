import { useEffect, useMemo, useRef, useCallback } from "react";
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
import debounce from "lodash/debounce";

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
  // *** Local State ****************************************************
  // *********************************
  const targetArray = useRef([]);

  const [sortArray1, setSortArray1] = useLocalStorage("m_SortArray1", [
    ...JSON.parse(localStorage.getItem("m_FinalThinCols")),
  ]);

  const persistedMobileSortFontSize = JSON.parse(
    localStorage.getItem("m_FontSizeObject")
  ).sort;

  const persistedMobileSortViewSize = JSON.parse(
    localStorage.getItem("m_ViewSizeObject")
  ).sort;

  // *********************************
  // *** USE HOOKS ************************************
  // *********************************
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
    return result;
  }, [mapObj, sortArray1]);

  const valuesArraySource = useMemo(() => {
    let array3 = [...mapObj.qSortHeaderNumbers].reverse();
    array3 = array3.map((item) => {
      if (item > 0) {
        return `+${item}`;
      }
      return item;
    });
    return array3;
  }, [mapObj]);

  const characteristicsArray = useMemo(() => {
    const colorArraySource = [...mapObj.columnHeadersColorsArray].reverse();
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
  }, [mapObj, valuesArraySource]);

  // *********************************
  // *** Event Handlers *************************
  // *********************************
  const triggerHelp = () => {
    setTriggerMobileSortHelpModal(true);
  };

  const handleCardSelected = (e) => {
    try {
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

  let threshold = 100;
  // ignore the warning about inlining the function
  const handleScroll = useCallback(
    debounce((event) => {
      const target = event.target;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      if (distanceFromBottom <= threshold) {
        console.log("at bottom");
        setHasScrolledToBottomSort(true);
      }
    }, 100), // Debounce delay in milliseconds
    [setHasScrolledToBottomSort, threshold]
  );

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

  let sortArray = [];
  let externalIndex = -1;
  (partitionArray || []).map((subArray) => {
    let currentRankings2 = (subArray || []).map((item) => {
      externalIndex++;

      return (
        <ItemContainer key={uuid()}>
          <DownArrowContainer
            id={item.id}
            onClick={handleOnClickDown}
            color={characteristicsArray[externalIndex].color}
          >
            <DownArrows style={{ pointerEvents: "none", opacity: "0.95" }} />
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
              item.selected
                ? "lightyellow"
                : characteristicsArray[externalIndex].color
            }
          >
            <div
              data-index={externalIndex}
              data-id={item.id}
              data-color={characteristicsArray[externalIndex].color}
              data-group_num={characteristicsArray[externalIndex].value}
              data-statement_text={item.statement}
              data-font_size={persistedMobileSortFontSize}
              data-header={characteristicsArray[externalIndex].header}
            >
              {item.statement}
            </div>
          </InternalDiv>
          <UpArrowContainer
            id={item.id}
            onClick={handleOnClickUp}
            color={characteristicsArray[externalIndex].color}
          >
            <UpArrows style={{ pointerEvents: "none", opacity: "0.95" }} />
          </UpArrowContainer>
        </ItemContainer>
      );
    }); // end inner mappings

    sortArray.push(
      <Column key={uuid()} color={characteristicsArray[externalIndex].color}>
        <Label margins={{ top: 10, bottom: 0 }}>
          {characteristicsArray[externalIndex].value}
        </Label>
        {currentRankings2}
        <Label margins={{ top: 0, bottom: 10 }}>
          {characteristicsArray[externalIndex].value}
        </Label>
      </Column>
    );
  }); // end outer mappings

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
        {sortArray}
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
  width: 96vw;
  height: ${(props) => `${props.viewSize}vh`};
  align-items: center;
  gap: 15px;
  justify-content: space-between;
  border-radius: 3px;
  text-align: center;
  overflow-x: none;
  overflow-y: auto;
`;

const InternalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  position: relative;
  width: 80%;
  min-height: 10vh;
  font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }};
  text-align: center;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  border: 1px solid #36454f;
  border-radius: 8px;
  padding: 5px;
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
  background-color: ${(props) => {
    return props.color;
  }};

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
  background-color: ${(props) => {
    return props.color;
  }};
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

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  align-items: center;
  width: 100%;
  min-height: 80px;
  background-color: ${(props) => {
    return props.color;
  }};
  border-radius: 3px;
  text-align: center;
  border: 0.5px solid black;
`;

const Label = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  margin-top: ${(props) => `${props.margins.top}px`};
  margin-bottom: ${(props) => `${props.margins.bottom}px`};
  padding: 5px;
  width: 100%;
  min-height: 20px;
  font-size: 20px;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  border-radius: 5px;
`;
