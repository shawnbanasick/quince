import styled from "styled-components";
import { withRouter } from "react-router";

const PostsortBackButton = (props) => {
  const {
    history,
    // location,
    // match,
    // staticContext,
    to,
    onClick,
    // ⬆ filtering out props that `button` doesn’t know what to do with.
    ...rest
  } = props;

  return (
    <BackButton
      {...rest} // `children` is just another prop!
      onClick={(event) => {
        onClick && onClick(event);
        history.push(to);
      }}
      tabindex="0"
    />
  );
};
export default withRouter(PostsortBackButton);

const BackButton = styled.button`
  border-color: #2e6da4;
  color: white;
  font-size: 0.8em;
  font-weight: bold;
  padding: 0.5em;
  border-radius: 3px;
  text-decoration: none;
  width: auto;
  justify-self: right;
  margin-right: 35px;
  display: flex;
  align-items: center;
  user-select: none;
  justify-content: center;
  background-color: ${({ theme, active }) => (active ? theme.secondary : theme.primary)};

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.focus};
  }
`;
