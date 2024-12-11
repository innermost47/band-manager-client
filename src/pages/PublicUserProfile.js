import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../api/userService";
import CardHeader from "../components/CardHeader";
import CollaborationManager from "../components/CollaborationManager";
import { useToast } from "../components/ToastContext";

const PublicUserProfile = () => {
  const [publicProfile, setPublicProfile] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [projectsA, setProjectsA] = useState([]);
  const [recipientId, setUserBId] = useState(null);
  const { showToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const response = await userService.getMember(id);
        setPublicProfile(response.data);
        if (response.data.projects) {
          const count = Object.keys(response.data.projects).length;
          setProjectCount(count);
        }
      } catch (error) {
        console.error("Error fetching public profile:", error);
      }
    };
    fetchPublicProfile();
    setUserBId(id);
  }, [id]);

  useEffect(() => {
    const fetchCurrentUserProjects = async () => {
      try {
        const response = await userService.getCurrentUserProjects(id);
        setProjectsA(Object.values(response.data.projects));
      } catch (error) {
        console.error("Error fetching projects for user A:", error);
      }
    };
    fetchCurrentUserProjects();
  }, [id]);

  if (!publicProfile) {
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
      <h2 className="text-center mb-3">{publicProfile.username}'s Profile</h2>

      <div className="row g-4">
        {/* Basic Info Card */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <CardHeader
              title={"Contact Information"}
              icon={"bi-person-circle"}
            />
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div>
                  <div className="text-muted small">Username</div>
                  <div>{publicProfile.username}</div>
                </div>
                {publicProfile.email && (
                  <div>
                    <div className="text-muted small">Email</div>
                    <div>{publicProfile.email}</div>
                  </div>
                )}
                {publicProfile.phone && (
                  <div>
                    <div className="text-muted small">Phone</div>
                    <div>{publicProfile.phone}</div>
                  </div>
                )}
                {publicProfile.address && (
                  <div>
                    <div className="text-muted small">Address</div>
                    <div>{publicProfile.address}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Info Card */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <CardHeader title={"Professional Details"} icon={"bi-briefcase"} />
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {publicProfile.sacemNumber && (
                  <div>
                    <div className="text-muted small">SACEM Number</div>
                    <div>{publicProfile.sacemNumber}</div>
                  </div>
                )}
                {publicProfile.bio && (
                  <div>
                    <div className="text-muted small">Biography</div>
                    <div>{publicProfile.bio}</div>
                  </div>
                )}
                {publicProfile.roles && publicProfile.roles.length > 0 && (
                  <div>
                    <div className="text-muted small">Roles</div>
                    <div>
                      {publicProfile.roles.map((role) => (
                        <span key={role} className="badge bg-primary me-1">
                          {role.replace("ROLE_", "").toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Public Projects Card */}
        <div className="col-12">
          <div className="card shadow-sm">
            <CardHeader title={"Public Projects"} icon={"bi-folder"} />
            <div className="card-body">
              {publicProfile.projects && projectCount > 0 ? (
                <div className="row g-3">
                  {Object.values(publicProfile.projects).map((project) => (
                    <div key={project.id} className="col-md-6 col-lg-4">
                      <div
                        className="border rounded p-3 hover-shadow"
                        onClick={() =>
                          navigate(`/public-projects/${project.id}`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-folder me-2 text-primary"></i>
                          <span>{project.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-folder-x fs-2 mb-2"></i>
                  <p>No public projects available</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-12">
          {/* Manager pour envoyer des invitations */}
          {projectsA.length > 0 && (
            <CollaborationManager
              mode="invitation"
              type="user"
              projects={projectsA}
              targetId={recipientId}
              targetName={publicProfile.username}
              onSuccess={async () => {
                const response = await userService.getCurrentUserProjects(id);
                setProjectsA(Object.values(response.data.projects));
                showToast("Invitation sent successfully!", "success");
              }}
              onError={() => {
                showToast("Failed to send invitation.", "error");
              }}
              className="mb-4"
            />
          )}

          {/* Manager pour les demandes de collaboration */}
          {publicProfile.projects && projectCount > 0 && (
            <CollaborationManager
              mode="request"
              type="project"
              projects={Object.values(publicProfile.projects)}
              targetId={recipientId}
              targetName={publicProfile.username}
              onSuccess={async () => {
                const response = await userService.getMember(id);
                setPublicProfile(response.data);
                showToast(
                  "Collaboration request sent successfully!",
                  "success"
                );
              }}
              onError={() => {
                showToast("Failed to send collaboration request.", "error");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
