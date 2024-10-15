// CancelButton.jsx
import React from "react";
import { Button } from "primereact/button";

const CancelButton = ({ onCancel }) => {
  return (
    <Button
      label="Cancel"
      icon="pi pi-times"
      className="p-button-danger"
      onClick={onCancel}
      style={{ marginLeft: "10px" }}
    />
  );
};

export default CancelButton;
