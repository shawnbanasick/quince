import { useEffect, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import useSettingsStore from "../../globalState/useSettingsStore";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import finishThinningSorts from "./finishThinningSorts";
import Boxes from "./Boxes";
import MobileInstructions from "./MobileInstructions";
import moveSelectedNegCards from "./moveSelectedNegCards";
import moveSelectedPosCards from "./moveSelectedPosCards";
import uniq from "lodash/uniq";
import { v4 as uuid } from "uuid";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;

const MobileThinning = () => {
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);

  // Get language object values
  let initialInstructionPart1 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPart1)) || "";
  let initialInstructionPart3 =
    ReactHtmlParser(decodeHTML(langObj.initialInstructionPart3)) || "";
  let agreeLeastText =
    ReactHtmlParser(decodeHTML(langObj.agreeLeastText)) || "";
  let finalInstructionText =
    ReactHtmlParser(decodeHTML(langObj.finalInstructions)) || "";
  let agreeMostText = ReactHtmlParser(decodeHTML(langObj.agreeMostText)) || "";

  let mobilePresortResults = JSON.parse(
    localStorage.getItem("mobilePresortResults")
  );

  let sortRightArrays = JSON.parse(localStorage.getItem("sortRightArrays"));
  let colInfo = sortRightArrays?.[0];

  let [instructionText, setInstructionText] = useState({
    part1: "",
    part2: "",
    part3: "",
    agreeLeastText: "",
    agree: true,
    maxNum: 0,
  });

  useEffect(() => {
    setInstructionText({
      part1: initialInstructionPart1,
      part2: "",
      part3: initialInstructionPart3,
      agreeLeastText: "",
      agree: true,
      maxNum: colInfo?.[1],
    });

    return () => {};
  }, [colInfo, initialInstructionPart1, initialInstructionPart3]);

  let assessedStatements = mobilePresortResults.map((item) => {
    return (
      <InternalDiv key={uuid()} color={item.color}>
        {item.statement}
      </InternalDiv>
    );
  });

  return (
    <MainContainer>
      <SortTitleBar background={configObj.headerBarColor}>
        Refine Your Preferences
      </SortTitleBar>
      <InstructionsDiv>
        <MobileInstructions
          part1={instructionText.part1}
          part2={instructionText.part2}
          part3={instructionText.part3}
          agreeLeastText={instructionText.agreeLeastText}
          agree={instructionText.agree}
          maxNum={instructionText.maxNum}
        />
      </InstructionsDiv>
      <StatementsContainer>{assessedStatements}</StatementsContainer>
    </MainContainer>
  );
};

export default MobileThinning;

const StatementsContainer = styled.div`
  display: flex;
  align-self: top;
  justify-self: center;
  margin-top: 100px;
  flex-direction: row;
  flex-wrap: wrap;

  background-color: #e5e5e5;
  width: 90vw;
  height: 62vh;
  /* font-size: 1.1vh; */
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
  height: 12vh;
  font-size: 2vh;
  border-radius: 3px;
  text-align: center;
  outline: 1px solid black;
  padding: 5px;
`;

const SortTitleBar = styled.div`
  width: 100vw;
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 50px;
  background-color: ${(props) => props.background};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 28px;
  position: fixed;
  top: 0;
`;

const InstructionsDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 2vw;
  margin-top: 100px;
  margin-bottom: 10px;
  font-size: 3.2vw;
  font-weight: normal;
  text-align: center;
  color: black;
  min-height: 200px;
  /* border: 2px solid red; */
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 98vw;
  height: 90vh;
  outline: 2px solid red;
`;
