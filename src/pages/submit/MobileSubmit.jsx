import React, { Component, ReactElement, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
// import type { DropResult } from "@hello-pangea/dnd";
import useStore from "../../globalState/useStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;

const MobileSort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);

  useEffect(() => {
    let startTime = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("submit");
      localStorage.setItem("currentPage", "submit");
      await setProgressScore(20);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTime, "submitPage", "submitPage");
    };
  }, [setCurrentPage, setProgressScore]);

  return (
    <div>
      <h1>Submit Page</h1>
    </div>
  );
};

export default MobileSort;
