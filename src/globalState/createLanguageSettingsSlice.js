const createLanguageSettingsSlice = (set) => ({
  langObj: {},

  setLangObj: (langObjInput) => {
    set(() => ({ langObj: langObjInput }));
  },
});

export default createLanguageSettingsSlice;
