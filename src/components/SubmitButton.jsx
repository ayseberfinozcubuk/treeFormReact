// SubmitButton.jsx
import React from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const SubmitButton = ({
  label = "Submit",
  icon = "pi pi-check",
  onClick,
  disabled = false,
  className = "",
  style = {},
}) => {
  return (
    <Button
      label={label}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      className={`p-button ${className}`}
      style={{
        backgroundColor: disabled ? "#D3D3D3" : "#4CAF50", // Vibrant yet refined green
        color: "white",
        borderRadius: "6px",
        padding: "0.7rem 1.2rem",
        fontSize: "0.9rem",
        fontWeight: "500",
        transition: "background-color 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = "#388E3C"; // Darker shade on hover
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = "#4CAF50";
      }}
    />
  );
};

SubmitButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SubmitButton;
