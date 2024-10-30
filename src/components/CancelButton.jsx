import React from "react";
import PropTypes from "prop-types";

const CancelButton = ({ onClick, className = "" }) => {
  return (
    <button
      className={`bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mb-4 ${className}`}
      onClick={onClick}
    >
      Cancel Changes
    </button>
  );
};

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CancelButton;
