const createSurveySlice = (set) => ({
  triggerSurveyModal: true,
  resultsSurvey: {},
  triggerSurveyPreventNavModal: false,
  checkRequiredQuestionsComplete: false,
  requiredAnswersObj: {},
  answersStorage: {},
  triggerMobileSurveyHelpModal: true,
  mobileSurveyViewSize: 72,

  setMobileSurveyViewSize: (inputValue) => {
    set(() => ({ mobileSurveyViewSize: inputValue }));
  },
  setTriggerMobileSurveyHelpModal: (inputValue) => {
    set(() => ({ triggerMobileSurveyHelpModal: inputValue }));
  },
  setAnswersStorage: (inputValue) => {
    set(() => ({ answersStorage: inputValue }));
  },
  setTriggerSurveyModal: (inputValue) => {
    set(() => ({ triggerSurveyModal: inputValue }));
  },
  setResultsSurvey: (inputValue) => {
    set(() => ({ resultsSurvey: inputValue }));
  },

  setTriggerSurveyPreventNavModal: (inputValue) => {
    set(() => ({ triggerSurveyPreventNavModal: inputValue }));
  },
  setCheckRequiredQuestionsComplete: (inputValue) => {
    set(() => ({ checkRequiredQuestionsComplete: inputValue }));
  },
  setRequiredAnswersObj: (inputValue) => {
    set(() => ({ requiredAnswersObj: inputValue }));
  },
});

export default createSurveySlice;
