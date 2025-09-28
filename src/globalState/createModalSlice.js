const createModalSlice = (set) => ({
  m_hasScrolledBottom: false,

  setM_hasScrolledBottom: (value) => {
    set(() => ({ m_hasScrolledBottom: value }));
  },
});

export default createModalSlice;
