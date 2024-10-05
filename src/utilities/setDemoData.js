const setDemoData = () => {
  const demoData = {
    vCols: {
      columnN4: [],
      columnN3: [],
      columnN2: [],
      columnN1: [],
      column0: [],
      column1: [],
      column2: [],
      column3: [],
      column4: [],
    },
    statementList: [
      {
        id: "s1",
        statementNum: 1,
        divColor: "isPositiveStatement",
        statement:
          "1. 高水準の英語力は私のいる環境では価値のあ る特性と見なされている。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s2",
        statementNum: 2,
        divColor: "isPositiveStatement",
        statement:
          "2. 私は、英語のコミュニケーション能力を持つこ とは重要だと強く信じている。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s3",
        statementNum: 3,
        divColor: "isPositiveStatement",
        statement: "3. 私は、英語が必須科目なので勉強している。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s4",
        statementNum: 4,
        divColor: "isPositiveStatement",
        statement:
          "4. 一生懸命勉強すれば、英語を流暢に話せるようになると思う。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s5",
        statementNum: 5,
        divColor: "isPositiveStatement",
        statement:
          "5. 私は、将来字幕なしで英語のテレビ番組や映 画を見れるようになると思う。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s6",
        statementNum: 6,
        divColor: "isPositiveStatement",
        statement:
          "6.  私は、将来辞書を使わずに英語で新聞を読め るようになると思う。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s7",
        statementNum: 7,
        divColor: "isPositiveStatement",
        statement:
          "7. 私は、将来海外の知人達と英語で気楽に話せ るようになると思う。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s8",
        statementNum: 8,
        divColor: "isUncertainStatement",
        statement: "8. 私は、将来英語を話せることは社交の場で役 立つと思う。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s9",
        statementNum: 9,
        divColor: "isUncertainStatement",
        statement: "9. 私は、将来英語を話せることは職場で役立つ と思う。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s10",
        statementNum: 10,
        divColor: "isUncertainStatement",
        statement:
          "10. 私は、将来どうのように英語を使用するかにつ いて明確な見通しはない。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s11",
        statementNum: 11,
        divColor: "isUncertainStatement",
        statement: "11. 私はよく独りで英語を勉強する。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s12",
        statementNum: 12,
        divColor: "isUncertainStatement",
        statement: "12. 私は英語を学習する理由を明確に理解して いる。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s13",
        statementNum: 13,
        divColor: "isUncertainStatement",
        statement:
          "13. 他の人達が英語を話しているのを見ると、会 話に入れない気がする。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s14",
        statementNum: 14,
        divColor: "isUncertainStatement",
        statement:
          "14. 私は、普段から外国人と話すことが求められる 仕事をするだろう。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s15",
        statementNum: 15,
        divColor: "isNegativeStatement",
        statement:
          "15. 私は、日本人との会話のみを必要とする仕事 をするだろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s16",
        statementNum: 16,
        divColor: "isNegativeStatement",
        statement: "16. 私は仕事のために海外に行くだろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s17",
        statementNum: 17,
        divColor: "isNegativeStatement",
        statement:
          "17. 私は、外国人と時間を過ごす機会のある仕事 に就くだろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s18",
        statementNum: 18,
        divColor: "isNegativeStatement",
        statement: "18. 私は余暇に海外旅行をするだろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s19",
        statementNum: 19,
        divColor: "isPositiveStatement",
        statement: "19. 私は英語を趣味として勉強するだろう。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s20",
        statementNum: 20,
        divColor: "isPositiveStatement",
        statement: "20. 私は、将来英語をそもそも使用するとは思わ ない。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s21",
        statementNum: 21,
        divColor: "isPositiveStatement",
        statement: "21. 私は、他国の文化を学ぶことにあまり興味は ない。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s22",
        statementNum: 22,
        divColor: "isUncertainStatement",
        statement: "22. 私は、将来自分が海外に知人を持つとは考え られない。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s23",
        statementNum: 23,
        divColor: "isNegativeStatement",
        statement: "23. 将来、私は英語を決して使用することはない だろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s24",
        statementNum: 24,
        divColor: "isPositiveStatement",
        statement:
          "24. 私は、英語の授業以外で英語を使用する機会 を持ったことはあまりない。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s25",
        statementNum: 25,
        divColor: "isUncertainStatement",
        statement: "25. 私は、卒業後は何を専門的に仕事にするか分からない。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s26",
        statementNum: 26,
        divColor: "isNegativeStatement",
        statement: "26. 私は、将来海外に住んでみたい。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s27",
        statementNum: 27,
        divColor: "isPositiveStatement",
        statement:
          "27. 私は、将来の仕事について考える時はいつも、 英語を使用している自分の姿を想像する。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s28",
        statementNum: 28,
        divColor: "isNegativeStatement",
        statement: "28. 私は、将来英語を有効活用することができる だろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s29",
        statementNum: 29,
        divColor: "isNegativeStatement",
        statement: "29. 私は、自分の意見を英語で表現できるように なりたい。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s30",
        statementNum: 30,
        divColor: "isNegativeStatement",
        statement:
          "30.  私のいる環境（社会）では英語に堪能な人々は 尊敬される。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
    ],
    statements: [
      {
        id: "s1",
        statementNum: 1,
        divColor: "isPositiveStatement",
        statement:
          "1. 高水準の英語力は私のいる環境では価値のあ る特性と見なされている。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s2",
        statementNum: 2,
        divColor: "isPositiveStatement",
        statement:
          "2. 私は、英語のコミュニケーション能力を持つこ とは重要だと強く信じている。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s3",
        statementNum: 3,
        divColor: "isPositiveStatement",
        statement: "3. 私は、英語が必須科目なので勉強している。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s4",
        statementNum: 4,
        divColor: "isPositiveStatement",
        statement:
          "4. 一生懸命勉強すれば、英語を流暢に話せるようになると思う。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s5",
        statementNum: 5,
        divColor: "isPositiveStatement",
        statement:
          "5. 私は、将来字幕なしで英語のテレビ番組や映 画を見れるようになると思う。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s6",
        statementNum: 6,
        divColor: "isPositiveStatement",
        statement:
          "6.  私は、将来辞書を使わずに英語で新聞を読め るようになると思う。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s7",
        statementNum: 7,
        divColor: "isPositiveStatement",
        statement:
          "7. 私は、将来海外の知人達と英語で気楽に話せ るようになると思う。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s8",
        statementNum: 8,
        divColor: "isUncertainStatement",
        statement: "8. 私は、将来英語を話せることは社交の場で役 立つと思う。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s9",
        statementNum: 9,
        divColor: "isUncertainStatement",
        statement: "9. 私は、将来英語を話せることは職場で役立つ と思う。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s10",
        statementNum: 10,
        divColor: "isUncertainStatement",
        statement:
          "10. 私は、将来どうのように英語を使用するかにつ いて明確な見通しはない。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s11",
        statementNum: 11,
        divColor: "isUncertainStatement",
        statement: "11. 私はよく独りで英語を勉強する。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s12",
        statementNum: 12,
        divColor: "isUncertainStatement",
        statement: "12. 私は英語を学習する理由を明確に理解して いる。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s13",
        statementNum: 13,
        divColor: "isUncertainStatement",
        statement:
          "13. 他の人達が英語を話しているのを見ると、会 話に入れない気がする。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s14",
        statementNum: 14,
        divColor: "isUncertainStatement",
        statement:
          "14. 私は、普段から外国人と話すことが求められる 仕事をするだろう。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s15",
        statementNum: 15,
        divColor: "isNegativeStatement",
        statement:
          "15. 私は、日本人との会話のみを必要とする仕事 をするだろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s16",
        statementNum: 16,
        divColor: "isNegativeStatement",
        statement: "16. 私は仕事のために海外に行くだろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s17",
        statementNum: 17,
        divColor: "isNegativeStatement",
        statement:
          "17. 私は、外国人と時間を過ごす機会のある仕事 に就くだろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s18",
        statementNum: 18,
        divColor: "isNegativeStatement",
        statement: "18. 私は余暇に海外旅行をするだろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s19",
        statementNum: 19,
        divColor: "isPositiveStatement",
        statement: "19. 私は英語を趣味として勉強するだろう。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s20",
        statementNum: 20,
        divColor: "isPositiveStatement",
        statement: "20. 私は、将来英語をそもそも使用するとは思わ ない。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s21",
        statementNum: 21,
        divColor: "isPositiveStatement",
        statement: "21. 私は、他国の文化を学ぶことにあまり興味は ない。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s22",
        statementNum: 22,
        divColor: "isUncertainStatement",
        statement: "22. 私は、将来自分が海外に知人を持つとは考え られない。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s23",
        statementNum: 23,
        divColor: "isNegativeStatement",
        statement: "23. 将来、私は英語を決して使用することはない だろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s24",
        statementNum: 24,
        divColor: "isPositiveStatement",
        statement:
          "24. 私は、英語の授業以外で英語を使用する機会 を持ったことはあまりない。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s25",
        statementNum: 25,
        divColor: "isUncertainStatement",
        statement: "25. 私は、卒業後は何を専門的に仕事にするか分からない。",
        cardColor: "yellowSortCard",
        pinkChecked: false,
        yellowChecked: true,
        greenChecked: false,
        sortValue: 222,
      },
      {
        id: "s26",
        statementNum: 26,
        divColor: "isNegativeStatement",
        statement: "26. 私は、将来海外に住んでみたい。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s27",
        statementNum: 27,
        divColor: "isPositiveStatement",
        statement:
          "27. 私は、将来の仕事について考える時はいつも、 英語を使用している自分の姿を想像する。",
        cardColor: "greenSortCard",
        sortValue: 111,
        greenChecked: true,
        pinkChecked: false,
        yellowChecked: false,
      },
      {
        id: "s28",
        statementNum: 28,
        divColor: "isNegativeStatement",
        statement: "28. 私は、将来英語を有効活用することができる だろう。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s29",
        statementNum: 29,
        divColor: "isNegativeStatement",
        statement: "29. 私は、自分の意見を英語で表現できるように なりたい。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
      {
        id: "s30",
        statementNum: 30,
        divColor: "isNegativeStatement",
        statement:
          "30.  私のいる環境（社会）では英語に堪能な人々は 尊敬される。",
        cardColor: "pinkSortCard",
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
        sortValue: 333,
      },
    ],
  };

  localStorage.setItem("columnStatements", JSON.stringify(demoData));
  return;
};

export default setDemoData;