// components/SortTitleBar.jsx
import styled from "styled-components";
import HelpSymbol from "../../../assets/helpSymbol.svg?react";

const SortTitleBar = ({ background, conditionsOfInstruction, onHelpClick }) => {
  return (
    <TitleBarContainer background={background}>
      {conditionsOfInstruction}
      <HelpContainer onClick={onHelpClick}>
        <HelpSymbol />
      </HelpContainer>
    </TitleBarContainer>
  );
};

export default SortTitleBar;

const TitleBarContainer = styled.div`
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
