import { useState, useEffect } from "react";
import styled from "styled-components";
import useLocalStorage from "../../utilities/useLocalStorage";

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const DebouncedTextarea = ({
  onChange,
  delay = 300,
  id,
  placeholder,
  required,
}) => {
  const [value, setValue] = useLocalStorage(id, "");

  // Debounced onChange handler
  const debouncedOnChange = debounce(onChange, delay);

  useEffect(() => {
    debouncedOnChange(value);
  }, [value, debouncedOnChange]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <InternalTextArea
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      required={required}
    />
  );
};

export default DebouncedTextarea;

const InternalTextArea = styled.textarea`
  box-sizing: border-box;
  padding: 5px;
  min-height: 12vh;
  width: 80vw;
  outline: 1px solid black;
  border: none;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  field-sizing: content;
  background-color: ${(props) =>
    props.value.length > 0
      ? "whitesmoke"
      : props.required
      ? "rgba(253, 224, 71, .5)"
      : "whitesmoke"};
`;
