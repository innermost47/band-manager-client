import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "../api/projectService";
import AudioPlayerComponent from "../components/AudioPlayerComponent";
import { API_BASE_URL } from "../api/api";
import Toast from "../components/Toast";
import CardHeader from "../components/CardHeader";
import { format } from "date-fns";
import { eventService } from "../api/eventService";
import EventList from "../components/EventList";

const ProjectPublicProfile = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [image, setImage] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [isLoadingProfileImage, setIsLoadingProfileImage] = useState(true);
  const [audioUrls, setAudioUrls] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const navigate = useNavigate();

  const getProfileImageFile = useCallback(async (filePath) => {
    try {
      const response = await projectService.getProfileImageFile(filePath);
      const image = URL.createObjectURL(response.data);
      setImage(image);
    } catch (error) {
      console.error("Error fetching image profile file:", error);
      showToast("Error fetching image profile file.", "error");
      setImage("/default-profile.png");
    }
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProject(id);
        setProject(response.data.project);
        setMembers(
          response.data.project.members.filter((member) => member.isPublic) ||
            []
        );
        setIsLoadingProfileImage(true);
        if (response.data.project.profileImage) {
          await getProfileImageFile(response.data.project.profileImage);
        } else {
          setImage("/default-profile.png");
        }
        setIsLoadingProfileImage(false);
        const audioFiles = [];
        for (const song of response.data.songs) {
          for (const audio of song.audioFiles) {
            if (audio.audioFileType.name === "Master" && audio.signed_url) {
              audioFiles.push({
                id: audio.id,
                title: song.title,
                url: API_BASE_URL + "/" + audio.signed_url,
              });
            }
          }
        }
        setAudioUrls(audioFiles);
        setIsLoadingAudio(false);
        try {
          const eventsResponse = await eventService.getPublicEventsByProject(
            id
          );
          setEvents(eventsResponse.data);
        } catch (error) {
          console.error("Error fetching events:", error);
          showToast("Error fetching events.", "error");
        }
        setIsLoadingEvents(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setIsLoadingProfileImage(false);
        setIsLoadingEvents(false);
      }
    };
    fetchProject();
  }, [id, getProfileImageFile]);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!project) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading project...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-5">
      <div className="row align-items-center mb-3">
        <div className="col-lg-4 text-center">
          <div className="position-relative d-inline-block">
            {isLoadingProfileImage ? (
              <div
                className="project-profile-image-wrapper rounded-circle bg-light d-flex align-items-center justify-content-center"
                style={{ width: "200px", height: "200px" }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">
                    Loading profile image...
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="position-relative mb-3"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={image}
                  alt="Project Profile"
                  className="rounded-circle shadow"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h1 className="display-6 mb-3">{project.name}</h1>
              <p className="lead text-muted mb-0">{project.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <CardHeader title={"Team Members"} icon={"bi-people"} />
            <div className="card-body p-0">
              {members.length > 0 ? (
                <div className="list-group list-group-flush">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="list-group-item border-0 py-3"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div
                          className="d-flex align-items-center"
                          onClick={() =>
                            navigate(`/public-profile/${member.id}`)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <div
                            className="rounded-circle bg-light p-2 me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              minWidth: "32px",
                            }}
                          >
                            <i className="bi bi-person text-primary"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">{member.username}</h6>
                            <small className="text-muted">Member</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">
                  <i className="bi bi-people display-4 text-muted"></i>
                  <p className="text-muted mt-2">No public members</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          {isLoadingAudio ? (
            <div className="d-flex justify-content-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading audio...</span>
              </div>
            </div>
          ) : (
            <AudioPlayerComponent audioUrls={audioUrls} />
          )}
        </div>
      </div>
      <div className="card shadow-sm mt-3">
        <CardHeader title="Upcoming Events" icon="bi-calendar-event" />
        <div className="card-body">
          <EventList events={events} isLoading={isLoadingEvents} />
        </div>
      </div>
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default ProjectPublicProfile;
