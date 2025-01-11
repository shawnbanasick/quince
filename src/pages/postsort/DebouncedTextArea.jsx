import { useEffect } from "react";
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

const DebouncedTextarea = ({ onChange, delay = 300, ...props }) => {
  const [value, setValue] = useLocalStorage(props.id, "");

  // Debounced onChange handler
  const debouncedOnChange = debounce(onChange, delay);

  useEffect(() => {
    debouncedOnChange({ target: { value, ...props } });
  }, [value, debouncedOnChange, props]);

  const handleChange = (e) => {
    setValue(e.target.value);
    console.log(e.target.dataset);
    // e.target.dataset.id = props.statementId;
  };

  return (
    <InternalTextArea
      value={value}
      placeholder={props.placeholder}
      data-id={props.statementId}
      onChange={handleChange}
      highlighting={props.highlight}
      {...props}
    />
  );
};

export default DebouncedTextarea;

const InternalTextArea = styled.textarea`
  box-sizing: border-box;
  padding: 5px;
  min-height: 12vh;
  width: 80vw;
  outline: 1px solid #36454f;
  border: none;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  field-sizing: content;
  background-color: ${(props) =>
    props.value.length > 0
      ? "whitesmoke"
      : props.required && props.highlighting
      ? "rgba(253, 224, 71, .5)"
      : "whitesmoke"};
`;
