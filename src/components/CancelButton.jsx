import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { showConfirmationToast } from "../utils/utils";

const CancelButton = ({ onClick, className = "", style = {} }) => {
  const toast = useRef(null);
  const confirmMessage = "İşlemi iptal etmek istediğinizden emin misiniz?";

  return (
    <>
      <Toast ref={toast} />
      <Button
        label="İptal Et"
        icon="pi pi-times"
        onClick={() =>
          showConfirmationToast(toast.current, confirmMessage, onClick)
        }
        className={`p-button-outlined ${className}`}
        style={{
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
    </>
  );
};

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  userName: PropTypes.string,
};

export default CancelButton;
