// ExtendShrinkButton.jsx
import React from "react";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";

const ExtendShrinkButton = ({ isExtended, onToggle }) => {
  return (
    <Button
      type="button"
      icon={isExtended ? PrimeIcons.ANGLE_DOWN : PrimeIcons.ANGLE_UP}
      onClick={onToggle}
    />
  );
};

export default ExtendShrinkButton;
