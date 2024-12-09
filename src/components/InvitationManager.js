import React from "react";
import CollaborationItems from "./CollaborationItems";

const InvitationManager = ({
  userProfile,
  handleCancelInvitation,
  handleAcceptInvitation,
  handleDeclineInvitation,
}) => {
  const receivedInvitations =
    userProfile.received_invitations?.filter((inv) => inv.type !== "request") ||
    [];
  const receivedRequests =
    userProfile.received_invitations?.filter((inv) => inv.type === "request") ||
    [];

  const sentInvitations =
    userProfile.sent_invitations?.filter((inv) => inv.type !== "request") || [];
  const sentRequests =
    userProfile.sent_invitations?.filter((inv) => inv.type === "request") || [];

  return (
    <div className="invitations-section mt-4">
      <div className="row g-4">
        <div className="col-md-6">
          <CollaborationItems
            title={"Outgoing Collaborations"}
            invitations={sentInvitations}
            requests={sentRequests}
            onAcceptInvitation={handleAcceptInvitation}
            onDeclineInvitation={handleDeclineInvitation}
            onCancelInvitation={handleCancelInvitation}
            message={"No pending outgoing collaboration requests"}
            titleInvitation={"Invitations Sent to Others"}
            titleRequest={"Your Requests to Join Public Projects"}
          />
        </div>
        <div className="col-md-6">
          <CollaborationItems
            title={"Incoming Collaborations"}
            invitations={receivedInvitations}
            requests={receivedRequests}
            onAcceptInvitation={handleAcceptInvitation}
            onDeclineInvitation={handleDeclineInvitation}
            onCancelInvitation={handleCancelInvitation}
            message={"No pending incoming collaboration requests"}
            titleInvitation={"Invitations to Join Projects"}
            titleRequest={"Requests to Join Your Projects"}
          />
        </div>
      </div>
    </div>
  );
};

export default InvitationManager;
