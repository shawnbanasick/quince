import { useRef } from "react";
import useScrollIndicator from "./useScrollIndicator";
import ScrollIndicator from "./ScrollIndicator";

const ScrollableContainer = ({
  children,
  height = "500px",
  showIndicator = true,
  indicatorProps = {},
}) => {
  const containerRef = useRef(null);
  const { showIndicator: shouldShowIndicator } = useScrollIndicator(containerRef);

  return (
    <div style={{ position: "relative", height, border: "1px solid #ddd", borderRadius: "8px" }}>
      <div
        ref={containerRef}
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "16px",
          scrollBehavior: "smooth",
        }}
      >
        {children}
      </div>

      {showIndicator && shouldShowIndicator && <ScrollIndicator {...indicatorProps} />}
    </div>
  );
};

export default ScrollableContainer;
