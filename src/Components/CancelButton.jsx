// CancelButton.jsx
import React from "react";
import { Button } from "primereact/button";

const CancelButton = ({ onCancel }) => {
  return (
    <Button
      label="Cancel"
      icon="pi pi-times"
      onClick={onCancel}
      className="ml-2 p-button-rounded p-button-success"
      style={{ padding: "0.75rem 1.5rem" }}
    />
  );
};

export default CancelButton;
