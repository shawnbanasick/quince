import styled from "styled-components";

const MobileValueButton = (props) => {
  return (
    <Container
      color={props.color}
      value={props.value}
      text={props.text}
      onTouchStart={props.onClick}
    >
      <h1>{props.text}</h1>
    </Container>
  );
};

export default MobileValueButton;

const Container = styled.div`
  display: flex;
  background-color: ${(props) => props.color};
  width: 80vw;
  height: 8vw;
  font-size: 1.6vh;
  font-weight: normal;
  padding-top: 2px;
  padding-bottom: 1px;
  padding-right: 0px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  outline: 1px solid darkgray;
  border-radius: 1.5px;
  user-select: none;
  &:active {
    background-color: orange;
    outline: 3px solid darkgray;
  }
`;
