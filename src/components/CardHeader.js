import React from "react";

const CardHeader = ({
  title,
  icon,
  actionButton,
  onAction,
  span,
  currentIndex,
  totalCount,
  isDisabled,
  isPublicBadge,
  closeButton,
  onCancel,
}) => {
  return (
    <div className="card-header">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle bg-primary bg-opacity-10 me-2 d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              minWidth: "32px",
            }}
          >
            <i className={`bi ${icon} fs-6 text-primary`}></i>
          </div>
          <h5 className="mb-0">{title}</h5>
          {span && <span className="badge bg-primary ms-2">{span}</span>}
          {isPublicBadge && <span className="badge bg-success">Public</span>}
        </div>
        {currentIndex !== undefined && totalCount !== undefined && (
          <span className="badge bg-primary ms-2">
            {currentIndex + 1} / {totalCount}
          </span>
        )}
        {actionButton && (
          <button
            className="btn btn-primary btn-sm rounded-pill"
            onClick={onAction}
            disabled={isDisabled}
          >
            {actionButton}
          </button>
        )}
        {closeButton && (
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onCancel}
          ></button>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
