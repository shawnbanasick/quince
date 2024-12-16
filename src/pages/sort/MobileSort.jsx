// import { DragDropContext } from "@hello-pangea/dnd";
// import type { DropResult } from "@hello-pangea/dnd";

import React, { Component, ReactElement, useEffect } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import demoSortData from "./demoSortData";
import useSettingsStore from "../../globalState/useSettingsStore";
import { v4 as uuid } from "uuid";
import DownArrows from "../../assets/downArrows.svg?react";
import UpArrows from "../../assets/upArrows.svg?react";
import useLocalStorage from "../../utilities/useLocalStorage";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getMapObj = (state) => state.mapObj;
const getConfigObj = (state) => state.configObj;
let sortValuesArray1 = [JSON.parse(localStorage.getItem("sortValuesArray1"))];

let tempData = JSON.parse(localStorage.getItem("sortArray1"));

const MobileSort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const mapObj = useSettingsStore(getMapObj);
  const configObj = useSettingsStore(getConfigObj);

  demoSortData();

  const [sortArray1, setSortArray1] = useLocalStorage("sortArray1", tempData);

  console.log("sortArray", sortArray1);
  // let sortArrayColors = local;
  // console.log("sortArrayColors", sortArrayColors);

  const colorArraySource = [...mapObj.columnHeadersColorsArray].reverse();
  const qSortPattern = [...mapObj.qSortPattern];
  let colorArray = [];
  let titleText = "Sort Statements"; // mapObj.sortTitleText;

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

  // *** generate colorArray based on qSortPattern
  qSortPattern.forEach((item, index) => {
    for (let i = 0; i < item; i++) {
      colorArray.push(colorArraySource[index]);
    }
  });
  console.log("colorArray", colorArray);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      console.log("at bottom");
    }
  };

  const handleOnClickUp = (e) => {
    console.log("clicked Up", e.target.id);

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
    console.log("clicked Down", e.target.id);

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

  let currentRankings = sortArray1.map((item, index) => {
    return (
      <ItemContainer key={uuid()}>
        <DownArrowContainer id={item.id} onClick={handleOnClickDown}>
          <DownArrows style={{ pointerEvents: "none" }} />
        </DownArrowContainer>
        <InternalDiv id={item.id} key={uuid()} color={colorArray[index]}>
          {item.statement}
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
  width: 66vw;
  min-height: 10vh;
  font-size: 2vh;
  /* border-radius: 3px; */
  text-align: center;
  outline: 1px solid black;
  padding: 5px;
  -webkit-transition: background-color 1000ms linear;
  -moz-transition: background-color 1000ms linear;
  -o-transition: background-color 1000ms linear;
  -ms-transition: background-color 1000ms linear;
  transition: all 1000ms linear;
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
