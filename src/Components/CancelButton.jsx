import React from "react";
import PropTypes from "prop-types";

const CancelButton = ({ onClick, className = "" }) => {
  return (
    <button
      className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mb-4 flex items-center space-x-2 ${className}`} // Flex and space for icon and label
      onClick={onClick}
    >
      <i className="pi pi-times"></i> {/* PrimeIcon for cancel/close */}
      <span>Cancel</span>
    </button>
  );
};

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CancelButton;
