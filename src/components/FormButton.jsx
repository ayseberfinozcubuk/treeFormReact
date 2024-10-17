import React from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const FormButton = ({
  label,
  icon = "", // Default parameter for icon
  onClick,
  disabled = false, // Default parameter for disabled
  className = "", // Default parameter for className
}) => {
  return (
    <Button
      label={label}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      className={`p-button 
        ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        } 
        text-white py-2 px-4 rounded transition-colors duration-200 ${className}`}
      iconPos="left" // Ensures the icon is placed on the left of the label
      style={{ gap: "8px" }} // Adds space between the icon and label
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
};

export default FormButton;
