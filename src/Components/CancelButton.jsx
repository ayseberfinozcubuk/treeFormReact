// CancelButton.jsx
import React from "react";
import { useFormStore } from "../useFormStore";

const CancelButton = ({ sectionName }) => {
  const { cancelChanges } = useFormStore();

  const handleCancel = () => {
    cancelChanges(sectionName);
  };

  return <button onClick={handleCancel}>Cancel</button>;
};

export default CancelButton;
