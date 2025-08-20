// hooks/useSortLogic.js
import { useMemo, useRef } from "react";
import { v4 as uuid } from "uuid";
import useStore from "../../../globalState/useStore";
import useLocalStorage from "../../../utilities/useLocalStorage";
import ColumnHeader from "../mobileSortComponents/ColumnHeader";

const getSetTriggerMobileSortSwapModal = (state) => state.setTriggerMobileSortSwapModal;

export const useSortLogic = (mapObj, displayArray) => {
  const setTriggerMobileSortSwapModal = useStore(getSetTriggerMobileSortSwapModal);
  const targetArray = useRef([]);

  const [sortArray1, setSortArray1] = useLocalStorage("m_SortArray1", [
    ...JSON.parse(localStorage.getItem("m_FinalThinCols")),
  ]);

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

    localStorage.setItem("m_SortCharacteristicsArray", JSON.stringify(tempArray));
    return tempArray;
  }, [mapObj, valuesArraySource]);

  const mobileColHeaders = useMemo(() => {
    const qSortHeaderNumbers = [...mapObj.qSortHeaderNumbers];
    const columnHeadersColorsArray = [...mapObj.columnHeadersColorsArray];
    const textHeaders = [...mapObj.mobileHeadersText];

    const shouldDisplayNums =
      mapObj.useColLabelNums?.[0] !== false && mapObj.useColLabelNums?.[0] !== "false";
    const shouldDisplayText =
      mapObj.useColLabelText?.[0] !== false && mapObj.useColLabelText?.[0] !== "false";
    const shouldDisplayEmojis =
      mapObj.useColLabelEmoji?.[0] !== false && mapObj.useColLabelEmoji?.[0] !== "false";

    const headers = qSortHeaderNumbers.map((value, index) => (
      <ColumnHeader
        key={uuid()}
        color={columnHeadersColorsArray[index]}
        shouldDisplayEmojis={shouldDisplayEmojis}
        shouldDisplayNums={shouldDisplayNums}
        shouldDisplayText={shouldDisplayText}
        emoji={displayArray[index]}
        value={value}
        textHeader={textHeaders[index]}
      />
    ));

    return headers.reverse();
  }, [mapObj, displayArray]);

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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatementSwap = (index0, index1) => {
    [sortArray1[index0], sortArray1[index1]] = [sortArray1[index1], sortArray1[index0]];
    setSortArray1([...sortArray1]);
  };

  const clearSelected = () => {
    sortArray1.forEach((item) => {
      item.selected = false;
    });
    setSortArray1([...sortArray1]);
    targetArray.current = [];
  };

  const handleOnClickUp = (e) => {
    let clickedItemIndex = sortArray1.findIndex((item) => item.id === e.target.id);
    if (clickedItemIndex === 0) {
      return; // Element is already at the start
    }

    const temp = sortArray1[clickedItemIndex];
    sortArray1[clickedItemIndex] = sortArray1[clickedItemIndex - 1];
    sortArray1[clickedItemIndex - 1] = temp;
    setSortArray1([...sortArray1]);
  };

  const handleOnClickDown = (e) => {
    let clickedItemIndex = sortArray1.findIndex((item) => item.id === e.target.id);
    if (clickedItemIndex >= sortArray1.length - 1) {
      return; // Element is already at the end
    }

    const temp = sortArray1[clickedItemIndex];
    sortArray1[clickedItemIndex] = sortArray1[clickedItemIndex + 1];
    sortArray1[clickedItemIndex + 1] = temp;
    setSortArray1([...sortArray1]);
  };

  return {
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
  };
};
