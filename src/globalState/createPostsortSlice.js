const createPostsortSlice = (set, get) => ({
  resultsPostsort: {},
  statementCommentsObj: {},
  triggerPostsortModal: true,
  postsortCommentCheckObj: {},
  showPostsortCommentHighlighting: false,
  triggerPostsortPreventNavModal: false,
  triggerMobilePostsortPreventNavModal: false,
  postsortDualImageArray: [],
  mobilePostsortFontSize: 2,
  mobilePostsortViewSize: 72,

  setTriggerMobilePostsortPreventNavModal: (inputValue) => {
    set(() => ({ triggerMobilePostsortPreventNavModal: inputValue }));
  },
  setMobilePostsortViewSize: (inputValue) => {
    set(() => ({ mobilePostsortViewSize: inputValue }));
  },
  setMobilePostsortFontSize: (inputValue) => {
    set(() => ({ mobilePostsortFontSize: inputValue }));
  },
  setPostsortDualImageArray: (inputValue) => {
    set(() => ({ postsortDualImageArray: inputValue }));
  },
  setResultsPostsort: (inputValue) => {
    set(() => ({ resultsPostsort: inputValue }));
  },
  setStatementCommentsObj: (inputValue) => {
    set(() => ({ statementCommentsObj: inputValue }));
  },
  setTriggerPostsortModal: (inputValue) => {
    set(() => ({ triggerPostsortModal: inputValue }));
  },
  setPostsortCommentCheckObj: (inputValue) => {
    set(() => ({ postsortCommentCheckObj: inputValue }));
  },
  setShowPostsortCommentHighlighting: (inputValue) => {
    set(() => ({ showPostsortCommentHighlighting: inputValue }));
  },
  setTriggerPostsortPreventNavModal: (inputValue) => {
    set(() => ({ triggerPostsortPreventNavModal: inputValue }));
  },
});

export default createPostsortSlice;
