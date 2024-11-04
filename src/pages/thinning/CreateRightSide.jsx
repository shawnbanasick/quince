import styled from "styled-components";

const CreateRightSide = (rightNum, agreeMostText) => {
  return (
    <Instructions>
      {agreeMostText}
      <br />
      <br />
      <InstructionNum>
        <MostAgreeText>
          Number of Statements to Select: {rightNum}
        </MostAgreeText>
      </InstructionNum>
    </Instructions>
  );
};

export default CreateRightSide;

const Instructions = styled.div`
  font-size: 2.2vw;
  font-weight: normal;
  text-align: center;
  color: black;
`;

const MostAgreeText = styled.span`
  background-color: #ccffcc;
  padding: 2px;
  font-style: italic;
`;

const InstructionNum = styled.span`
  font-weight: bold;
`;
