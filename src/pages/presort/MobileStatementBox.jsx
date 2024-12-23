import styled from "styled-components";
import useStore from "../../globalState/useStore";

const getMobilePresortFontSize = (state) => state.mobilePresortFontSize;

const MobileStatementBox = (props) => {
  const mobilePresortFontSize = useStore(getMobilePresortFontSize);

  let statement = props.statement || "Assignment Complete";
  console.log("statement", statement);

  if (statement === null || statement === undefined) {
    statement = "Assignment Complete";
  }

  return <Container fontSize={mobilePresortFontSize}>{statement}</Container>;
};

export default MobileStatementBox;

const Container = styled.div`
  display: flex;
  align-self: center;
  justify-self: center;
  background-color: #e5e5e5;
  width: 80vw;
  height: fit-content;
  min-height: 14vh;
  font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }};
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  text-align: center;
  padding: 15px 10px 15px 10px;
  border: 1px solid black;
`;
