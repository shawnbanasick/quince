const createSubmitSlice = (set) => ({
  disableRefreshCheck: false,
  displaySubmitFallback: false,
  displayGoodbyeMessage: false,
  triggerLocalSubmitSuccessModal: false,
  triggerTransmissionOKModal: false,
  triggerTransmissionFailModal: false,
  submitFailNumber: 0,
  transmittingData: false,
  checkInternetConnection: false,
  displayBelowButtonText: false,

  setDisplayBelowButtonText: (input) => {
    set(() => ({ displayBelowButtonText: input }));
  },
  setDisableRefreshCheck: (input) => {
    set(() => ({ disableRefreshCheck: input }));
  },
  setCheckInternetConnection: (input) => {
    set(() => ({ checkInternetConnection: input }));
  },
  setTransmittingData: (input) => {
    set(() => ({ transmittingData: input }));
  },
  setTriggerTransmissionFailModal: (input) => {
    set(() => ({ triggerTransmissionFailModal: input }));
  },
  setTriggerTransmissionOKModal: (input) => {
    set(() => ({ triggerTransmissionOKModal: input }));
  },
  setTriggerLocalSubmitSuccessModal: (input) => {
    set(() => ({ triggerLocalSubmitSuccessModal: input }));
  },
  setDisplaySubmitFallback: (input) => {
    set(() => ({ displaySubmitFallback: input }));
  },
  setDisplayGoodbyeMessage: (inputValue) => {
    set(() => ({ displayGoodbyeMessage: inputValue }));
  },
});

export default createSubmitSlice;
