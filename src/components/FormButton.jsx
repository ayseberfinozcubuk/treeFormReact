import React from "react";
import { Button } from "primereact/button";
import PropTypes from "prop-types";

const FormButton = ({
  label,
  icon = "", // Default parameter for icon
  onClick,
  disabled = false, // Default parameter for disabled
  className = "", // Default parameter for className
  style = {}, // Default parameter for style
}) => {
  // Combine default and custom styles (use custom styles to override)
  const combinedStyles = {
    padding: "8px 16px", // Default padding
    backgroundColor: disabled ? "#d1d5db" : "#007bb5", // Gray when disabled, Blue otherwise
    color: "white",
    borderRadius: "4px", // Rounded corners
    ...style, // Merge with passed custom styles
  };

  return (
    <Button
      label={label}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      className={`p-button ${className}`} // PrimeReact's default button class + any extra class
      style={combinedStyles} // Use the combined styles
    />
  );
};

// PropTypes for validation and easier management in the future
FormButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FormButton;
