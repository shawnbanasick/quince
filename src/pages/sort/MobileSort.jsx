import { Component, ReactElement, useEffect, useMemo } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import useSettingsStore from "../../globalState/useSettingsStore";
import { v4 as uuid } from "uuid";
import DownArrows from "../../assets/downArrows.svg?react";
import UpArrows from "../../assets/upArrows.svg?react";
import useLocalStorage from "../../utilities/useLocalStorage";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getMapObj = (state) => state.mapObj;
const getConfigObj = (state) => state.configObj;

const MobileSort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const mapObj = useSettingsStore(getMapObj);
  const configObj = useSettingsStore(getConfigObj);

  // *********************************
  // *** Local State ****************************************************
  // *********************************
  const [sortArray1, setSortArray1] = useLocalStorage(
    "sortArray1",
    JSON.parse(localStorage.getItem("mobileFinalThinCols"))
  );

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
  // *** generate colorArray and card number based on qSortPattern
  // *********************************
  const colorArraySource = [...mapObj.columnHeadersColorsArray].reverse();
  const valuesArraySource = [...mapObj.qSortHeaderNumbers].reverse();

  const colorArray = useMemo(() => {
    const qSortPattern = [...mapObj.qSortPattern];
    const tempArray = [];
    qSortPattern.forEach((item, index) => {
      const tempObj = {};
      for (let i = 0; i < item; i++) {
        tempObj.color = colorArraySource[index];
        tempObj.value = valuesArraySource[index];
        tempArray.push({ ...tempObj });
      }
    });
    return tempArray;
  }, [colorArraySource, valuesArraySource, mapObj.qSortPattern]);

  // *********************************
  // *** Event Handlers ****************************************************
  // *********************************
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      console.log("at bottom");
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
  // *** Elements ****************************************************
  // *********************************

  let currentRankings = sortArray1.map((item, index) => {
    return (
      <ItemContainer key={uuid()}>
        <DownArrowContainer id={item.id} onClick={handleOnClickDown}>
          <DownArrows style={{ pointerEvents: "none" }} />
        </DownArrowContainer>
        <InternalDiv id={item.id} key={uuid()} color={colorArray[index].color}>
          <div>
            <NumberContainer>{colorArray[index].value}</NumberContainer>
            {item.statement}
          </div>
        </InternalDiv>
        <UpArrowContainer id={item.id} onClick={handleOnClickUp}>
          <UpArrows style={{ pointerEvents: "none" }} />
        </UpArrowContainer>
      </ItemContainer>
    );
  });

  return (
    <div>
      <SortTitleBar background={configObj.headerBarColor}>
        Sort Statements
      </SortTitleBar>

      <StatementsContainer onScroll={handleScroll}>
        {currentRankings}
      </StatementsContainer>
    </div>
  );
};

export default MobileSort;

const SortTitleBar = styled.div`
  width: 100vw;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 30px;
  background-color: ${(props) => props.background};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 4.5vw;
`;

const StatementsContainer = styled.div`
  display: flex;
  align-self: top;
  justify-self: center;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-direction: row;
  flex-wrap: wrap;

  background-color: #e5e5e5;
  width: 96vw;
  height: calc(100vh - 170px);
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
  font-size: 2vh;
  /* border-radius: 3px; */
  text-align: center;
  outline: 1px solid black;
  padding: 5px;
  padding-top: 18px;
  -webkit-transition: background-color 1000ms linear;
  -moz-transition: background-color 1000ms linear;
  -o-transition: background-color 1000ms linear;
  -ms-transition: background-color 1000ms linear;
  transition: all 1000ms linear;
  user-select: none;
`;

const UpArrowContainer = styled.button`
  display: flex;
  width: 10vw;
  background-color: #d3d3d3;
  outline: 1px solid black;
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
  background-color: #d3d3d3;
  outline: 1px solid black;
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
`;

const NumberContainer = styled.div`
  /* float: left; */
  position: absolute;
  top: 0;
  left: 0;
  width: 22px;
  height: 16px;
  padding-bottom: 3px;
  background-color: lightgoldenrodyellow;
  outline: 1px solid black;
  border-bottom-right-radius: 3px;
  /* margin-right: 5px; */
`;
