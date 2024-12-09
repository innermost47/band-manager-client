import React from "react";
import CardHeader from "./CardHeader";

const ProfileForm = ({
  userProfile,
  handleInputChange,
  handleTogglePublic,
  handleRoleChange,
  handleCancelEdit,
  handleSaveProfile,
  availableRoles,
  selectedRoles,
  projects,
}) => {
  return (
    <div className="mt-4 mb-4">
      <div className="card shadow-sm">
        <CardHeader
          title={"Edit Profile"}
          icon={"bi-person-gear"}
          onCancel={handleCancelEdit}
          closeButton={true}
        />
        <div className="card-body p-4">
          {/* Username */}
          <div className="mb-4">
            <label className="form-label text-muted small">Username</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="username"
                value={userProfile.username || ""}
                onChange={handleInputChange}
                placeholder="Enter your username..."
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="form-label text-muted small">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope text-primary"></i>
              </span>
              <input
                type="email"
                className="form-control"
                name="email"
                value={userProfile.email || ""}
                disabled
              />
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={userProfile.emailPublic || false}
                onChange={() => handleTogglePublic("emailPublic")}
              />
              <label className="form-check-label small text-muted">
                Make Email Public
              </label>
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="form-label text-muted small">Address</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-geo-alt text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="address"
                value={userProfile.address || ""}
                onChange={handleInputChange}
                placeholder="Enter your address..."
              />
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={userProfile.addressPublic || false}
                onChange={() => handleTogglePublic("addressPublic")}
              />
              <label className="form-check-label small text-muted">
                Make Address Public
              </label>
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="form-label text-muted small">Phone</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-telephone text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={userProfile.phone || ""}
                onChange={handleInputChange}
                placeholder="Enter your phone number..."
              />
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={userProfile.phonePublic || false}
                onChange={() => handleTogglePublic("phonePublic")}
              />
              <label className="form-check-label small text-muted">
                Make Phone Public
              </label>
            </div>
          </div>

          {/* SACEM Number */}
          <div className="mb-4">
            <label className="form-label text-muted small">SACEM Number</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-hash text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="sacemNumber"
                value={userProfile.sacemNumber || ""}
                onChange={handleInputChange}
                placeholder="Enter your SACEM number..."
              />
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={userProfile.sacemNumberPublic || false}
                onChange={() => handleTogglePublic("sacemNumberPublic")}
              />
              <label className="form-check-label small text-muted">
                Make SACEM Number Public
              </label>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="form-label text-muted small">Bio</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-file-text text-primary"></i>
              </span>
              <textarea
                className="form-control"
                name="bio"
                value={userProfile.bio || ""}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={userProfile.bioPublic || false}
                onChange={() => handleTogglePublic("bioPublic")}
              />
              <label className="form-check-label small text-muted">
                Make Bio Public
              </label>
            </div>
          </div>

          {/* Roles */}
          <div className="mb-4">
            <label className="form-label text-muted small">Roles</label>
            <div className="card border">
              <div className="card-body">
                {availableRoles.map((role) => (
                  <div className="form-check" key={role}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value={role}
                      checked={selectedRoles.includes(role)}
                      onChange={handleRoleChange}
                    />
                    <label className="form-check-label small text-muted">
                      {role.replace("ROLE_", "").toLowerCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={userProfile.rolesPublic || false}
                onChange={() => handleTogglePublic("rolesPublic")}
              />
              <label className="form-check-label small text-muted">
                Make Roles Public
              </label>
            </div>
          </div>

          {/* Projects */}
          <div className="mb-4">
            <label className="form-label text-muted small">Projects</label>
            {projects.length === 0 ? (
              <p className="text-muted small fst-italic">
                You don't have any projects yet.
              </p>
            ) : (
              <div className="card border">
                <div className="card-body p-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="d-flex justify-content-between align-items-center p-2 border-bottom"
                    >
                      <span className="small">{project.name}</span>
                      <span
                        className={`badge ${
                          project.isPublic ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {project.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={userProfile.projectsPublic || false}
                onChange={() => handleTogglePublic("projectsPublic")}
              />
              <label className="form-check-label small text-muted">
                Show Link to Public Projects on Profile
              </label>
            </div>
          </div>

          {/* Profile Visibility */}
          <div className="mb-4 card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-1">Profile Visibility</h6>
                  <p className="text-muted small mb-0">
                    Make your profile visible to everyone
                  </p>
                </div>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={userProfile.isPublic || false}
                    onChange={() => handleTogglePublic("isPublic")}
                    role="switch"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSaveProfile}
            >
              <i className="bi bi-check-lg me-2"></i>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
