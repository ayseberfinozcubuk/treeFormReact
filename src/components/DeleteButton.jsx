import React from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const DeleteButton = ({ onClick, className = "", style }) => {
  return (
    <Button
      icon="pi pi-trash"
      className={`p-button-danger p-button-text ${className}`}
      onClick={onClick}
      style={style} // Apply the passed style prop here
      tooltip="Delete"
      tooltipOptions={{ position: "top" }}
    />
  );
};

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object, // Add style prop validation
};

export default DeleteButton;
