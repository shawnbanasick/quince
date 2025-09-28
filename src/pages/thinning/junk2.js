// **********************************************************************
// *** ON CONFIRM BUTTON CLICK ******************************************
// **********************************************************************
const handleConfirm = () => {
  console.log("confirm button clicked");
  // ******* DISPATCHER ********
  // pull COLUMN data from local storage
  let newCols = JSON.parse(localStorage.getItem("newCols"));

  // filter out selected items
  let selectedPosItems = posSorted.filter((item) => item.selectedPos === true);
  let nextPosSet = posSorted.filter((item) => item.selectedPos === false);
  // filter out selected items
  let selectedNegItems = negSorted.filter((item) => item.selectedNeg === true);
  let nextNegSet = negSorted.filter((item) => item.selectedNeg === false);

  console.log("nextPosSet", nextPosSet.length);
  console.log("nextNegSet", nextNegSet.length);

  let colInfo;
  let leftNum;
  let currentCol;
  if (thinningSide === "rightSide") {
    console.log("option 1");
    console.log("dispatch rightSide branch");
    colInfo = instructionObj.columnData.shift();
    setPreviousColInfo(colInfo);
    leftNum = colInfo[1];
    setCurrentSelectMaxValue(leftNum);
    console.log("colInfo: ", colInfo);
    if (nextPosSet.length <= +colInfo[1] && isRightSideFinished === false) {
      console.log("option 10");
      console.log("rightSide finished");
      setIsRightSideFinished(true);
      setThinningSide("leftSide");
      // setIsRightBelowThreshold(true);
      // next set, selectedItems, newCols, instructions
      setPosSorted([...nextPosSet]);

      selectedPosItems.forEach((obj) => {
        let objId = obj.id;
        let targetcol = obj.targetcol;
        newCols.statementList.forEach((item) => {
          console.log("targetcol: ", targetcol);
          if (item.id === objId) {
            newCols.vCols[targetcol].push(item);
            remove(newCols.statementList, (n) => n.id === objId);
          }
        });
      });
      let displayObject = displayDebugStateNums(newCols);
      console.log("debug newCols", JSON.stringify(displayObject));
      // clear targetArray and set state
      let copyInstructions = { ...instructionObj };
      setInstructionObj(() => ({
        ...copyInstructions,
        instructionsText: CreateLeftSide(leftNum, agreeLeastText),
        boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
      }));
      return;
    }
  }

  if (thinningSide === "leftSide") {
    console.log("dispatch leftSide branch");
    colInfo = instructionObj.columnData.pop();
    setPreviousColInfo(colInfo);
    console.log("colInfo: ", colInfo);
    // SET ONLY DO LEFT SIDE CONDITIONS
    if (nextNegSet.length <= +colInfo[1] && isLeftSideFinished === false) {
      console.log("option 2");

      console.log("leftSide finished");
      setIsLeftSideFinished(true);
      // setIsLeftBelowThreshold(true);
      // setThinningSide("rightSide");
      // set state
      setNegSorted([...nextNegSet]);
      // move selected items to target column
      selectedNegItems.forEach((obj) => {
        let objId = obj.id;
        let targetcol = obj.targetcol;
        newCols.statementList.forEach((item) => {
          if (item.id === objId) {
            newCols.vCols[targetcol].push(item);
            remove(newCols.statementList, (n) => n.id === objId);
          }
        });
      });
      let displayObject = displayDebugStateNums(newCols);
      console.log("debug newCols", JSON.stringify(displayObject));
      // clear targetArray and set state
      setTargetArray([]);
      localStorage.setItem("newCols", JSON.stringify(newCols));
      setTargetArray([]);
      localStorage.setItem("newCols", JSON.stringify(newCols));
      let copyInstructions = { ...instructionObj };
      setInstructionObj(() => ({
        ...copyInstructions,
        instructionsText: CreateRightSide(colInfo[1], agreeMostText),

        boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
      }));
      return;
    }
  }

  //********* RIGHT SIDE *************** */
  if (thinningSide === "rightSide") {
    // set left side flag
    setThinningSide("leftSide");

    // Get Col info

    // todo *** ALL DISPLAY FINISHED ***
    if (
      colInfo === undefined ||
      (isRightSideFinished === true && isLeftSideFinished === true)
    ) {
      console.log("rightSide branch all display finished sub-branch");
      console.log("option 3");

      if (isThinningFinished === false) {
        console.log("both sides complete [colInfo undefined - neg branch]");
        setIsThinningFinished(true);
        setShowConfirmButton(false);
        setInstructionObj((instructions) => ({
          ...instructions,
          instructionsText: (
            <FinalInstructions>{finalInstructionText}</FinalInstructions>
          ),
          columnData: [...instructionObj.columnData],
          boxes: null,
        }));
        let completedCols = finishThinningSorts(newCols, finalSortColData);
        localStorage.setItem("columnStatements", JSON.stringify(completedCols));
      }
      return;
    }

    // todo *** EARLY RETURN - BACK TO NEG ***
    if (isRightSideFinished === true) {
      console.log("rightSide branch early return back to neg sub-branch");
      console.log("option 4");

      // setIsRightSideFinished(true);
      // setIsRightBelowThreshold(true);
      selectedPosItems.forEach((obj) => {
        let objId = obj.id;
        let targetcol = obj.targetcol;
        newCols.statementList.forEach((item) => {
          console.log("targetcol: ", targetcol);
          if (item.id === objId) {
            newCols.vCols[targetcol].push(item);
            remove(newCols.statementList, (n) => n.id === objId);
          }
        });
      });
      let displayObject = displayDebugStateNums(newCols);
      console.log("debug newCols", JSON.stringify(displayObject));
      // clear targetArray and set state
      setTargetArray([]);
      localStorage.setItem("newCols", JSON.stringify(newCols));
      // set instruction object values for text and boxes
      setInstructionObj((instructions) => ({
        ...instructions,
        side: "leftSide",
        columnData: [...instructionObj.columnData],
        instructionsText: CreateLeftSide(leftNum, agreeLeastText),
        boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
      }));
      return;
    }

    // todo << *** ALL DISPLAY FINISHED *** >>
    if (
      colInfo === undefined ||
      (isLeftSideFinished === true && isRightSideFinished === true)
    ) {
      console.log("option 5");
      console.log("rightSide branch all display finished sub-branch");
      console.log("both sides complete [colInfo undefined]");
      setIsThinningFinished(true);
      setShowConfirmButton(false);
      setInstructionObj((instructions) => ({
        ...instructions,
        instructionsText: (
          <FinalInstructions>{finalInstructionText}</FinalInstructions>
        ),
        columnData: [...instructionObj.columnData],
        boxes: null,
      }));
      let completedCols = finishThinningSorts(newCols, finalSortColData);
      localStorage.setItem("columnStatements", JSON.stringify(completedCols));
      return;
    }

    // todo <<<<***** NORMAL RETURN - Setup left side ******>>>>>
    // next set, selectedItems, newCols, instructions
    console.log("option 6");
    setPosSorted([...nextPosSet]);
    // move selected items to target column
    selectedPosItems.forEach((obj) => {
      let objId = obj.id;
      let targetcol = obj.targetcol;
      newCols.statementList.forEach((item) => {
        console.log("targetcol: ", targetcol);
        if (item.id === objId) {
          newCols.vCols[targetcol].push(item);
          remove(newCols.statementList, (n) => n.id === objId);
        }
      });
    });
    let displayObject = displayDebugStateNums(newCols);
    console.log("debug newCols", JSON.stringify(displayObject));
    // clear targetArray and set state
    setTargetArray([]);
    localStorage.setItem("newCols", JSON.stringify(newCols));
    // set instruction object values for text and boxes
    setInstructionObj((instructions) => ({
      ...instructions,
      side: "leftSide",
      columnData: [...instructionObj.columnData],
      instructionsText: CreateLeftSide(leftNum, agreeLeastText),
      boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
    }));
    return;
  } // end rightside branch

  // **********************************************************************
  // **********************************************************************

  if (thinningSide === "leftSide") {
    // set right side flag
    setThinningSide("rightSide");
    console.log("option 7");

    // todo *** ALL DISPLAY FINISHED ***
    if (
      colInfo === undefined ||
      (isRightSideFinished === true && isLeftSideFinished === true)
    ) {
      console.log("leftSide branch all display finished sub-branch");
      if (setIsThinningFinished === false) {
        console.log("both sides complete [colInfo undefined - neg branch]");
        setIsThinningFinished(true);
        setShowConfirmButton(false);
        setInstructionObj((instructions) => ({
          ...instructions,
          instructionsText: (
            <FinalInstructions>{finalInstructionText}</FinalInstructions>
          ),
          columnData: [...instructionObj.columnData],
          boxes: null,
        }));
        let completedCols = finishThinningSorts(newCols, finalSortColData);
        localStorage.setItem("columnStatements", JSON.stringify(completedCols));
      }
      return;
    }

    // todo << *** EARLY RETURN - BACK TO POS *** >>
    // if (nextSet.length === 0 || nextSet.length <= currentSelectMaxValue) {
    if (isRightSideFinished === true && isLeftSideFinished === false) {
      console.log(
        "early return [isRightSideFinished === true] - neg sub-branch"
      );
      console.log("option 8");

      setIsLeftSideFinished(true);
      // setIsLeftBelowThreshold(true);
      // remove pos statements from statements list
      posSorted.forEach((obj) => {
        let objId = obj.id;
        console.log("posSorted: ", posSorted);
        // iterate through all remaining statements and push if id matches
        newCols.statementList.forEach((item) => {
          if (item.id === objId) {
            // newCols.vCols[currentCol].push(item);
            remove(newCols.statementList, (n) => n.id === objId);
          }
        });
      });
      let displayObject = displayDebugStateNums(newCols);
      console.log("debug newCols", JSON.stringify(displayObject));

      if (newCols.vCols[currentCol]) {
        newCols.vCols[currentCol] = [
          ...newCols.vCols[currentCol],
          ...posSorted,
        ];
      } else {
        newCols.vCols[currentCol] = [...posSorted];
      }

      setPosSorted([]);

      localStorage.setItem("newCols", JSON.stringify(newCols));
      // set instruction object values for text and boxes
      setInstructionObj((instructions) => ({
        ...instructions,
        side: "rightSide",
        columnData: [...instructionObj.columnData],
        instructionsText: CreateLeftSide(colInfo[1], agreeLeastText),

        boxes: boxes([...negSorted], "leftSide", colInfo[1], colInfo[0]),
      }));
      setTargetArray([]);
      return;
    }

    // todo << ** NORMAL RETURN ** >>
    console.log("rightSide branch normal sub-branch");
    console.log("option 9");

    // set state
    setNegSorted([...nextNegSet]);
    // move selected items to target column
    selectedNegItems.forEach((obj) => {
      let objId = obj.id;
      let targetcol = obj.targetcol;
      newCols.statementList.forEach((item) => {
        if (item.id === objId) {
          newCols.vCols[targetcol].push(item);
          remove(newCols.statementList, (n) => n.id === objId);
        }
      });
    });
    let displayObject = displayDebugStateNums(newCols);
    console.log("debug newCols", JSON.stringify(displayObject));
    // clear targetArray and set state
    setTargetArray([]);
    localStorage.setItem("newCols", JSON.stringify(newCols));
    // set instruction object values for text and boxes
    setInstructionObj((instructions) => ({
      ...instructions,
      side: "rightSide",
      columnData: [...instructionObj.columnData],
      instructionsText: CreateRightSide(colInfo[1], agreeMostText),

      boxes: boxes([...posSorted], "rightSide", colInfo[1], colInfo[0]),
    }));
    return;
  } // end leftside branch
};
