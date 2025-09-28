// components/ExpandViewMessage.jsx
import styled from "styled-components";

const ExpandViewMessage = ({ text }) => {
  return <BoxSizeMessage>{text}</BoxSizeMessage>;
};

export default ExpandViewMessage;

const BoxSizeMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5vh;
  font-weight: bold;
  margin-top: 10px;
  width: 80vw;
`;
