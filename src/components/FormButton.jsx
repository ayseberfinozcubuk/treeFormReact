import React from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const FormButton = ({
  label,
  icon = "", // Default parameter for icon
  onClick,
  disabled = false, // Default parameter for disabled
  className = "", // Default parameter for className
  style = {}, // Optional style prop to further customize
}) => {
  return (
    <Button
      icon={icon} // Display only the icon
      onClick={onClick}
      disabled={disabled}
      className={`p-button-text p-button-icon-only p-button-rounded p-button-danger ${className}`} // Similar style as DeleteButton
      style={style} // Apply any additional styles passed as props
      tooltip={label} // Use label as the tooltip text
      tooltipOptions={{ position: "top" }} // Tooltip positioned at the top
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
