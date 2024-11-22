import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { showConfirmationToast } from "../utils/utils";

const DeleteButton = ({
  onClick,
  className = "",
  style,
  emitterName = "",
  rootEntity = "",
  disabled = false,
}) => {
  const toast = useRef(null);
  const confirmMessage =
    emitterName && rootEntity
      ? `${emitterName} adlı ${rootEntity} öğesini silmek istediğinizden emin misiniz?`
      : "Bu öğeyi silmek istediğinizden emin misiniz?";

  return (
    <>
      <Toast ref={toast} />
      <Button
        icon="pi pi-trash"
        className={`p-button-danger p-button-text ${className}`}
        onClick={() =>
          showConfirmationToast(toast.current, confirmMessage, onClick)
        }
        style={style}
        tooltip="Sil"
        tooltipOptions={{ position: "top" }}
        disabled={disabled}
      />
    </>
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
