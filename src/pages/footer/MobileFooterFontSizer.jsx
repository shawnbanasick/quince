import React from "react";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
// const getSetCardFontSize = (state) => state.setCardFontSize;
const getCardFontSizeSort = (state) => state.cardFontSizeSort;
const getSetCardFontSizeSort = (state) => state.setCardFontSizeSort;
const getCardFontSizePresort = (state) => state.cardFontSizePresort;
const getSetCardFontSizePresort = (state) => state.setCardFontSizePresort;
const getCardFontSizePostsort = (state) => state.cardFontSizePostsort;
const getSetCardFontSizePostsort = (state) => state.setCardFontSizePostsort;
const getCurrentPage = (state) => state.currentPage;
const getMobileThinFontSize = (state) => state.mobileThinFontSize;
const getMobilePresortFontSize = (state) => state.mobilePresortFontSize;
const getSetMobileThinFontSize = (state) => state.setMobileThinFontSize;
const getSetMobilePresortFontSize = (state) => state.setMobilePresortFontSize;

const MobileFooterFontSizer = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  let cardFontSizeSort = useStore(getCardFontSizeSort);
  let cardFontSizePostsort = useStore(getCardFontSizePostsort);
  let cardFontSizePresort = useStore(getCardFontSizePresort);
  const mobileTextSize =
    ReactHtmlParser(decodeHTML(langObj.mobileTextSize)) || "";
  // const setCardFontSize = useStore(getSetCardFontSize);
  const setCardFontSizeSort = useStore(getSetCardFontSizeSort);
  const currentPage = useStore(getCurrentPage);
  const cardFontSizeSortPersist = +localStorage.getItem("fontSizeSort");
  const cardFontSizePostsortPersist = +localStorage.getItem("fontSizePostsort");
  const cardFontSizePresortPersist = +localStorage.getItem("fontSizePresort");
  const setCardFontSizePostsort = useStore(getSetCardFontSizePostsort);
  const setCardFontSizePresort = useStore(getSetCardFontSizePresort);
  const mobileThinFontSize = useStore(getMobileThinFontSize);
  const mobilePresortFontSize = useStore(getMobilePresortFontSize);
  const setMobileThinFontSize = useStore(getSetMobileThinFontSize);
  const setMobilePresortFontSize = useStore(getSetMobilePresortFontSize);

  if (cardFontSizePresortPersist && currentPage === "presort") {
    cardFontSizePresort = cardFontSizePresortPersist;
  }

  if (cardFontSizeSortPersist && currentPage === "sort") {
    cardFontSizeSort = cardFontSizeSortPersist;
  }

  if (cardFontSizePostsortPersist && currentPage === "postsort") {
    cardFontSizePostsort = cardFontSizePostsortPersist;
  }

  const increaseFontSize = () => {
    if (currentPage === "presort") {
      const currentSize = mobilePresortFontSize;
      let newSize = currentSize + 0.1;
      newSize = newSize.toPrecision(2);
      localStorage.setItem("mobilePresortFontSize", JSON.stringify(newSize));
      setMobilePresortFontSize(newSize);
    }
    if (currentPage === "sort") {
      const currentSize = cardFontSizeSort;
      const newSize = currentSize + 1;
      localStorage.setItem("fontSizeSort", JSON.stringify(newSize));
      setCardFontSizeSort(newSize);
    }
    if (currentPage === "postsort") {
      const currentSize = cardFontSizePostsort;
      const newSize = currentSize + 1;
      localStorage.setItem("fontSizePostsort", JSON.stringify(newSize));
      setCardFontSizePostsort(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = mobileThinFontSize;
      const newSize = currentSize + 0.1;
      localStorage.setItem("mobileThinFontSize", JSON.stringify(newSize));
      setMobileThinFontSize(newSize);
    }
  };
  const decreaseFontSize = () => {
    if (currentPage === "presort") {
      const currentSize = mobilePresortFontSize;
      let newSize = currentSize - 0.1;
      newSize = newSize.toPrecision(2);
      localStorage.setItem("mobilePresortFontSize", JSON.stringify(newSize));
      setMobilePresortFontSize(newSize);
    }
    if (currentPage === "sort") {
      const currentSize = cardFontSizeSort;
      const newSize = currentSize - 1;
      localStorage.setItem("fontSizeSort", JSON.stringify(newSize));
      setCardFontSizeSort(newSize);
    }
    if (currentPage === "postsort") {
      const currentSize = cardFontSizePostsort;
      const newSize = currentSize - 1;
      localStorage.setItem("fontSizePostsort", JSON.stringify(newSize));
      setCardFontSizePostsort(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = mobileThinFontSize;
      const newSize = currentSize - 0.1;
      localStorage.setItem("mobileThinFontSize", JSON.stringify(newSize));
      setMobileThinFontSize(newSize);
    }
  };

  return (
    <Container>
      <SizeLeftButton padBottom={"0.3em"} onClick={decreaseFontSize}>
        -
      </SizeLeftButton>
      <SpanDiv>{mobileTextSize}</SpanDiv>
      <SizeRightButton padBottom={"0.25em"} onClick={increaseFontSize}>
        +
      </SizeRightButton>
    </Container>
  );
};

export default MobileFooterFontSizer;

const SizeRightButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #337ab7;
  border-color: #2e6da4;
  /* font-weight: bold; */
  color: white;
  /* color: black; */
  font-size: 1.4em;
  padding: 0.25em 0.5em;
  padding-bottom: ${(props) => props.padBottom};
  height: 26px;
  width: 35px;
  outline: 1px solid black;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border: 0px;
  text-decoration: none;
  &:active {
    background: #286090;
  }
`;

const SizeLeftButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #337ab7;
  border-color: #2e6da4;
  font-weight: bold;
  color: white;
  /* color: black; */
  font-size: 1.4em;
  /* font-weight: bold; */
  padding: 0.25em 0.5em;
  padding-bottom: ${(props) => props.padBottom};
  height: 26px;
  width: 35px;
  outline: 1px solid black;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border: 0px;
  text-decoration: none;
  &:active {
    background: #286090;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SpanDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  background: #337ab7;
  border-color: #2e6da4;
  /* font-weight: bold; */
  color: white;
  font-size: 14px;
  text-align: center;
  padding: 5px;
  outline: 1px solid black;
`;
