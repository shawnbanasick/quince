import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";

const getLangObj = (state) => state.langObj;

const LogInSubmitButton = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  console.log(props);
  const loginSubmitButtonText = ReactHtmlParser(decodeHTML(langObj.loginSubmitButtonText)) || "";

  return (
    <StyledSubmitButton
      tabindex="0"
      type="submit"
      onClick={props.onClick}
      size={props.size} // "1.5em"}
      width={props.width} // "200px"}
      height={props.height} // "50px"}
    >
      {loginSubmitButtonText}
    </StyledSubmitButton>
  );
};
export default LogInSubmitButton;

const StyledSubmitButton = styled.button`
  border-color: #2e6da4;
  color: white;
  font-size: ${(props) => props.size}; // 1.5em;
  width: ${(props) => props.width}; // 200px;
  height: ${(props) => props.height}; // 50px;
  font-weight: bold;
  padding: 0.25em 1em;
  border-radius: 3px;
  text-decoration: none;
  justify-self: right;
  align-self: end;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, active }) => (active ? theme.secondary : theme.primary)};

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.focus};
  }
`;
