import styled from "styled-components";
import { withRouter } from "react-router-dom";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import convertObjectToResults from "../sort/convertObjectToResults";
import getObjectValues from "lodash/values";
import PropTypes from "prop-types";
import { getInvalidPostsortKeys } from "../../utilities/getInvalidPostsortKeys";
import getPostsortRequiredColumns from "../../utilities/getPostsortRequiredColumns";

const getConfigObj = (state) => state.configObj;
const getMapObj = (state) => state.mapObj;
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
const getSetTriggerPostsortPreventNavModal = (state) =>
  state.setTriggerPostsortPreventNavModal;
const getIsThinningFinished = (state) => state.isThinningFinished;
const getSetTriggerThinningPreventNavModal = (state) =>
  state.setTriggerThinningPreventNavModal;

const NextButton = (props) => {
  let goToNextPage;

  // GLOBAL STATE
  const configObj = useSettingsStore(getConfigObj);
  const mapObj = useSettingsStore(getMapObj);
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
    getSetShowPostsortCommentHighlighting,
  );
  const setTriggerPostsortPreventNavModal = useStore(
    getSetTriggerPostsortPreventNavModal,
  );
  const isThinningFinished = useStore(getIsThinningFinished);
  const setTriggerThinningPreventNavModal = useStore(
    getSetTriggerThinningPreventNavModal,
  );

  const allowUnforcedSorts = configObj.allowUnforcedSorts;
  const postsortCommentsRequired = configObj.postsortCommentsRequired;

  // PERSISTENT STATE
  let sortColumns = [];
  try {
    sortColumns = JSON.parse(localStorage.getItem("sortColumns")) || [];
  } catch (error) {
    console.error("JSON parsing failed:", error.message);
    return;
  }

  const {
    history,
    // location,
    // match,
    // staticContext,
    to = "/",
    onClick = () => {},
    // ⬆ filtering out props that `button` doesn’t know what to do with.
    ...rest
  } = props;

  const checkForNextPageConditions = (
    allowUnforcedSorts,
    isPresortFinished,
  ) => {
    // *** ReCalc Results ***
    let sortResults1 = convertObjectToResults(columnStatements);

    if (currentPage === "presort") {
      if (isPresortFinished === false) {
        setTriggerPresortPreventNavModal(true);
        return false;
      } else {
        return true;
      }
    }

    if (currentPage === "thin") {
      if (isThinningFinished === false) {
        console.log("thin");
        setTriggerThinningPreventNavModal(true);
        return false;
      } else {
        return true;
      }
    }

    if (currentPage === "sort") {
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
    }

    if (currentPage === "postsort") {
      const commentsRequired =
        postsortCommentsRequired === true ||
        postsortCommentsRequired === "true";

      if (commentsRequired) {
        const allCommentsObj =
          JSON.parse(localStorage.getItem("allCommentsObj")) || {};

        const vCols =
          JSON.parse(localStorage.getItem("columnStatements"))?.vCols || {};

        const minWordCountRequired =
          configObj.requireMinCommentLength === true ||
          configObj.requireMinCommentLength === "true";
        const minWordCountValue = configObj.minWordCountValuePostsort || 0;

        const { requiredColumns } = getPostsortRequiredColumns(
          mapObj,
          configObj,
        );
        const requiredColumnsSet = new Set(requiredColumns);

        const allKeys = Object.entries(vCols)
          .filter(([columnDisplay]) => requiredColumnsSet.has(columnDisplay))
          .flatMap(([columnDisplay, cards]) =>
            cards.map((_, i) => `textArea-${columnDisplay}_${i + 1}`),
          );

        const invalidKeys = getInvalidPostsortKeys(allKeys, allCommentsObj, {
          minWordCountRequired,
          minWordCountValue,
        });

        if (invalidKeys.length > 0) {
          setShowPostsortCommentHighlighting(true);
          setTriggerPostsortPreventNavModal(true);
          return false;
        }
      }
      return true;
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
    <GoNextButton
      {...rest} // `children` is just another prop!
      onClick={(event) => {
        onClick && onClick(event);
        goToNextPage = checkForNextPageConditions(
          allowUnforcedSorts,
          presortFinished,
        );
        if (goToNextPage) {
          history.push(to);
        }
      }}
      tabindex="0"
    />
  );
};
export default withRouter(NextButton);

// NextButton.defaultProps = {
//   to: "/",
//   onClick: () => {},
// };

NextButton.propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func,
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
  match: PropTypes.object,
  staticContext: PropTypes.object,
  // ⬆ filtering out props that `button` doesn’t know what to do with.
  rest: PropTypes.object,
};

const GoNextButton = styled.button`
  border-color: #2e6da4;
  color: white;
  font-size: 0.8em;
  font-weight: bold;
  padding: 0.5em;
  border-radius: 3px;
  text-decoration: none;
  width: auto;
  justify-self: right;
  margin-right: 35px;
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
