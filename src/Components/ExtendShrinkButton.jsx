// ExtendShrinkButton.jsx
import React from "react";
import { Button } from "primereact/button";

const ExtendShrinkButton = ({ isExtended, onToggle }) => {
  return (
    <Button
      icon={isExtended ? "pi pi-angle-up" : "pi pi-angle-down"}
      onClick={onToggle}
      className="ml-2 mt-2 p-button-secondary"
    />
  );
};

export default ExtendShrinkButton;
