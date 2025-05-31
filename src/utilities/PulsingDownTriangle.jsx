import styled, { keyframes } from "styled-components";

// const pulse = keyframes`
//   0% { transform: scale(1) translateY(0); opacity: 1; }
//   50% { transform: scale(1.2) translateY(1px); opacity: 0.7; }
//   100% { transform: scale(1) translateY(0); opacity: 1; }
// `;

const shift = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(6px); }
  100% { transform: translateY(0); }
`;

const Triangle = styled.div`
  width: 0;
  height: 0;
  margin: 0 auto;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-top: 32px solid rgba(241, 194, 50, 0.8);
  animation: ${shift} 1.2s infinite;
`;

const PulsingDownTriangle = (props) => {
  if (props.atBottom === true) {
    return null; // Do not render the triangle if at the bottom
  }
  // If not at the bottom, render the pulsing triangle
  return <Triangle {...props} />;
};

export default PulsingDownTriangle;
