// CancelButton.jsx
import React from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const CancelButton = ({ onClick, className = "", style = {} }) => {
  return (
    <Button
      label="Cancel"
      icon="pi pi-times"
      onClick={onClick}
      className={`p-button-outlined ${className}`}
      style={{
        marginTop: "1rem", // Consistent margin with SubmitButton
        marginLeft: "1rem", // Added left margin for spacing
        padding: "0.7rem 1.2rem", // Matches SubmitButton padding
        fontSize: "0.9rem",
        fontWeight: "500",
        borderRadius: "6px",
        borderColor: "#707070", // Subtle gray outline
        color: "#707070", // Text matches the border for a minimal look
        transition:
          "color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
        backgroundColor: "transparent",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#505050"; // Darker gray on hover
        e.currentTarget.style.color = "#505050";
        e.currentTarget.style.backgroundColor = "#f0f0f0"; // Light background on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#707070";
        e.currentTarget.style.color = "#707070";
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    />
  );
};

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CancelButton;
