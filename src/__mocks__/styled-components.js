import React from "react";

// Mock styled-components
const styled = new Proxy(
  {},
  {
    get(target, prop) {
      return (template, ...args) => {
        // Return a React component that renders as the target element
        const StyledComponent = React.forwardRef(({ children, ...props }, ref) => {
          return React.createElement(prop, { ...props, ref }, children);
        });

        StyledComponent.displayName = `Styled${prop.charAt(0).toUpperCase() + prop.slice(1)}`;
        return StyledComponent;
      };
    },
  }
);

export default styled;
