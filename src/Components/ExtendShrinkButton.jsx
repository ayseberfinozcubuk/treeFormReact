// ExtendShrinkButton.jsx
import React from "react";
import { Button } from "primereact/button";
import PropTypes from "prop-types";

const ExtendShrinkButton = ({ isExtended, onToggle }) => {
  return (
    <Button
      icon={isExtended ? "pi pi-chevron-down" : "pi pi-chevron-right"}
      onClick={onToggle}
      className="p-button-text ml-3" // Add left margin (padding)
      style={{
        backgroundColor: "#f0f0f0", // Light gray background
        border: "1px solid #ddd", // Subtle border
        padding: "5px 10px", // Add some padding
        borderRadius: "5px", // Round corners
      }}
      aria-label={isExtended ? "Collapse Section" : "Expand Section"}
    />
  );
};

ExtendShrinkButton.propTypes = {
  isExtended: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ExtendShrinkButton;
