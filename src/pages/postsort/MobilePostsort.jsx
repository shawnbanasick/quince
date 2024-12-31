import { useEffect, useMemo } from "react";
import styled from "styled-components";
import useStore from "../../globalState/useStore";
import useSettingsStore from "../../globalState/useSettingsStore";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import HelpSymbol from "../../assets/helpSymbol.svg?react";
import useLocalStorage from "../../utilities/useLocalStorage";
import { v4 as uuid } from "uuid";

const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetProgressScore = (state) => state.setProgressScore;
const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getMapObj = (state) => state.mapObj;

const MobileSort = () => {
  const setCurrentPage = useStore(getSetCurrentPage);
  const setProgressScore = useStore(getSetProgressScore);
  const langObj = useSettingsStore(getLangObj);
  const mapObj = useSettingsStore(getMapObj);
  const configObj = useSettingsStore(getConfigObj);

  // ***************************
  // *** TEXT LOCALIZATION *******************
  // ***************************
  const titleText = ReactHtmlParser(decodeHTML(langObj.postsortHeader)) || "";
  const agree = ReactHtmlParser(decodeHTML(langObj.postsortAgreement)) || "";
  const disagree =
    ReactHtmlParser(decodeHTML(langObj.postsortDisagreement)) || "";
  const placeholder = langObj.placeholder;

  // ***************************
  // *** STATE *******************
  // ***************************
  // const [showHelpModal, setShowHelpModal] = useLocalStorage(
  //   "showHelpModal",
  //   false
  // );

  // ***************************
  // *** HOOKS *******************
  // ***************************
  useEffect(() => {
    let startTime = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("postsort");
      localStorage.setItem("currentPage", "postsort");
      await setProgressScore(20);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTime, "postsortPage", "postsortPage");
    };
  }, [setCurrentPage, setProgressScore]);

  const cardsArray = useMemo(() => {
    const cards2 = JSON.parse(localStorage.getItem("sortArray1"));
    const cards = [...cards2];
    const showSecondPosColumn = configObj.showSecondPosColumn;
    const showSecondNegColumn = configObj.showSecondNegColumn;
    const qSortPattern = [...mapObj.qSortPattern];

    let posStatementsNum = qSortPattern[0];
    let negStatementsNum = qSortPattern[qSortPattern.length - 1];
    const posStatementsNum2 = qSortPattern[1];
    const negStatementsNum2 = qSortPattern[qSortPattern.length - 2];
    if (showSecondPosColumn === true || showSecondPosColumn === "true") {
      posStatementsNum = +posStatementsNum + +posStatementsNum2;
    }
    if (showSecondNegColumn === true || showSecondNegColumn === "true") {
      negStatementsNum = +negStatementsNum + +negStatementsNum2;
    }

    const posStatements = cards.slice(0, posStatementsNum);
    const negStatements = cards.slice(-negStatementsNum);

    return [posStatements, negStatements];
  }, [mapObj.qSortPattern, configObj]);

  console.log(JSON.stringify(cardsArray));

  // ***************************
  // *** ELEMENTS *******************
  // ***************************

  let posStatements = cardsArray[0].map((card, index) => {
    return (
      <div key={uuid()}>
        <InternalDiv
          fontSize={"2"}
          color="#BCF0DA"
          card={card}
          index={index}
          placeholder={placeholder}
          agree={agree}
          disagree={disagree}
        >
          {card.statement}
        </InternalDiv>
        <textarea
          placeholder="Add Comments Here"
          style={{
            padding: "5px",
            height: "75px",
            width: "80vw",
            outline: "1px solid black",
            border: "0px",
          }}
        ></textarea>
      </div>
    );
  });

  let negStatements = cardsArray[1].map((card, index) => {
    return (
      <div key={uuid()}>
        <InternalDiv
          card={card}
          color="#FBD5D5"
          index={index}
          placeholder={placeholder}
          agree={agree}
          disagree={disagree}
        >
          {card.statement}
        </InternalDiv>
        <textarea
          placeholder="Add Comments Here"
          style={{
            padding: "5px",
            height: "75px",
            width: "80vw",
            outline: "1px solid black",
            border: "0px",
          }}
        ></textarea>
      </div>
    );
  });

  return (
    <div>
      <SortTitleBar background={configObj.headerBarColor}>
        {/* {conditionsOfInstruction} */}
        Mobile Postsort
        <HelpContainer onClick={() => alert("Help")}>
          <HelpSymbol />
        </HelpContainer>
      </SortTitleBar>
      <Container viewSize={"80"} fontSize={"2"}>
        {posStatements}
        {negStatements}
      </Container>
    </div>
  );
};

export default MobileSort;

const SortTitleBar = styled.div`
  display: flex;
  width: 100vw;
  padding-left: 10px;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 30px;
  background-color: ${(props) => props.background};
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 4.5vw;
  user-select: none;
`;

const HelpContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 5px;
  align-items: center;
  padding-bottom: 5px;
  width: 20px;
  height: 20px;
  color: black;
  font-size: 2.5vh;
  font-weight: bold;
  user-select: none;
`;

const Container = styled.div`
  display: flex;
  align-self: top;
  justify-self: center;
  margin-top: 10px;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }};
  background-color: #e5e5e5;
  width: 90vw;
  height: ${(props) => `${props.viewSize}vh`};
  align-items: center;
  gap: 15px;

  justify-content: center;
  border-radius: 3px;
  text-align: center;
  overflow-x: none;
  overflow-y: auto;
  padding-bottom: 10px;
  padding-top: 10px;
  border-radius: 5px;
  border: 1px solid black;
`;

const InternalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  width: 80vw;
  min-height: 8vh;
  /* font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }}; */
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  text-align: center;
  outline: 1px solid black;
  padding: 5px;
`;
