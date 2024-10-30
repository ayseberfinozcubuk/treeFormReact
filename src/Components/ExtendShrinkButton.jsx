import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const ExtendShrinkButton = ({
  isExtended,
  onToggle,
  className = "",
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      icon={isExtended ? "pi pi-chevron-down" : "pi pi-chevron-right"}
      onClick={onToggle}
      className={`p-button-text ${className}`} // Allows additional styling if needed
      style={{
        marginLeft: "0.5rem",
        backgroundColor: "transparent",
        color: "#707070",
        border: "1px solid #ddd", // Subtle border
        padding: "0.4rem 0.6rem",
        borderRadius: "5px",
        transition: "background-color 0.2s ease, color 0.2s ease",
        ...(isHovered && { backgroundColor: "#e0e0e0", color: "#505050" }), // Darker gray on hover
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)} // Hover state to adjust background and text color
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isExtended ? "Collapse Section" : "Expand Section"}
    />
  );
};

ExtendShrinkButton.propTypes = {
  isExtended: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ExtendShrinkButton;
