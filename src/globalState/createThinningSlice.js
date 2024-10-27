const createThinningSlice = (set, get) => ({
  thinningSide: "rightSide",
  showConfirmButton: true,
  previousColInfo: [],
  isThinningFinished: false,
  triggerThinningPreventNavModal: false,
  isConfirmationFinished: false,
  triggerConfirmationFinishedModal: false,

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
