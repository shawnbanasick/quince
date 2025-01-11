import styled from "styled-components";

const SelectionNumberDisplay = (props) => {
  let selected = props.selected || 0;
  let required = props.required || 0;
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
  padding: 0.25em 0.5em;
  border-radius: 5px;
  border: 0.5px solid #d3d3d3;
  user-select: none;
  font-size: 1.2em;
  color: ${(props) => {
    return props.theme.mobileText;
  }};

  p {
    font-size: 1.2rem;
    color: ${(props) => {
      return props.theme.mobileText;
    }};
    font-weight: normal;
  }
  background-color: ${(props) => {
    if (props.selected === props.required && props.selected > 0) {
      return "#BCF0DA";
    } else if (props.selected > props.required) {
      return "#FFC5D3";
    } else {
      return "white";
    }
  }};
`;
