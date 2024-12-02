import styled from "styled-components";

/* eslint react/prop-types: 0 */
const Instructions = (props) => {
  if (props.agree === true) {
    return (
      <InstructionsText>
        {props.part1}
        {props.part3}
        <br />
        <br />
        <MostAgreeText>
          {`Number of Statements to Select: ${props.maxNum}`}{" "}
        </MostAgreeText>
      </InstructionsText>
    );
  } else {
    return (
      <InstructionsText>
        {props.agreeLeastText}
        <br />
        <br />
        <LeastAgreeText>
          {`Number of Statements to Select: ${props.maxNum}`}{" "}
        </LeastAgreeText>
      </InstructionsText>
    );
  }
};

export default Instructions;

const InstructionsText = styled.div`
  font-size: 2.2vw;
  font-weight: normal;
  text-align: center;
  color: black;
  min-height: 200px;
`;

const MostAgreeText = styled.span`
  background-color: #ccffcc;
  padding: 2px;
  font-style: italic;
`;

const LeastAgreeText = styled.span`
  background-color: #ffe0e0;
  padding: 2px;
  font-style: italic;
`;
