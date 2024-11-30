import styled from "styled-components";

const boxes = (props) => {
  //   console.log("props", JSON.stringify(props, null, 2));
  const tiles = props.array.map((item) => {
    return (
      <Box
        key={item.id}
        id={item.id}
        selected={item.selected}
        selectedPos={item.selectedPos}
        selectedNeg={item.selectedNeg}
        data-side={props.side}
        data-max={props.colMax}
        data-targetcol={props.targetcol}
        side={props.side}
        onClick={props.handleClick}
      >
        {item.statement}
      </Box>
    );
  });
  return tiles;
};

export default boxes;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 170px;
  height: 150px;
  padding: 10px;
  overflow: hidden;
  margin: 10px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: ${(props) =>
    props.selectedPos && props.side === "rightSide"
      ? "#ccffcc"
      : props.selectedNeg && props.side === "leftSide"
      ? "#ffe0e0"
      : "white"};

  color: black;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease all;

  &:hover {
    background-color: ${(props) =>
      props.side === "rightSide" ? "#ccffcc" : "#ffe0e0"};
  }
`;
