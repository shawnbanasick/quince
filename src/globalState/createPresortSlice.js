const createPresortSlice = (set, get) => ({
  triggerPresortModal: true,
  presortNoReturn: false,
  presortPosCards: [],
  presortNeuCards: [],
  presortNegCards: [],
  presortCards: [],
  presortSortedStatementsNumInitial: 0,
  presortFinished: false,
  triggerPresortFinishedModal: false,
  triggerPresortPreventNavModal: false,
  results: {},
  m_PresortResults: [],
  triggerMobilePresortFinishedModal: false,
  mobilePresortFontSize: 2,
  mobilePresortViewSize: 42,
  triggerMobilePresortRedoModal: false,
  triggerMobilePresortHelpModal: false,

  setTriggerMobilePresortHelpModal: (bool) => {
    set(() => ({ triggerMobilePresortHelpModal: bool }));
  },
  setTriggerMobilePresortRedoModal: (bool) => {
    set(() => ({ triggerMobilePresortRedoModal: bool }));
  },
  setm_PresortStatementCount: (value) => {
    set(() => ({ m_PresortStatementCount: value }));
  },
  setMobilePresortViewSize: (value) => {
    set(() => ({ mobilePresortViewSize: value }));
  },
  setMobilePresortFontSize: (value) => {
    set(() => ({ mobilePresortFontSize: value }));
  },
  setTriggerMobilePresortFinishedModal: (bool) => {
    set(() => ({ triggerMobilePresortFinishedModal: bool }));
  },
  setm_PresortResults: (inputValue) => {
    set(() => ({ m_PresortResults: inputValue }));
  },
  setPresortNoReturn: (inputValue) => {
    set(() => ({ presortNoReturn: inputValue }));
  },
  setPresortPosCards: (inputValue) => {
    set(() => ({ presortPosCards: inputValue }));
  },
  setPresortNeuCards: (inputValue) => {
    set(() => ({ presortNeuCards: inputValue }));
  },
  setPresortNegCards: (inputValue) => {
    set(() => ({ presortNegCards: inputValue }));
  },
  setPresortCards: (inputValue) => {
    set(() => ({ presortCards: inputValue }));
  },
  setPresortSortedStatementsNumInitial: (inputValue) => {
    set(() => ({ presortSortedStatementsNumInitial: inputValue }));
  },
  setPresortFinished: (bool) => {
    set(() => ({ presortFinished: bool }));
  },
  setTriggerPresortFinishedModal: (bool) => {
    set(() => ({ triggerPresortFinishedModal: bool }));
  },
  setTriggerPresortPreventNavModal: (bool) => {
    set(() => ({ triggerPresortPreventNavModal: bool }));
  },
  setResults: (inputValue) => {
    set(() => ({ results: inputValue }));
  },
  setTriggerPresortModal: (inputValue) => {
    set(() => ({ triggerPresortModal: inputValue }));
  },
});

export default createPresortSlice;
