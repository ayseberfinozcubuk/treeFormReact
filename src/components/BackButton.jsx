import React from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const BackButton = ({ onClick, className = "", style }) => {
  return (
    <Button
      icon="pi pi-arrow-left"
      className={`p-button-secondary p-button-text ${className}`}
      onClick={onClick}
      style={style}
      tooltip="Liste Ekranına Dön"
      tooltipOptions={{ position: "top" }}
    />
  );
};

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default BackButton;
