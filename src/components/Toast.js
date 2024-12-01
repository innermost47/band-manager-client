import React from "react";
import PropTypes from "prop-types";

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`toast position-fixed top-0 end-0 p-3 ${
        message ? "show" : "hide"
      }`}
      style={{ zIndex: 1055 }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        className={`toast-header ${
          type === "success"
            ? "bg-success text-white"
            : type === "error"
            ? "bg-danger text-white"
            : "bg-info text-white"
        }`}
      >
        <strong className="me-auto">
          {type === "success"
            ? "Success"
            : type === "error"
            ? "Error"
            : type === "loading"
            ? "Uploading..."
            : ""}
        </strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">
        {type === "loading" ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          message
        )}
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "loading"]),
  onClose: PropTypes.func.isRequired,
};

export default Toast;
