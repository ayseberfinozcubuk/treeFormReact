import React from "react";
import PropTypes from "prop-types";

const CancelButton = ({ onClick, className = "" }) => {
  return (
    <button
      className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mb-4 ${className}`} // Added mb-4 for margin-bottom
      onClick={onClick}
    >
      Cancel
    </button>
  );
};

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CancelButton;
