import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getCardFontSizeSort = (state) => state.cardFontSizeSort;
const getSetCardFontSizeSort = (state) => state.setCardFontSizeSort;
const getCardFontSizePresort = (state) => state.cardFontSizePresort;
const getSetCardFontSizePresort = (state) => state.setCardFontSizePresort;
const getCardFontSizePostsort = (state) => state.cardFontSizePostsort;
const getSetCardFontSizePostsort = (state) => state.setCardFontSizePostsort;
const getCurrentPage = (state) => state.currentPage;
const getMobileThinViewSize = (state) => state.mobileThinViewSize;
const getMobilePresortViewSize = (state) => state.mobilePresortViewSize;
const getSetMobileThinViewSize = (state) => state.setMobileThinViewSize;
const getSetMobilePresortViewSize = (state) => state.setMobilePresortViewSize;

const FooterViewSizer = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  let cardFontSizeSort = useStore(getCardFontSizeSort);
  let cardFontSizePostsort = useStore(getCardFontSizePostsort);
  let cardFontSizePresort = useStore(getCardFontSizePresort);
  const mobileViewSize =
    ReactHtmlParser(decodeHTML(langObj.mobileViewSize)) || "";
  const setCardFontSizeSort = useStore(getSetCardFontSizeSort);
  const currentPage = useStore(getCurrentPage);
  const cardFontSizeSortPersist = +localStorage.getItem("fontSizeSort");
  const cardFontSizePostsortPersist = +localStorage.getItem("fontSizePostsort");
  const cardFontSizePresortPersist = +localStorage.getItem("fontSizePresort");
  const setCardFontSizePostsort = useStore(getSetCardFontSizePostsort);
  // const setCardFontSizePresort = useStore(getSetCardFontSizePresort);
  const mobileThinViewSize = useStore(getMobileThinViewSize);
  const mobilePresortViewSize = useStore(getMobilePresortViewSize);
  const setMobileThinViewSize = useStore(getSetMobileThinViewSize);
  const setMobilePresortViewSize = useStore(getSetMobilePresortViewSize);

  if (cardFontSizePresortPersist && currentPage === "presort") {
    cardFontSizePresort = cardFontSizePresortPersist;
  }

  if (cardFontSizeSortPersist && currentPage === "sort") {
    cardFontSizeSort = cardFontSizeSortPersist;
  }

  if (cardFontSizePostsortPersist && currentPage === "postsort") {
    cardFontSizePostsort = cardFontSizePostsortPersist;
  }

  const increaseViewSize = () => {
    console.log("increaseFontSize");
    if (currentPage === "presort") {
      const currentSize = mobilePresortViewSize;
      const newSize = currentSize + 2;
      localStorage.setItem("mobilePresortViewSize", JSON.stringify(newSize));
      setMobilePresortViewSize(newSize);
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
      const currentSize = mobileThinViewSize;
      const newSize = currentSize + 2;
      localStorage.setItem("mobileThinViewSize", JSON.stringify(newSize));
      setMobileThinViewSize(newSize);
    }
  };
  const decreaseViewSize = () => {
    console.log("decreaseFontSize");
    if (currentPage === "presort") {
      const currentSize = mobilePresortViewSize;
      const newSize = currentSize - 2;
      localStorage.setItem("mobilePresortViewSize", JSON.stringify(newSize));
      setMobilePresortViewSize(newSize);
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
      const currentSize = mobileThinViewSize;
      const newSize = currentSize - 2;
      localStorage.setItem("mobileThinViewSize", JSON.stringify(newSize));
      setMobileThinViewSize(newSize);
    }
  };

  return (
    <Container>
      <SizeLeftButton padBottom={"0.3em"} onClick={decreaseViewSize}>
        -
      </SizeLeftButton>
      <SpanDiv>{mobileViewSize}</SpanDiv>
      <SizeRightButton padBottom={"0.25em"} onClick={increaseViewSize}>
        +
      </SizeRightButton>
    </Container>
  );
};

export default FooterViewSizer;

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
