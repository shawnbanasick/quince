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
