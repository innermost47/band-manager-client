import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import { useToast } from "../components/ToastContext";

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await userService.getProfiles();
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        showToast("Failed to load profiles.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading profiles...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-3">Profiles</h2>
      {profiles.length > 0 ? (
        <ul className="list-group">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{profile.username}</strong>
                <span> - </span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-decoration-none"
                >
                  {profile.email}
                </a>
                <p className="mb-0">
                  <small>
                    <strong>Address:</strong> {profile.address || "N/A"}{" "}
                  </small>
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No profiles available.</p>
      )}
    </div>
  );
};

export default Profiles;
