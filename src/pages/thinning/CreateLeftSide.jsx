import styled from "styled-components";

const CreateLeftSide = (leftNum, agreeLeastText) => {
  // set text element
  return (
    <Instructions>
      {agreeLeastText}
      <br />
      <br />
      <InstructionNum>
        <LeastAgreeText>
          Number of Statements to Select: {leftNum}
        </LeastAgreeText>
      </InstructionNum>
    </Instructions>
  );
};

export default CreateLeftSide;

const InstructionNum = styled.span`
  font-weight: bold;
`;

const LeastAgreeText = styled.span`
  background-color: #ffe0e0;
  padding: 2px;
  font-style: italic;
`;

const Instructions = styled.div`
  font-size: 2.2vw;
  font-weight: normal;
  text-align: center;
  color: black;
`;
