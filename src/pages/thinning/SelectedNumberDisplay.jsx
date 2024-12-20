import styled from "styled-components";

const SelectionNumberDisplay = (props) => {
  let selected = props.selected || 0;
  let required = props.required || 0;
  console.log(selected, required);
  return (
    <StyledSelectionNumberDisplay selected={selected} required={required}>
      <p>Selected: {`${selected} / ${required}`}</p>
    </StyledSelectionNumberDisplay>
  );
};

export default SelectionNumberDisplay;

const StyledSelectionNumberDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 34px;
  padding: 10px;
  /* padding-left: 10px; */
  border-radius: 5px;
  border: 0.5px solid #d3d3d3;
  p {
    font-size: 1.2rem;
    color: black;
    font-weight: bold;
  }
  background-color: ${(props) => {
    if (props.selected === props.required) {
      return "#BCF0DA";
    } else if (props.selected > props.required) {
      return "#FBD5D5";
    } else {
      return "white";
    }
  }};
`;
