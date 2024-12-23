const createThinningSlice = (set, get) => ({
  thinningSide: "rightSide",
  showConfirmButton: true,
  previousColInfo: [],
  isThinningFinished: false,
  triggerThinningPreventNavModal: false,
  isConfirmationFinished: false,
  triggerConfirmationFinishedModal: false,
  isLeftSideFinished: false,
  isRightSideFinished: false,
  currentSelectMaxValue: 0,
  posSorted: [],
  negSorted: [],
  instructionObj: {},
  targetArray: [],
  isRightBelowThreshold: false,
  isLeftBelowThreshold: false,
  currentRightIteration: 0,
  currentLeftIteration: 0,
  isTargetArrayFilled: false,
  triggerMobileThinMoveTopModal: false,
  mobileThinFontSize: 2,
  mobileThinViewSize: 68,
  mobilePresortFontSize: 2,
  mobilePresortViewSize: 42,

  setMobilePresortStatementCount: (value) => {
    set(() => ({ mobilePresortStatementCount: value }));
  },
  setMobilePresortViewSize: (value) => {
    set(() => ({ mobilePresortViewSize: value }));
  },
  setMobilePresortFontSize: (value) => {
    set(() => ({ mobilePresortFontSize: value }));
  },
  setMobileThinViewSize: (value) => {
    set(() => ({ mobileThinViewSize: value }));
  },
  setMobileThinFontSize: (value) => {
    set(() => ({ mobileThinFontSize: value }));
  },
  setTriggerMobileThinMoveTopModal: (bool) => {
    set(() => ({ triggerMobileThinMoveTopModal: bool }));
  },
  setIsTargetArrayFilled: (bool) => {
    set(() => ({ isTargetArrayFilled: bool }));
  },
  setCurrentLeftIteration: (value) => {
    set(() => ({ currentLeftIteration: value }));
  },
  setCurrentRightIteration: (value) => {
    set(() => ({ currentRightIteration: value }));
  },
  setIsLeftBelowThreshold: (bool) => {
    set(() => ({ isLeftBelowThreshold: bool }));
  },
  setIsRightBelowThreshold: (bool) => {
    set(() => ({ isRightBelowThreshold: bool }));
  },
  setTargetArray: (targetArray) => {
    set(() => ({ targetArray: targetArray }));
  },
  setInstructionObj: (instructionObj) => {
    set(() => ({ instructionObj: instructionObj }));
  },
  setPosSorted: (posSorted) => {
    set(() => ({ posSorted: posSorted }));
  },
  setNegSorted: (negSorted) => {
    set(() => ({ negSorted: negSorted }));
  },
  setCurrentSelectMaxValue: (value) => {
    set(() => ({ currentSelectMaxValue: value }));
  },
  setIsLeftSideFinished: (bool) => {
    set(() => ({ isLeftSideFinished: bool }));
  },
  setIsRightSideFinished: (bool) => {
    set(() => ({ isRightSideFinished: bool }));
  },
  setTriggerConfirmationFinishedModal: (bool) => {
    set(() => ({ triggerConfirmationModal: bool }));
  },
  setIsConfirmationFinished: (bool) => {
    set(() => ({ isConfirmationFinished: bool }));
  },
  setTriggerThinningPreventNavModal: (bool) => {
    set(() => ({ triggerThinningPreventNavModal: bool }));
  },
  setIsThinningFinished: (bool) => {
    set(() => ({ isThinningFinished: bool }));
  },
  setPreviousColInfo: (colInfo) => {
    set(() => ({ previousColInfo: colInfo }));
  },
  setShowConfirmButton: (bool) => {
    set(() => ({ showConfirmButton: bool }));
  },
  setThinningSide: (inputValue) => {
    set(() => ({ thinningSide: inputValue }));
  },
});

export default createThinningSlice;
