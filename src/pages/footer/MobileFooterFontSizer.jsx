import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import useLocalStorage from "../../utilities/useLocalStorage";

const getLangObj = (state) => state.langObj;
const getCurrentPage = (state) => state.currentPage;
const getSetMobilePresortFontSize = (state) => state.setMobilePresortFontSize;
const getSetMobileThinFontSize = (state) => state.setMobileThinFontSize;
const getSetMobileSortFontSize = (state) => state.setMobileSortFontSize;
const getSetMobilePostsortFontSize = (state) => state.setMobilePostsortFontSize;

const MobileFooterFontSizer = () => {
  // *** GLOBAL STATE *** //
  const langObj = useSettingsStore(getLangObj);
  const currentPage = useStore(getCurrentPage);
  // set
  const setMobilePresortFontSize = useStore(getSetMobilePresortFontSize);
  const setMobileThinFontSize = useStore(getSetMobileThinFontSize);
  const setMobileSortFontSize = useStore(getSetMobileSortFontSize);
  const setMobilePostsortFontSize = useStore(getSetMobilePostsortFontSize);

  // *** LOCAL STATE *** //
  let [m_FontSizeObject, setm_FontSizeObject] = useLocalStorage(
    "m_FontSizeObject",
    {
      presort: 2,
      thin: 2,
      sort: 2,
      postsort: 2,
    }
  );

  // *** TEXT LOCALIZATION *** //
  const mobileTextSize =
    ReactHtmlParser(decodeHTML(langObj.mobileTextSize)) || "";

  //*********************** */
  // *** EVENT HANDLERS ********* //
  //*********************** */
  const increaseFontSize = () => {
    if (currentPage === "presort") {
      const currentSize = +m_FontSizeObject.presort;
      let newSize = currentSize + 0.1;
      newSize = newSize.toPrecision(2);
      let newSizeObject = { ...m_FontSizeObject, presort: newSize };
      setm_FontSizeObject(newSizeObject);
      setMobilePresortFontSize(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = +m_FontSizeObject.thin;
      let newSize = currentSize + 0.1;
      newSize = newSize.toPrecision(2);
      let newSizeObject = { ...m_FontSizeObject, thin: newSize };
      setm_FontSizeObject(newSizeObject);
      setMobileThinFontSize(newSize);
    }
    if (currentPage === "sort") {
      const currentSize = +m_FontSizeObject.sort;
      let newSize = currentSize + 0.1;
      newSize = newSize.toPrecision(2);
      let newSizeObject = { ...m_FontSizeObject, sort: newSize };
      setm_FontSizeObject(newSizeObject);
      setMobileSortFontSize(newSize);
    }
    if (currentPage === "postsort") {
      const currentSize = +m_FontSizeObject.postsort;
      let newSize = currentSize + 0.1;
      newSize = newSize.toPrecision(2);
      let newSizeObject = { ...m_FontSizeObject, postsort: newSize };
      setm_FontSizeObject(newSizeObject);
      setMobilePostsortFontSize(newSize);
    }
  };
  const decreaseFontSize = () => {
    if (currentPage === "presort") {
      const currentSize = +m_FontSizeObject.presort;
      let newSize = currentSize - 0.1;
      newSize = newSize.toPrecision(2);
      let newSizeObject = { ...m_FontSizeObject, presort: newSize };
      setm_FontSizeObject(newSizeObject);
      setMobilePresortFontSize(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = +m_FontSizeObject.thin;
      let newSize = currentSize - 0.1;
      newSize = newSize.toPrecision(2);
      let newSizeObject = { ...m_FontSizeObject, thin: newSize };
      setm_FontSizeObject(newSizeObject);
      setMobileThinFontSize(newSize);
    }
    if (currentPage === "sort") {
      const currentSize = +m_FontSizeObject.sort;
      let newSize = currentSize - 0.1;
      newSize = newSize.toPrecision(2);
      let newSizeObject = { ...m_FontSizeObject, sort: newSize };
      setm_FontSizeObject(newSizeObject);
      setMobileSortFontSize(newSize);
    }
    if (currentPage === "postsort") {
      const currentSize = +m_FontSizeObject.postsort;
      let newSize = currentSize - 0.1;
      newSize = newSize.toPrecision(2);
      let newSizeObject = { ...m_FontSizeObject, postsort: newSize };
      setm_FontSizeObject(newSizeObject);
      setMobilePostsortFontSize(newSize);
    }
  };

  //*********************** */
  // *** ELEMENT ********* //
  //*********************** */
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
  width: 30px;
  outline: 1px solid #36454f;
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
  color: white;
  font-weight: bold;
  /* color: black; */
  font-size: 1.4em;
  /* font-weight: bold; */
  padding: 0.25em 0.5em;
  padding-bottom: ${(props) => props.padBottom};
  height: 26px;
  width: 30px;
  outline: 1px solid #36454f;
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
  user-select: none;
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
  font-size: 12px;
  text-align: center;
  padding: 5px;
  outline: 1px solid #36454f;
  width: 60px;
`;
