import styled from "styled-components";
import { withRouter } from "react-router";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import getObjectValues from "lodash/values";

const getConfigObj = (state) => state.configObj;
const getPresortFinished = (state) => state.presortFinished;
const getSetTrigMobilePrePrevNavModal = (state) => state.setTriggerMobilePresortPreventNavModal;
const getCurrentPage = (state) => state.currentPage;
const getSetCheckReqQuesCompl = (state) => state.setCheckRequiredQuestionsComplete;
const getSetTrigSurvPrevNavModal = (state) => state.setTriggerSurveyPreventNavModal;
const getSetShowPostsortCommentHighlighting = (state) => state.setShowPostsortCommentHighlighting;
const getSetTriggerMobilePostsortPreventNavModal = (state) =>
  state.setTriggerMobilePostsortPreventNavModal;
const getSetTriggerMobileThinPreventNavModal = (state) => state.setTriggerMobileThinPreventNavModal;
const getHasScrolledToBottomSort = (state) => state.hasScrolledToBottomSort;
const getSetTriggerMobileSortScrollBottomModal = (state) =>
  state.setTriggerMobileSortScrollBottomModal;

const MobileNextButton = (props) => {
  let goToNextPage;

  // GLOBAL STATE
  const configObj = useSettingsStore(getConfigObj);
  const presortFinished = useStore(getPresortFinished);
  const setTriggerPresortPreventNavModal = useStore(getSetTrigMobilePrePrevNavModal);
  const currentPage = useStore(getCurrentPage);
  const setCheckRequiredQuestionsComplete = useStore(getSetCheckReqQuesCompl);
  const setTriggerSurveyPreventNavModal = useStore(getSetTrigSurvPrevNavModal);
  const setShowPostsortCommentHighlighting = useStore(getSetShowPostsortCommentHighlighting);
  const setTriggerMobilePostsortPreventNavModal = useStore(
    getSetTriggerMobilePostsortPreventNavModal
  );
  const setTriggerMobileThinPreventNavModal = useStore(getSetTriggerMobileThinPreventNavModal);
  const hasScrolledToBottomSort = useStore(getHasScrolledToBottomSort);
  const setTriggerMobileSortScrollBottomModal = useStore(getSetTriggerMobileSortScrollBottomModal);

  const allowUnforcedSorts = configObj.allowUnforcedSorts;
  const postsortCommentsRequired = configObj.postsortCommentsRequired;

  // PERSISTENT STATE
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

  const checkForNextPageConditions = () => {
    let isPresortFinished = localStorage.getItem("m_PresortFinished");

    if (currentPage === "presort") {
      if (isPresortFinished === "true" || isPresortFinished === true) {
        setTriggerPresortPreventNavModal(false);
        localStorage.setItem("m_PresortDisplayStatements", JSON.stringify({ display: false }));
        return true;
      } else {
        setTriggerPresortPreventNavModal(true);
        return false;
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
      if (hasScrolledToBottomSort === false) {
        setTriggerMobileSortScrollBottomModal(true);
        return false;
      } else {
        return true;
      }
    }

    if (currentPage === "postsort") {
      let minWordCountPostsortObject = JSON.parse(
        localStorage.getItem("m_MinWordCountPostsortObject")
      );

      let minWordCountPostsortObjectValues = Object.values(minWordCountPostsortObject);
      if (minWordCountPostsortObjectValues.includes(false)) {
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

  return (
    <NextButton
      {...rest} // `children` is just another prop!
      width={props.width}
      onClick={(event) => {
        onClick && onClick(event);
        goToNextPage = checkForNextPageConditions(allowUnforcedSorts, presortFinished);
        if (goToNextPage) {
          history.push(to);
        }
      }}
      tabindex="0"
    />
  );
};
export default withRouter(MobileNextButton);

const NextButton = styled.button`
  display: flex;
  justify-content: center;
  border-color: #2e6da4;
  color: white;
  font-size: 1.5vh;
  font-weight: bold;
  padding: 0.5em;
  border-radius: 3px;
  text-decoration: none;
  width: ${(props) => `${props.width}px;`};
  height: 28px;
  /* margin-right: 2vw; */
  align-items: center;
  user-select: none;

  background-color: ${({ theme, active }) => (active ? theme.secondary : theme.primary)};

  /* &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.focus};
  } */
`;
