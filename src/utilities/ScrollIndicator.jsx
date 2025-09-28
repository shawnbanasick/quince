// Scroll Indicator Component
const ScrollIndicator = ({
  position = "bottom-right",
  style = "bouncing-arrow",
  color = "#007bff",
  size = "medium",
}) => {
  const sizeMap = {
    small: "24px",
    medium: "32px",
    large: "40px",
  };

  const positionStyles = {
    "bottom-right": { bottom: "20px", right: "20px" },
    "bottom-center": { bottom: "20px", left: "50%", transform: "translateX(-50%)" },
    "bottom-left": { bottom: "20px", left: "20px" },
    "center-right": { top: "50%", right: "20px", transform: "translateY(-50%)" },
  };

  const indicatorSize = sizeMap[size];

  const baseStyles = {
    position: "absolute",
    width: indicatorSize,
    height: indicatorSize,
    color: color,
    pointerEvents: "none",
    zIndex: 10,
    ...positionStyles[position],
  };

  if (style === "bouncing-arrow") {
    return (
      <div
        style={{
          ...baseStyles,
          animation: "bounce 2s infinite",
          fontSize: indicatorSize,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ↓
        </div>
        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
        `}</style>
      </div>
    );
  }

  if (style === "pulsing-dot") {
    return (
      <div
        style={{
          ...baseStyles,
          borderRadius: "50%",
          backgroundColor: color,
          animation: "pulse 1.5s infinite",
        }}
      >
        <style>{`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (style === "chevron") {
    return (
      <div
        style={{
          ...baseStyles,
          animation: "slideDown 2s infinite",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10L12 15L17 10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <style>{`
          @keyframes slideDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(8px); }
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default ScrollIndicator;
