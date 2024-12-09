import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import Toast from "../components/Toast";
import { confirmAlert } from "react-confirm-alert";
import CardHeader from "../components/CardHeader";
import ProfileForm from "../components/ProfileForm";
import InvitationManager from "../components/InvitationManager";

const availableRoles = [
  "ROLE_GUITARIST",
  "ROLE_ARRANGEUR",
  "ROLE_SINGER",
  "ROLE_DRUMMER",
  "ROLE_MANAGER",
  "ROLE_BASSIST",
];

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        const data = response.data;
        setUserProfile({
          ...data,
          roles: data.roles || [],
          projects: data.projects || [],
          invitations: data.invitations || [],
        });
        setSelectedRoles(data.roles || []);
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
        showToast("Failed to load profile.", "error");
      }
    };
    fetchProfile();
  }, []);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePublic = (field) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setSelectedRoles((prev) =>
      checked ? [...prev, value] : prev.filter((role) => role !== value)
    );
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = {
        ...userProfile,
        roles: selectedRoles,
        projects: projects,
      };
      await userService.updateProfile(updatedProfile);
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Error updating profile.", "error");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error reloading profile:", error);
      }
    };
    fetchProfile();
  };

  const handleAcceptInvitation = async (token) => {
    confirmAlert({
      title: "Accept Invitation",
      message: "Are you sure you want to accept this invitation?",
      buttons: [
        {
          label: "Yes, Accept Invitation",
          onClick: async () => {
            try {
              let response = await userService.acceptInvitation(token);
              if (response.status === 200) {
                showToast("Invitation accepted", "success");
                response = await userService.getProfile();
                const data = response.data;
                setUserProfile({
                  ...data,
                  roles: data.roles || [],
                  projects: data.projects || [],
                  invitations: data.invitations || [],
                });
                setSelectedRoles(data.roles || []);
                setProjects(data.projects || []);
              } else {
                showToast("Failed to accept invitation", "error");
              }
            } catch (error) {
              console.error("Error accepting invitation", error);
              showToast("Error accepting invitation", "error");
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const handleDeclineInvitation = async (token) => {
    confirmAlert({
      title: "Decline Invitation",
      message: "Are you sure you want to decline this invitation?",
      buttons: [
        {
          label: "Yes, Decline Invitation",
          onClick: async () => {
            try {
              let response = await userService.declineInvitation(token);
              if (response.status === 200) {
                showToast("Invitation declined", "success");
                response = await userService.getProfile();
                const data = response.data;
                setUserProfile({
                  ...data,
                  roles: data.roles || [],
                  projects: data.projects || [],
                  invitations: data.invitations || [],
                });
                setSelectedRoles(data.roles || []);
                setProjects(data.projects || []);
              } else {
                showToast("Failed to decline invitation", "error");
              }
            } catch (error) {
              console.error("Error declining invitation", error);
              showToast("Error declining invitation", "error");
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const handleCancelInvitation = async (token) => {
    confirmAlert({
      title: "Cancel Invitation",
      message: "Are you sure you want to cancel this invitation?",
      buttons: [
        {
          label: "Yes, Cancel Invitation",
          onClick: async () => {
            try {
              let response = await userService.cancelInvitation(token);
              if (response.status === 200) {
                showToast("Invitation cancelled", "success");
                response = await userService.getProfile();
                const data = response.data;
                setUserProfile({
                  ...data,
                  roles: data.roles || [],
                  projects: data.projects || [],
                  invitations: data.invitations || [],
                });
                setSelectedRoles(data.roles || []);
                setProjects(data.projects || []);
              } else {
                showToast("Failed to cancel invitation", "error");
              }
            } catch (error) {
              console.error("Error cancelling invitation", error);
              showToast("Error cancelling invitation", "error");
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  if (!userProfile) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-3">
      <div className="text-center mb-4">
        {" "}
        <div
          className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
          }}
        >
          <i className="bi bi-person fs-2 text-primary"></i>
        </div>
        <h2 className="text-center mb-3">My Profile</h2>
      </div>
      {isEditing && (
        <ProfileForm
          userProfile={userProfile}
          handleInputChange={handleInputChange}
          handleTogglePublic={handleTogglePublic}
          handleRoleChange={handleRoleChange}
          handleCancelEdit={handleCancelEdit}
          handleSaveProfile={handleSaveProfile}
          availableRoles={availableRoles}
          selectedRoles={selectedRoles}
          projects={projects}
        />
      )}
      <div className="card shadow">
        <CardHeader
          title={"Personal Information"}
          icon={"bi-person-circle"}
          actionButton={
            <>
              <i className="bi bi-pencil-square me-1"></i> Edit
            </>
          }
          onAction={() => setIsEditing(true)}
          isDisabled={isEditing}
        />
        <div className="card-body">
          <div className="row g-4">
            {/* Basic Info */}
            <div className="col-md-6">
              <div className="card h-100 border-1">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-primary">
                    Basic Information
                  </h6>
                  <div className="mb-2 d-flex">
                    <i className="bi bi-person-circle me-2 text-muted fs-5"></i>
                    <div>
                      <div className="text-muted small">Username</div>
                      <div>{userProfile.username}</div>
                    </div>
                  </div>
                  <div className="mb-2 d-flex">
                    <i className="bi bi-envelope me-2 text-muted fs-5"></i>
                    <div>
                      <div className="text-muted small">
                        Email{" "}
                        {userProfile.emailPublic && (
                          <span className="badge bg-success">Public</span>
                        )}
                      </div>
                      <div>{userProfile.email}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-md-6">
              <div className="card h-100 border-1">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-primary">
                    Contact Details
                  </h6>
                  <div className="mb-2 d-flex">
                    <i className="bi bi-geo-alt me-2 text-muted fs-5"></i>
                    <div>
                      <div className="text-muted small">
                        Address{" "}
                        {userProfile.addressPublic && (
                          <span className="badge bg-success">Public</span>
                        )}
                      </div>
                      <div>{userProfile.address || "N/A"}</div>
                    </div>
                  </div>
                  <div className="mb-2 d-flex">
                    <i className="bi bi-telephone me-2 text-muted fs-5"></i>
                    <div>
                      <div className="text-muted small">
                        Phone{" "}
                        {userProfile.phonePublic && (
                          <span className="badge bg-success">Public</span>
                        )}
                      </div>
                      <div>{userProfile.phone || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="col-md-6">
              <div className="card h-100 border-1">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-primary">
                    Professional Details
                  </h6>
                  <div className="mb-2 d-flex">
                    <i className="bi bi-music-note me-2 text-muted fs-5"></i>
                    <div>
                      <div className="text-muted small">
                        SACEM Number{" "}
                        {userProfile.sacemNumberPublic && (
                          <span className="badge bg-success">Public</span>
                        )}
                      </div>
                      <div>{userProfile.sacemNumber || "N/A"}</div>
                    </div>
                  </div>
                  <div className="mb-2 d-flex">
                    <i className="bi bi-person-badge me-2 text-muted fs-5"></i>
                    <div>
                      <div className="text-muted small">
                        Roles{" "}
                        {userProfile.rolesPublic && (
                          <span className="badge bg-success">Public</span>
                        )}
                      </div>
                      <div>{userProfile.roles?.join(", ") || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="col-md-6">
              <div className="card h-100 border-1">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-primary">Biography</h6>
                  <div className="mb-2">
                    <div className="text-muted small mb-1">
                      About{" "}
                      {userProfile.bioPublic && (
                        <span className="badge bg-success">Public</span>
                      )}
                    </div>
                    <div>{userProfile.bio || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="col-12">
              <div className="card border-1">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-primary">
                    Projects{" "}
                    {userProfile.projectsPublic && (
                      <span className="badge bg-success">Public</span>
                    )}
                  </h6>
                  {projects.length === 0 ? (
                    <div className="text-muted">No projects available</div>
                  ) : (
                    <div className="row g-2">
                      {projects.map((project) => (
                        <div key={project.id} className="col-md-6 col-lg-4">
                          <div className="d-flex align-items-center p-2 border rounded">
                            <i className="bi bi-folder me-2 text-primary"></i>
                            <span>{project.name}</span>
                            {project.isPublic && (
                              <span className="badge bg-success ms-2">
                                Public
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InvitationManager
        userProfile={userProfile}
        handleCancelInvitation={handleCancelInvitation}
        handleAcceptInvitation={handleAcceptInvitation}
        handleDeclineInvitation={handleDeclineInvitation}
      />
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default UserProfile;
