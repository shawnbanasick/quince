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
const getSetMobileSurveyViewSize = (state) => state.setMobileSurveyViewSize;

const MobileFooterViewSizer = () => {
  // *** GLOBAL STATE *** //
  const langObj = useSettingsStore(getLangObj);
  const currentPage = useStore(getCurrentPage);
  // set
  const setMobilePresortViewSize = useStore(getSetMobilePresortViewSize);
  const setMobileThinViewSize = useStore(getSetMobileThinViewSize);
  const setMobileSortViewSize = useStore(getSetMobileSortViewSize);
  const setMobilePostsortViewSize = useStore(getSetMobilePostsortViewSize);
  const setMobileSurveyViewSize = useStore(getSetMobileSurveyViewSize);

  // *** LOCAL STATE *** //
  let [m_ViewSizeObject, setm_ViewSizeObject] = useLocalStorage("m_ViewSizeObject", {
    presort: 42,
    thin: 68,
    sort: 72,
    postsort: 42,
    survey: 72,
  });

  // *** TEXT LOCALIZATION *** //
  const mobileTextSize = ReactHtmlParser(decodeHTML(langObj.mobileViewSize)) || "";

  //*********************** */
  // *** EVENT HANDLERS ********* //
  //*********************** */
  const increaseViewSize = () => {
    if (currentPage === "presort") {
      const currentSize = +m_ViewSizeObject.presort;
      let newSize = currentSize + 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, presort: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobilePresortViewSize(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = +m_ViewSizeObject.thin;
      let newSize = currentSize + 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, thin: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobileThinViewSize(newSize);
    }
    if (currentPage === "sort") {
      const currentSize = +m_ViewSizeObject.sort;
      let newSize = currentSize + 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, sort: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobileSortViewSize(newSize);
    }
    if (currentPage === "postsort") {
      const currentSize = +m_ViewSizeObject.postsort;
      let newSize = currentSize + 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, postsort: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobilePostsortViewSize(newSize);
    }
    if (currentPage === "survey") {
      const currentSize = +m_ViewSizeObject.survey;
      let newSize = currentSize + 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, survey: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobileSurveyViewSize(newSize);
    }
  };
  const decreaseViewSize = () => {
    if (currentPage === "presort") {
      const currentSize = +m_ViewSizeObject.presort;
      let newSize = currentSize - 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, presort: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobilePresortViewSize(newSize);
    }
    if (currentPage === "thin") {
      const currentSize = +m_ViewSizeObject.thin;
      let newSize = currentSize - 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, thin: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobileThinViewSize(newSize);
    }
    if (currentPage === "sort") {
      const currentSize = +m_ViewSizeObject.sort;
      let newSize = currentSize - 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, sort: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobileSortViewSize(newSize);
    }
    if (currentPage === "postsort") {
      const currentSize = +m_ViewSizeObject.postsort;
      let newSize = currentSize - 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, postsort: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobilePostsortViewSize(newSize);
    }
    if (currentPage === "survey") {
      const currentSize = +m_ViewSizeObject.survey;
      let newSize = currentSize - 2;
      newSize = newSize.toPrecision(4);
      let newSizeObject = { ...m_ViewSizeObject, survey: newSize };
      setm_ViewSizeObject(newSizeObject);
      setMobileSurveyViewSize(newSize);
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
  font-weight: bold;
  color: white;
  /* color: black; */
  font-size: 1.4em;
  /* font-weight: bold; */
  padding: 0.25em 0.5em;
  padding-bottom: ${(props) => props.padBottom};
  height: 26px;
  width: 35px;
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
  /* align-items: center; */
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
  font-size: 14px;
  text-align: center;
  padding: 5px;
  outline: 1px solid #36454f;
  user-select: none;
`;
