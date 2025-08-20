// components/OrientationMessage.jsx
import styled from "styled-components";

const OrientationMessage = ({ text }) => {
  return (
    <OrientationDiv>
      <h1>{text}</h1>
    </OrientationDiv>
  );
};

export default OrientationMessage;

const OrientationDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
