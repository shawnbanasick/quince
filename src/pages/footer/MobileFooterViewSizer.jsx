import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import useLocalStorage from "../../utilities/useLocalStorage";

const getLangObj = (state) => state.langObj;
const getCurrentPage = (state) => state.currentPage;
const getSetMobilePresortViewSize = (state) => state.setMobilePresortViewSize;
const getSetMobileThinViewSize = (state) => state.setMobileThinViewSize;
const getSetMobileSortViewSize = (state) => state.setMobileSortViewSize;
const getSetMobilePostsortViewSize = (state) => state.setMobilePostsortViewSize;

const MobileFooterViewSizer = () => {
  // *** GLOBAL STATE *** //
  const langObj = useSettingsStore(getLangObj);
  const currentPage = useStore(getCurrentPage);
  // set
  const setMobilePresortViewSize = useStore(getSetMobilePresortViewSize);
  const setMobileThinViewSize = useStore(getSetMobileThinViewSize);
  const setMobileSortViewSize = useStore(getSetMobileSortViewSize);
  const setMobilePostsortViewSize = useStore(getSetMobilePostsortViewSize);

  // *** LOCAL STATE *** //
  let [mobileViewSizeObject, setMobileViewSizeObject] = useLocalStorage(
    "mobileViewSizeObject",
    {
      presort: 42,
      thin: 68,
      sort: 52,
      postsort: 42,
    }
  );

  // *** TEXT LOCALIZATION *** //
  const mobileTextSize =
    ReactHtmlParser(decodeHTML(langObj.mobileViewSize)) || "";

  //*********************** */
  // *** EVENT HANDLERS ********* //
  //*********************** */
  const increaseViewSize = () => {
    if (currentPage === "presort") {
      const currentSize = +mobileViewSizeObject.presort;
      let newSize = currentSize + 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...mobileViewSizeObject, presort: newSize };
      setMobileViewSizeObject(newSizeObject);
      setMobilePresortViewSize(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = +mobileViewSizeObject.thin;
      let newSize = currentSize + 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...mobileViewSizeObject, thin: newSize };
      setMobileViewSizeObject(newSizeObject);
      setMobileThinViewSize(newSize);
    }
    if (currentPage === "sort") {
      const currentSize = +mobileViewSizeObject.sort;
      let newSize = currentSize + 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...mobileViewSizeObject, sort: newSize };
      setMobileViewSizeObject(newSizeObject);
      setMobileSortViewSize(newSize);
    }
    if (currentPage === "postsort") {
      const currentSize = +mobileViewSizeObject.postsort;
      let newSize = currentSize + 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...mobileViewSizeObject, postsort: newSize };
      setMobileViewSizeObject(newSizeObject);
      setMobilePostsortViewSize(newSize);
    }
  };
  const decreaseViewSize = () => {
    if (currentPage === "presort") {
      const currentSize = +mobileViewSizeObject.presort;
      let newSize = currentSize - 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...mobileViewSizeObject, presort: newSize };
      setMobileViewSizeObject(newSizeObject);
      setMobilePresortViewSize(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = +mobileViewSizeObject.thin;
      let newSize = currentSize - 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...mobileViewSizeObject, thin: newSize };
      setMobileViewSizeObject(newSizeObject);
      setMobileThinViewSize(newSize);
    }
    if (currentPage === "sort") {
      const currentSize = +mobileViewSizeObject.sort;
      let newSize = currentSize - 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...mobileViewSizeObject, sort: newSize };
      setMobileViewSizeObject(newSizeObject);
      setMobileSortViewSize(newSize);
    }
    if (currentPage === "postsort") {
      const currentSize = +mobileViewSizeObject.postsort;
      let newSize = currentSize - 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...mobileViewSizeObject, postsort: newSize };
      setMobileViewSizeObject(newSizeObject);
      setMobilePostsortViewSize(newSize);
    }
  };

  //*********************** */
  // *** ELEMENT ********* //
  //*********************** */
  return (
    <Container>
      <SizeLeftButton padBottom={"0.3em"} onClick={decreaseViewSize}>
        -
      </SizeLeftButton>
      <SpanDiv>{mobileTextSize}</SpanDiv>
      <SizeRightButton padBottom={"0.25em"} onClick={increaseViewSize}>
        +
      </SizeRightButton>
    </Container>
  );
};

export default MobileFooterViewSizer;

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
  user-select: non e;
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
