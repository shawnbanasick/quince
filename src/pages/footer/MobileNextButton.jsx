import styled from "styled-components";
import { withRouter } from "react-router";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import convertObjectToResults from "../sort/convertObjectToResults";
import getObjectValues from "lodash/values";

const getConfigObj = (state) => state.configObj;
const getPresortFinished = (state) => state.presortFinished;
const getSetTrigPrePrevNavModal = (state) =>
  state.setTriggerPresortPreventNavModal;
const getCurrentPage = (state) => state.currentPage;
const getSetCheckReqQuesCompl = (state) =>
  state.setCheckRequiredQuestionsComplete;
const getSetTrigSurvPrevNavModal = (state) =>
  state.setTriggerSurveyPreventNavModal;
const getIsSortingFinished = (state) => state.isSortingFinished;
const getHasOverloadedColumn = (state) => state.hasOverloadedColumn;
const getSetTrigSortPrevNavModal = (state) =>
  state.setTriggerSortPreventNavModal;
const getSetTrigSortOverColMod = (state) =>
  state.setTriggerSortOverloadedColumnModal;
const getColumnStatements = (state) => state.columnStatements;
const getSetResults = (state) => state.setResults;
const getSetShowPostsortCommentHighlighting = (state) =>
  state.setShowPostsortCommentHighlighting;
const getSetTriggerMobilePostsortPreventNavModal = (state) =>
  state.setTriggerMobilePostsortPreventNavModal;
const getSetTriggerMobileThinPreventNavModal = (state) =>
  state.setTriggerMobileThinPreventNavModal;

const LinkButton = (props) => {
  let goToNextPage;

  // GLOBAL STATE
  const configObj = useSettingsStore(getConfigObj);
  const presortFinished = useStore(getPresortFinished);
  const setTriggerPresortPreventNavModal = useStore(getSetTrigPrePrevNavModal);
  const currentPage = useStore(getCurrentPage);
  const setCheckRequiredQuestionsComplete = useStore(getSetCheckReqQuesCompl);
  const setTriggerSurveyPreventNavModal = useStore(getSetTrigSurvPrevNavModal);
  const isSortingFinished = useStore(getIsSortingFinished);
  const hasOverloadedColumn = useStore(getHasOverloadedColumn);
  const setTriggerSortPreventNavModal = useStore(getSetTrigSortPrevNavModal);
  const setTriggerSortOverloadedColModal = useStore(getSetTrigSortOverColMod);
  const columnStatements = useSettingsStore(getColumnStatements);
  const setResults = useStore(getSetResults);
  const setShowPostsortCommentHighlighting = useStore(
    getSetShowPostsortCommentHighlighting
  );
  const setTriggerMobilePostsortPreventNavModal = useStore(
    getSetTriggerMobilePostsortPreventNavModal
  );
  const setTriggerMobileThinPreventNavModal = useStore(
    getSetTriggerMobileThinPreventNavModal
  );

  const allowUnforcedSorts = configObj.allowUnforcedSorts;
  const postsortCommentsRequired = configObj.postsortCommentsRequired;

  // PERSISTENT STATE
  const sortColumns = JSON.parse(localStorage.getItem("sortColumns")) || [];

  const {
    history,
    location,
    match,
    staticContext,
    to,
    onClick,
    // ⬆ filtering out props that `button` doesn’t know what to do with.
    ...rest
  } = props;

  const checkForNextPageConditions = (
    allowUnforcedSorts,
    isPresortFinished
  ) => {
    // *** ReCalc Results ***
    let sortResults1 = convertObjectToResults(columnStatements);

    if (currentPage === "presort") {
      if (isPresortFinished === false) {
        setTriggerPresortPreventNavModal(true);
        return false;
      } else {
        localStorage.setItem(
          "m_PresortDisplayStatements",
          JSON.stringify({ display: false })
        );
        return true;
      }
    }

    if (currentPage === "thin") {
      const isThinFinished = localStorage.getItem("m_ThinningFinished");
      if (isThinFinished === "true") {
        return true;
      } else {
        setTriggerMobileThinPreventNavModal(true);
        return false;
      }
    }

    if (currentPage === "sort") {
      /*
      if (isSortingFinished === false) {
        // check to see if finished, but had sorting registration error
        if (sortColumns?.imagesList?.length === 0) {
          if (allowUnforcedSorts === true) {
            // persist results to localStorage
            setResults(sortResults1);
            // localStorage.setItem("resultsSort", JSON.stringify(sortResults1));
            setTriggerSortPreventNavModal(false);
            return true;
          } else {
            // if forced sort -> allow nav only if no overloaded columns
            if (hasOverloadedColumn === true) {
              setTriggerSortPreventNavModal(false);
              setTriggerSortOverloadedColModal(true);
              return false;
            } else {
              setResults(sortResults1);
              // persist results to localStorage
              // localStorage.setItem("resultsSort", JSON.stringify(sortResults1));
              setTriggerSortPreventNavModal(false);
              return true;
            }
          }
        } else {
          // not finished sorting
          setTriggerSortPreventNavModal(true);
          return false;
        }
      } else {
        // has finished sorting
        if (allowUnforcedSorts === true) {
          // unforced ok -> allow nav
          setTriggerSortPreventNavModal(false);
          return true;
        } else {
          // unforced not ok -> allow nav if no overloaded columns
          if (hasOverloadedColumn === true) {
            setTriggerSortPreventNavModal(false);
            setTriggerSortOverloadedColModal(true);
            return false;
          } else {
            setTriggerSortPreventNavModal(false);
            return true;
          }
        }
      }
        */
    }

    if (currentPage === "postsort") {
      console.log("on postsort");
      let mobilePosResponses = JSON.parse(
        localStorage.getItem("m_PosRequiredStatesObj")
      );
      let mobileNegResponses = JSON.parse(
        localStorage.getItem("m_NegRequiredStatesObj")
      );

      // console.log(JSON.stringify(mobilePosResponses));

      const combinedResponses = {
        ...mobilePosResponses,
        ...mobileNegResponses,
      };
      const objValues = Object.values(combinedResponses);
      console.log(JSON.stringify(objValues));
      if (objValues.includes("")) {
        console.log("postsortCommentsRequired");
        // answers required in configObj
        if (postsortCommentsRequired === true) {
          setShowPostsortCommentHighlighting(true);
          setTriggerMobilePostsortPreventNavModal(true);
          return false;
        }
        return true;
      } else {
        return true;
      }
    }

    if (currentPage === "survey") {
      let resultsSurvey = JSON.parse(localStorage.getItem("resultsSurvey"));
      let values = getObjectValues(resultsSurvey);
      let includesNoResponse = values.includes("no-*?*-response");
      if (includesNoResponse) {
        // to turn on yellow color for unanswered
        setCheckRequiredQuestionsComplete(true);
        setTriggerSurveyPreventNavModal(true);
        return false;
      } else {
        return true;
      }
    }

    // for pages without checks
    return true;
  };

  //   console.log(props.width, nextButtonWidth);

  return (
    <NextButton
      {...rest} // `children` is just another prop!
      width={props.width}
      onClick={(event) => {
        // console.log("clicked");
        onClick && onClick(event);
        goToNextPage = checkForNextPageConditions(
          allowUnforcedSorts,
          presortFinished
        );
        if (goToNextPage) {
          history.push(to);
        }
      }}
      tabindex="0"
    />
  );
};
export default withRouter(LinkButton);

const NextButton = styled.button`
  border-color: #2e6da4;
  color: white;
  font-size: 1.5vh;
  font-weight: bold;
  padding: 0.5em;
  border-radius: 3px;
  text-decoration: none;
  width: ${(props) => `${props.width}px;`};
  height: 28px;
  justify-self: right;
  margin-right: 2vw;
  display: flex;
  align-items: center;
  user-select: none;
  justify-content: center;
  background-color: ${({ theme, active }) =>
    active ? theme.secondary : theme.primary};

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.focus};
  }
`;
