import { useEffect, useRef } from "react";
import styled from "styled-components";
import useLocalStorage from "../../utilities/useLocalStorage";

// Debounce function with a cancel() method so pending timers can be
// cleared explicitly (e.g. on unmount) instead of firing after the
// component that scheduled them is gone.
const debounce = (func, delay) => {
  let timeoutId;

  const debounced = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
};

const DebouncedTextarea = ({
  onChange,
  delay = 50,
  statementId,
  sortValue,
  commentId,
  side,
  minWordCountNumber,
  highlight,
  highlightObject,
  required,
  placeholder,
  id,
  ...rest
}) => {
  const [value, setValue] = useLocalStorage(id, "");

  // Keep onChange/delay available to the debounced function without
  // having to recreate that function (and lose its pending timer) on
  // every render.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Create the debounced function exactly once for this component
  // instance, and cancel any pending call on unmount.
  const debouncedOnChangeRef = useRef(null);
  if (debouncedOnChangeRef.current === null) {
    debouncedOnChangeRef.current = debounce((...args) => {
      onChangeRef.current(...args);
    }, delay);
  }

  useEffect(() => {
    return () => {
      debouncedOnChangeRef.current.cancel();
    };
  }, []);

  // Only schedule a debounced onChange when the actual value changes,
  // not on every render.
  useEffect(() => {
    debouncedOnChangeRef.current({
      target: {
        value,
        statementId,
        minWordCountNumber,
        highlight,
        id,
        sortValue,
        commentId,
        side,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <InternalTextArea
      value={value}
      placeholder={placeholder}
      data-id={statementId}
      onChange={handleChange}
      minWordCountNumber={minWordCountNumber}
      highlighting={highlight}
      highlightObject={highlightObject}
      required={required}
      statementId={statementId}
      {...rest}
    />
  );
};

export default DebouncedTextarea;

const InternalTextArea = styled.textarea.withConfig({
  shouldForwardProp: (prop) =>
    ![
      "minWordCountNumber",
      "highlighting",
      "highlightObject",
      "statementId",
    ].includes(prop),
})`
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
  background-color: ${(props) =>
    props.highlightObject[props.statementId] === true
      ? "whitesmoke"
      : props.required && props.highlighting
        ? "rgba(253, 224, 71, .5)"
        : "whitesmoke"};
`;
