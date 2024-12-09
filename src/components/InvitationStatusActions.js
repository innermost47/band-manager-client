import React from "react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    accepted: {
      color: "success",
      icon: "check",
      text: "Accepted",
    },
    declined: {
      color: "danger",
      icon: "x",
      text: "Declined",
    },
    revoked: {
      color: "secondary",
      icon: "slash",
      text: "Revoked",
    },
  };

  const config = statusConfig[status] || statusConfig.declined;

  return (
    <span className={`badge bg-${config.color}`}>
      <i className={`bi bi-${config.icon}-circle me-1`}></i>
      {config.text}
    </span>
  );
};

const InvitationStatusActions = ({
  title,
  status,
  onAccept,
  onDecline,
  onCancel,
  token,
}) => {
  if (status !== "pending") {
    return <StatusBadge status={status} />;
  }

  if (title === "Outgoing Collaborations") {
    return (
      <button
        className="btn btn-link p-1 text-secondary border-0 shadow-none"
        onClick={() => onCancel(token)}
      >
        <i className="bi bi-x-circle fs-5"></i>
      </button>
    );
  }

  return (
    <div className="btn-group">
      <button
        className="btn btn-link p-1 text-success border-0 shadow-none"
        onClick={() => onAccept(token)}
      >
        <i className="bi bi-check-circle-fill fs-5"></i>
      </button>
      <button
        className="btn btn-link p-1 text-danger border-0 shadow-none"
        onClick={() => onDecline(token)}
      >
        <i className="bi bi-x-circle-fill fs-5"></i>
      </button>
    </div>
  );
};

export default InvitationStatusActions;
