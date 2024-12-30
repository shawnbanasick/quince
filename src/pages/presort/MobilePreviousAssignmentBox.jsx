import styled from "styled-components";
import useStore from "../../globalState/useStore";
import { v4 as uuid } from "uuid";
import RedoArrow from "../../assets/redoArrow.svg?react";

const getMobilePresortFontSize = (state) => state.mobilePresortFontSize;
const getMobilePresortViewSize = (state) => state.mobilePresortViewSize;

const MobilePreviousAssignmentBox = (props) => {
  let mobilePresortFontSize = useStore(getMobilePresortFontSize);
  const persistedMobilePresortFontSize = JSON.parse(
    localStorage.getItem("mobileFontSizeObject")
  ).presort;
  const persistedMobilePresortViewSize = JSON.parse(
    localStorage.getItem("mobileViewSizeObject")
  ).presort;
  const mobilePresortViewSize = useStore(getMobilePresortViewSize);

  let assessedStatements = props.statements.map((item) => {
    return (
      <InternalDiv
        key={uuid()}
        fontSize={
          mobilePresortFontSize === +persistedMobilePresortFontSize
            ? mobilePresortFontSize
            : persistedMobilePresortFontSize
        }
        color={item.color}
      >
        <div>
          <ArrowContainer
            data-id={item.id}
            data-statement={item.statement}
            onClick={props.onClick}
          >
            <RedoArrow
              style={{
                float: "left",
                height: "14px",
                width: "14px",
                pointerEvents: "none",
              }}
            />
          </ArrowContainer>
          {item.statement}
        </div>
      </InternalDiv>
    );
  });

  return (
    <Container
      viewSize={
        mobilePresortViewSize === +persistedMobilePresortViewSize
          ? mobilePresortViewSize
          : persistedMobilePresortViewSize
      }
    >
      {assessedStatements}
    </Container>
  );
};

export default MobilePreviousAssignmentBox;

const Container = styled.div`
  display: flex;
  align-self: top;
  justify-self: center;
  margin-top: 10px;
  flex-direction: row;
  flex-wrap: wrap;

  background-color: #e5e5e5;
  width: 90vw;
  height: ${(props) => `${props.viewSize}vh`};
  font-size: 1.1vh;
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
  font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }};
  border-radius: 3px;
  text-align: center;
  outline: 1px solid black;
  padding: 5px;
`;

const ArrowContainer = styled.div`
  float: left;
  width: 14px;
  height: 14px;
  margin-right: 5px;
`;
