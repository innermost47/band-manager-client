import React, { useState } from "react";
import CardHeader from "./CardHeader";

const InviteForm = ({ userProjects, onInvite }) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !email) return;

    setIsLoading(true);
    try {
      await onInvite({ projectId: selectedProject, email });
      setEmail("");
      setSelectedProject("");
    } catch (error) {
      console.error("Error sending invitation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card shadow mt-4">
      <CardHeader title="Invite to Project" icon="bi-envelope-plus" />
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted small">
              Select Project
            </label>
            <select
              className="form-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              required
            >
              <option value="">Choose a project...</option>
              {userProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                  {project.isPublic ? " (Public)" : " (Private)"}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted small">
              Invite by Email
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope text-primary"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <small className="text-muted mt-1 d-block">
              <i className="bi bi-info-circle me-1"></i>
              The invitation link will be sent to this email address
            </small>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center btn-sm"
              disabled={isLoading || !selectedProject || !email}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Sending...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteForm;
