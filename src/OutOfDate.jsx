import styled from "styled-components";

const StyledOutOfDateBanner = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  background-color: lightpink;
  border-color: #ffeaa7;
  color: black;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const DismissButton = styled.button`
  background-color: white;
  border: none;
  color: black;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  border-radius: 0.25rem;
  &:hover {
    background-color: #ffd700;
  }
`;

const OutOfDateWarningBanner = ({ files, onDismiss }) => {
  if (files.length === 0) return null;

  return (
    <StyledOutOfDateBanner role="alert">
      <h1>Setup Error!</h1>
      <p>
        The following settings file{files.length > 1 ? "s are" : " is"}{" "}
        out-of-date:<b> {files.map((f) => f.label).join(", ")}. </b>
        <br />
        <br />
        Please re-import into the Quince Configurator to update to the latest
        version.
      </p>
      <DismissButton onClick={onDismiss}>Dismiss</DismissButton>
    </StyledOutOfDateBanner>
  );
};

export default OutOfDateWarningBanner;
