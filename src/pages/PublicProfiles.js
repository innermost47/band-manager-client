import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../api/userService";

const PublicProfiles = () => {
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicProfiles = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getProfiles();
        const profiles = Object.values(response.data);
        setPublicProfiles(profiles);
      } catch (error) {
        console.error("Error fetching public profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicProfiles();
  }, []);

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="text-center mb-4">
        <div
          className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
          }}
        >
          <i className="bi bi-people fs-2 text-primary"></i>
        </div>
        <h2 className="mb-3">Public Profiles</h2>
        <p className="text-muted">
          Explore the community and connect with other users on our platform
        </p>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading profiles...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {publicProfiles.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-people display-4 text-muted mb-3"></i>
                <p className="text-muted">
                  No public profiles available at the moment
                </p>
              </div>
            </div>
          ) : (
            publicProfiles.map((profile) => (
              <div key={profile.id} className="col-md-6 col-lg-4">
                <div
                  className="card h-100 border shadow-sm"
                  onClick={() => navigate(`/public-profile/${profile.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: "48px",
                          height: "48px",
                          minWidth: "48px",
                        }}
                      >
                        <i className="bi bi-person-circle fs-4 text-primary"></i>
                      </div>
                      <div>
                        <h5 className="mb-2">{profile.username}</h5>
                        {profile.roles && (
                          <div className="d-flex gap-1">
                            {profile.roles.map((role, index) => (
                              <span
                                key={index}
                                className="badge bg-primary bg-opacity-10 text-primary small"
                              >
                                {role.replace("ROLE_", "").toLowerCase()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PublicProfiles;
