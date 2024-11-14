import React from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";

const DeleteButton = ({
  onClick,
  className = "",
  style,
  emitterName = "",
  rootEntity = "",
  disabled = false,
}) => {
  const handleDeleteClick = () => {
    const confirmMessage =
      emitterName && rootEntity
        ? `${emitterName} adlı ${rootEntity} öğesini silmek istediğinizden emin misiniz?`
        : "Bu öğeyi silmek istediğinizden emin misiniz?";

    const isConfirmed = window.confirm(confirmMessage);
    if (isConfirmed) {
      onClick(); // Proceed with the delete action if confirmed
    }
  };

  return (
    <Button
      icon="pi pi-trash"
      className={`p-button-danger p-button-text ${className}`}
      onClick={handleDeleteClick} // Call the confirmation handler
      style={style}
      tooltip="Sil"
      tooltipOptions={{ position: "top" }}
      disabled={disabled}
    />
  );
};

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  emitterName: PropTypes.string,
  rootEntity: PropTypes.string,
};

export default DeleteButton;
