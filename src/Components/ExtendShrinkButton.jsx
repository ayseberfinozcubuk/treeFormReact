// ExtendShrinkButton.jsx
import React from "react";
import { Button } from "primereact/button";

const ExtendShrinkButton = ({ isExtended, onToggle }) => {
  return (
    <Button
      icon={isExtended ? "pi pi-angle-down" : "pi pi-angle-up"}
      onClick={onToggle}
      className="p-button-text"
    />
  );
};

export default ExtendShrinkButton;
