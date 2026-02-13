import React from "react";
import styled from "styled-components";

class NonExistentPage extends React.Component {
  render() {
    return (
      <NoPageFound>
        {" "}
        <h1>404</h1> <p>Page doesn&apos;t exist</p>
      </NoPageFound>
    );
  }
}
export default NonExistentPage;

const NoPageFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
