import React from "react";

// Mock the Modal component
export const Modal = ({ children, open, onClose, closeIcon, ...props }) => {
  if (!open) return null;

  return (
    <div
      role="dialog"
      data-testid="modal"
      className={props.classNames?.modal}
      onClick={(e) => {
        // Simulate overlay click
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      {closeIcon}
      {children}
    </div>
  );
};

// Mock the CSS import
export default {};
