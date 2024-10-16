import React from "react";
import PropTypes from "prop-types";

const CancelButton = ({ onClick }) => {
  return (
    <button
      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
      onClick={onClick}
    >
      Cancel
    </button>
  );
};

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired, // Ensure it's required and called correctly
};

export default CancelButton;
