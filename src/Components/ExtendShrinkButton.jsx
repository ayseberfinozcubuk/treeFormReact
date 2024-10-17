import React, { useState } from "react";
import { Button } from "primereact/button";
import PropTypes from "prop-types";

const ExtendShrinkButton = ({ isExtended, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      icon={isExtended ? "pi pi-chevron-down" : "pi pi-chevron-right"}
      onClick={onToggle}
      className="p-button-text ml-3" // Add left margin
      style={{
        backgroundColor: isHovered ? "#e0e0e0" : "#f0f0f0", // Darker gray on hover
        border: "1px solid #ddd", // Subtle border
        padding: "5px 10px", // Add some padding
        borderRadius: "5px", // Round corners
        transition: "background-color 0.2s ease", // Smooth hover transition
      }}
      onMouseEnter={() => setIsHovered(true)} // Set hover state
      onMouseLeave={() => setIsHovered(false)} // Remove hover state
      aria-label={isExtended ? "Collapse Section" : "Expand Section"}
    />
  );
};

ExtendShrinkButton.propTypes = {
  isExtended: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ExtendShrinkButton;
