import React from "react";
import InvitationStatusActions from "./InvitationStatusActions";
import CardHeader from "./CardHeader";

const EmptyMessage = ({ icon = "bi-inbox", message }) => (
  <div className="text-center text-muted py-3">
    <i className={`bi ${icon} fs-2 mb-2 d-block`}></i>
    <p className="mb-0">{message}</p>
  </div>
);

const SectionHeader = ({ title, icon }) => (
  <div className="d-flex align-items-center border-bottom pb-2 mb-3">
    <i className={`bi ${icon} me-2`}></i>
    <h6 className="mb-0 text-secondary">{title}</h6>
  </div>
);

const CollaborationItemContent = ({ item, sectionType }) => {
  const showProjectFirst =
    sectionType === "Invitations Sent to Others" ||
    sectionType === "Invitations to Join Projects";

  if (showProjectFirst) {
    return (
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-folder text-primary"></i>
        <strong>{item.project.name}</strong>
        <i className="bi bi-arrow-right text-muted mx-2"></i>
        <div className="d-flex align-items-center">
          <i className="bi bi-person text-secondary"></i>
          <span className="ms-1">{item.username}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <i className="bi bi-person text-secondary"></i>
      <span>{item.username}</span>
      <i className="bi bi-arrow-right text-muted mx-2"></i>
      <div className="d-flex align-items-center">
        <i className="bi bi-folder text-primary"></i>
        <strong className="ms-1">{item.project.name}</strong>
      </div>
    </div>
  );
};

const CollaborationItems = ({
  title,
  invitations = [],
  requests = [],
  titleInvitation,
  titleRequest,
  onAcceptInvitation,
  onDeclineInvitation,
  onCancelInvitation,
}) => {
  return (
    <div className="card h-100 shadow-sm">
      <CardHeader
        title={title}
        icon="bi-inbox"
        span={
          invitations.length + requests.length > 0
            ? invitations.length + requests.length
            : undefined
        }
      />
      <div className="card-body">
        <div className="d-flex flex-column gap-4">
          {/* Invitations Section */}
          <div>
            <SectionHeader title={titleInvitation} icon="bi-person-check" />
            {invitations.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {invitations.map((invitation) => (
                  <div key={invitation.token} className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <CollaborationItemContent
                        item={invitation}
                        sectionType={titleInvitation}
                      />
                      <InvitationStatusActions
                        title={title}
                        status={invitation.status}
                        token={invitation.token}
                        onAccept={onAcceptInvitation}
                        onDecline={onDeclineInvitation}
                        onCancel={onCancelInvitation}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyMessage
                icon="bi-person-check"
                message={
                  title === "Outgoing Collaborations"
                    ? "No invitations sent to other users"
                    : "No invitations received from other users"
                }
              />
            )}
          </div>

          {/* Requests Section */}
          <div>
            <SectionHeader title={titleRequest} icon="bi-clipboard-check" />
            {requests.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {requests.map((request) => (
                  <div key={request.token} className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <CollaborationItemContent
                        item={request}
                        type={titleInvitation}
                      />
                      <InvitationStatusActions
                        title={title}
                        status={request.status}
                        token={request.token}
                        onAccept={onAcceptInvitation}
                        onDecline={onDeclineInvitation}
                        onCancel={onCancelInvitation}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyMessage
                icon="bi-clipboard-check"
                message={
                  title === "Outgoing Collaborations"
                    ? "No requests sent to join public projects"
                    : "No pending requests to join your projects"
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationItems;
