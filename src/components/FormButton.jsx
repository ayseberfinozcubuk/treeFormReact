// FormButton.jsx
import React from "react";
import { Button } from "primereact/button";

const FormButton = ({ label, onClick, style }) => {
  return (
    <Button label={label} icon="pi pi-check" onClick={onClick} style={style} />
  );
};

export default FormButton;
