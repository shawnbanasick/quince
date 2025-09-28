import styled, { keyframes } from "styled-components";

// Enhanced animation with multiple effects
const pulseDown = keyframes`
  0% { 
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% { 
    transform: translateY(8px) scale(1.05);
    opacity: 1;
  }
  100% { 
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
`;

// Subtle glow animation for enhanced visual appeal
const glow = keyframes`
  0%, 100% { 
    filter: drop-shadow(0 2px 6px rgba(241, 194, 50, 0.3));
  }
  50% { 
    filter: drop-shadow(0 4px 12px rgba(241, 194, 50, 0.6));
  }
`;

// Fade in animation for smooth appearance
const fadeIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(-10px) scale(0.8);
  }
  to { 
    opacity: 0.8;
    transform: translateY(0) scale(1);
  }
`;

// Container for better positioning and hover effects
const TriangleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin: 0 auto;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // Enhanced hover effects
  &:hover {
    transform: ${(props) => (props.clickable ? "translateY(-2px)" : "none")};
  }

  // Smooth entrance animation
  animation: ${fadeIn} 0.6s ease-out;

  // Accessibility improvements
  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 4px;
    border-radius: 8px;
  }

  // Reduced motion support
  @media (prefers-reduced-motion: reduce) {
    animation: none;

    & > div {
      animation: none;
    }
  }
`;

// Enhanced triangle with modern styling
const Triangle = styled.div`
  width: 0;
  height: 0;
  position: relative;

  // Modern triangle using clip-path (fallback to borders)
  &::before {
    content: "";
    position: absolute;
    top: -16px;
    left: -20px;
    width: 40px;
    height: 32px;
    background: linear-gradient(135deg, #83cafe 0%, rgba(53, 122, 183, 0.8) 100%);
    clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
    border-radius: 2px 2px 0 0;
    transition: all 0.3s ease;
  }

  // Fallback for older browsers
  border-left: ${(props) => props.size || 20}px solid transparent;
  border-right: ${(props) => props.size || 20}px solid transparent;
  border-top: ${(props) => (props.size || 20) * 1.6}px solid
    ${(props) => props.color || "rgba(241, 194, 50, 0.8)"};

  // Enhanced animations
  animation: ${pulseDown} ${(props) => props.duration || 1.4}s infinite ease-in-out,
    ${glow} ${(props) => (props.duration || 1.4) * 2}s infinite ease-in-out;

  // Custom animation delay for staggered effects
  animation-delay: ${(props) => props.delay || 0}s;

  // Hover effects
  ${TriangleContainer}:hover & {
    animation-duration: ${(props) => (props.duration || 1.4) * 0.7}s;

    &::before {
      /* background: linear-gradient(135deg, rgba(241, 194, 50, 1) 0%, rgba(245, 158, 11, 0.9) 100%); */
      background: linear-gradient(135deg, #83cafe 0%, rgba(53, 122, 183, 0.8) 100%);

      transform: scale(1.1);
    }
  }

  // Active state
  ${TriangleContainer}:active & {
    transform: translateY(2px) scale(0.95);
  }

  // Focus state for accessibility
  ${TriangleContainer}:focus-visible & {
    &::before {
      box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.2);
    }
  }

  // Responsive sizing
  @media (max-width: 768px) {
    border-left-width: ${(props) => (props.size || 20) * 0.8}px;
    border-right-width: ${(props) => (props.size || 20) * 0.8}px;
    border-top-width: ${(props) => (props.size || 20) * 1.3}px;

    &::before {
      width: ${(props) => (props.size || 20) * 1.6}px;
      height: ${(props) => (props.size || 20) * 1.3}px;
      left: ${(props) => (props.size || 20) * -0.8}px;
      top: ${(props) => (props.size || 20) * -0.65}px;
    }
  }

  // High contrast mode support
  @media (prefers-contrast: high) {
    border-top-color: #000;

    &::before {
      background: #000;
    }
  }
`;

// Enhanced component with better prop handling and accessibility
const PulsingDownTriangle = ({
  atBottom = false,
  showArrow = true,
  size = 20,
  color = "rgba(53, 122, 183, 0.8)",
  duration = 1.4,
  delay = 0,
  clickable = false,
  onClick,
  ariaLabel = "Scroll down indicator",
  className,
  ...props
}) => {
  // Early return for better performance
  if (atBottom || !showArrow) {
    return null;
  }

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (clickable && onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <TriangleContainer
      clickable={clickable}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : -1}
      role={clickable ? "button" : "img"}
      aria-label={ariaLabel}
      className={className}
      {...props}
    >
      <Triangle size={size} color={color} duration={duration} delay={delay} />
    </TriangleContainer>
  );
};

// Export additional styled components for custom usage
export { Triangle, TriangleContainer };

export default PulsingDownTriangle;
