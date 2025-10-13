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
const getSetCardFontSizeThin = (state) => state.setCardFontSizeThin;
const getCardFontSizeThin = (state) => state.cardFontSizeThin;

const FooterFontSizer = () => {
  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  let cardFontSizeSort = useStore(getCardFontSizeSort);
  let cardFontSizePostsort = useStore(getCardFontSizePostsort);
  let cardFontSizePresort = useStore(getCardFontSizePresort);
  const fontSizeText = ReactHtmlParser(decodeHTML(langObj.fontSizeText)) || "";
  // const setCardFontSize = useStore(getSetCardFontSize);
  const setCardFontSizeSort = useStore(getSetCardFontSizeSort);
  const currentPage = useStore(getCurrentPage);
  const cardFontSizeSortPersist = +localStorage.getItem("fontSizeSort");
  const cardFontSizePostsortPersist = +localStorage.getItem("fontSizePostsort");
  const cardFontSizePresortPersist = +localStorage.getItem("fontSizePresort");
  const setCardFontSizePostsort = useStore(getSetCardFontSizePostsort);
  const setCardFontSizePresort = useStore(getSetCardFontSizePresort);
  const setCardFontSizeThin = useStore(getSetCardFontSizeThin);
  const cardFontSizeThin = useStore(getCardFontSizeThin);

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
      const currentSize = cardFontSizePresort;
      const newSize = currentSize + 1;
      localStorage.setItem("fontSizePresort", JSON.stringify(newSize));
      setCardFontSizePresort(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = cardFontSizeThin;
      const newSize = currentSize + 1;
      localStorage.setItem("fontSizeThin", JSON.stringify(newSize));
      setCardFontSizeThin(newSize);
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
  };
  const decreaseFontSize = () => {
    console.log("decreaseFontSize");
    if (currentPage === "presort") {
      const currentSize = cardFontSizePresort;
      let newSize = currentSize - 1;
      if (newSize < 1) {
        newSize = 1;
      }
      localStorage.setItem("fontSizePresort", JSON.stringify(newSize));
      setCardFontSizePresort(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = cardFontSizeThin;
      let newSize = currentSize - 1;
      if (newSize < 1) {
        newSize = 1;
      }
      localStorage.setItem("fontSizeThin", JSON.stringify(newSize));
      setCardFontSizeThin(newSize);
    }
    if (currentPage === "sort") {
      const currentSize = cardFontSizeSort;
      let newSize = currentSize - 1;
      if (newSize < 1) {
        newSize = 1;
      }
      localStorage.setItem("fontSizeSort", JSON.stringify(newSize));
      setCardFontSizeSort(newSize);
    }
    if (currentPage === "postsort") {
      const currentSize = cardFontSizePostsort;
      let newSize = currentSize - 1;
      if (newSize < 1) {
        newSize = 1;
      }
      localStorage.setItem("fontSizePostsort", JSON.stringify(newSize));
      setCardFontSizePostsort(newSize);
    }
  };

  return (
    <Container data-testid="FooterFontSizerDiv">
      <SpanDiv>{fontSizeText}</SpanDiv>
      <SizeButton data-testid="FooterFontSizerNeg" padBottom={"0.4em"} onClick={decreaseFontSize}>
        -
      </SizeButton>
      <SizeButton data-testid="FooterFontSizerPos" padBottom={"0.25em"} onClick={increaseFontSize}>
        +
      </SizeButton>
    </Container>
  );
};

export default FooterFontSizer;

const SizeButton = styled.button`
  background: #337ab7;
  border-color: #2e6da4;
  color: white;
  font-size: 1.4em;
  font-weight: bold;
  margin: 0 3px 0 3px;
  padding: 0.25em 0.5em;
  padding-bottom: ${(props) => props.padBottom};
  height: 30px;
  width: 35px;

  border-radius: 3px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const SpanDiv = styled.div`
  font-size: 16px;
  user-select: none;
`;
