const createThinningSlice = (set, get) => ({
  thinningSide: "rightSide",
  showConfirmButton: true,

  setShowConfirmButton: (bool) => {
    set(() => ({ showConfirmButton: bool }));
  },
  setThinningSide: (inputValue) => {
    set(() => ({ thinningSide: inputValue }));
  },
});

export default createThinningSlice;
