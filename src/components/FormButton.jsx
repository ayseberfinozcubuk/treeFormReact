import React from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const FormButton = ({
  label,
  icon = "",
  onClick,
  disabled = false,
  className = "",
  style = {},
}) => {
  return (
    <Button
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      className={`p-button-text p-button-icon-only p-button-rounded p-button-danger ${className}`} // Similar style as DeleteButton
      style={style}
      tooltip={label}
      tooltipOptions={{ position: "top" }}
    />
  );
};

FormButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FormButton;
