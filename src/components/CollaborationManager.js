import React, { useState } from "react";
import { userService } from "../api/userService";

const CollaborationManager = ({
  mode = "invitation",
  type = "user",
  projects = [],
  targetId,
  targetName = "",
  onSuccess = () => {},
  onError = () => {},
  className = "",
  selectedProjectId = null,
}) => {
  const [selectedProject, setSelectedProject] = useState(
    projects.find((p) => p.id === selectedProjectId) || null
  );
  const [loading, setLoading] = useState(false);

  const getHeaderText = () => {
    if (mode === "invitation") {
      return type === "user" ? "Invite to Project" : "Invite Collaborators";
    }
    return type === "project" ? "Request to Join Project" : "Request to Join";
  };

  const getActionText = () => {
    if (mode === "invitation") {
      return type === "user" ? "Send Invitation" : "Invite Selected Users";
    }
    return "Send Join Request";
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project.id === selectedProject?.id ? null : project);
  };

  const handleSubmit = async () => {
    if (!selectedProject && mode === "invitation") {
      return;
    }

    try {
      setLoading(true);

      if (mode === "invitation") {
        await userService.sendInvitation({
          projectId: selectedProject.id,
          recipientId: targetId,
        });
      } else {
        await userService.sendCollaborationRequest({
          projectId: selectedProjectId || selectedProject?.id,
          message: "I would like to collaborate on this project.",
          targetId: targetId,
        });
      }
      onSuccess();
      setSelectedProject(null);
    } catch (error) {
      console.error("Error:", error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderProjectsList = () => (
    <div className="col-md-7">
      <div className="list-group">
        {projects.map((project) => {
          const isPending =
            project.invitationStatus === "pending" ||
            project.requestStatus === "pending";
          const isCollaborating =
            project.isCollaborating || project.requestStatus === "accepted";
          const isBlocked =
            project.invitationStatus === "revoked" ||
            project.requestStatus === "revoked" ||
            project.invitationStatus === "declined" ||
            project.requestStatus === "declined";

          let status = "";

          if (isPending) {
            status =
              mode === "invitation" ? "Invitation Sent" : "Request Pending";
          } else if (isCollaborating) {
            status = "Already Collaborating";
          } else if (isBlocked) {
            status =
              project.invitationStatus === "revoked" ||
              project.requestStatus === "revoked"
                ? "Access Revoked"
                : "Request Declined";
          }
          return (
            <button
              key={project.id}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                selectedProject?.id === project.id &&
                !isPending &&
                !isCollaborating &&
                !isBlocked
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                !isPending &&
                !isCollaborating &&
                !isBlocked &&
                handleProjectSelect(project)
              }
              disabled={isPending || isCollaborating || isBlocked}
            >
              <div className="d-flex align-items-center">
                <i className="bi bi-folder-fill me-2"></i>
                <span>{project.name}</span>{" "}
                {project.isPublic && (
                  <span className="badge bg-success ms-2">Public</span>
                )}
              </div>
              {(status || isCollaborating) && (
                <span
                  className={`badge ${
                    isPending
                      ? "bg-warning"
                      : isCollaborating
                      ? "bg-success"
                      : project.invitationStatus === "revoked" ||
                        project.requestStatus === "revoked"
                      ? "bg-secondary"
                      : "bg-danger"
                  }`}
                >
                  {status}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderActionSection = () => {
    const allPending = projects.every(
      (project) =>
        project.invitationStatus === "pending" ||
        project.requestStatus === "pending" ||
        project.isCollaborating ||
        project.requestStatus === "accepted"
    );

    return (
      <div
        className={`col-md-${
          mode === "invitation" || !selectedProjectId ? "5" : "12"
        }`}
      >
        <div className="p-3 rounded">
          {allPending ? (
            <div className="text-muted">
              <i className="bi bi-info-circle me-2"></i>
              {mode === "invitation"
                ? "All invitations are pending"
                : "You are already collaborating or have pending requests for all projects"}
            </div>
          ) : (
            <>
              <p className="mb-3">
                {selectedProjectId
                  ? `Send a request to join "${
                      projects.find((p) => p.id === selectedProjectId)?.name
                    }"`
                  : mode === "invitation"
                  ? `Select a project to invite ${targetName}`
                  : "Select a project to join"}
              </p>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary">
                    <span className="visually-hidden">Processing...</span>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary w-100"
                  onClick={handleSubmit}
                  disabled={(!selectedProjectId && !selectedProject) || loading}
                >
                  <i
                    className={`bi ${
                      mode === "invitation"
                        ? "bi-send-fill"
                        : "bi-person-plus-fill"
                    } me-2`}
                  ></i>
                  {getActionText()}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  if (mode === "invitation" && (!projects || projects.length === 0)) {
    return null;
  }

  return (
    <div className={`card shadow-sm ${className}`}>
      <div className="card-header py-3">
        <div className="d-flex align-items-center">
          <i
            className={`bi ${
              mode === "invitation" ? "bi-send" : "bi-person-plus"
            } fs-4 text-primary me-2`}
          ></i>
          <h5 className="mb-0">{getHeaderText()}</h5>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-4">
          {(!selectedProjectId || mode === "invitation") &&
            renderProjectsList()}
          {renderActionSection()}
        </div>
      </div>
    </div>
  );
};

export default CollaborationManager;
