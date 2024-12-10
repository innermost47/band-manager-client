import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "../api/projectService";
import SongForm from "../components/SongForm";
import AudioPlayerComponent from "../components/AudioPlayerComponent";
import songService from "../api/songService";
import { confirmAlert } from "react-confirm-alert";
import Toast from "../components/Toast";
import { API_BASE_URL } from "../api/api";
import CardHeader from "../components/CardHeader";
import EventForm from "../components/EventForm";
import { eventService } from "../api/eventService";
import EventCard from "../components/EventCard";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [songs, setSongs] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [members, setMembers] = useState([]);
  const [isSongFormVisible, setIsSongFormVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrls, setAudioUrls] = useState({});
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [isLoadingProfileImage, setIsLoadingProfileImage] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const songFormRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventFormVisible, setIsEventFormVisible] = useState(false);
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
      return null;
    }
  }, []);

  const getAudioFile = useCallback(async (audioFilePath) => {
    try {
      const response = await songService.getAudioFile(audioFilePath);
      const audioUrl = URL.createObjectURL(response.data);
      return audioUrl;
    } catch (error) {
      console.error("Error fetching audio file:", error);
      showToast("Error fetching audio file", "error");
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProject(id);
        setProject(response.data.project);
        setMembers(response.data.project.members || []);
        setSongs(response.data.songs || []);
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
            if (audio.audioFileType.name === "Master") {
              if (audio.signed_url) {
                audioFiles.push({
                  id: audio.id,
                  title: song.title,
                  url: API_BASE_URL + "/" + audio.signed_url,
                });
              }
            }
          }
        }
        setAudioUrls(audioFiles);
        setIsLoadingAudio(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setIsLoadingProfileImage(false);
      }
    };
    fetchProject();
  }, [id, getAudioFile, getProfileImageFile]);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadEvents = async () => {
    try {
      const response = await eventService.getByProject(id);
      setEvents(response.data);
    } catch (error) {
      console.error("Error loading events:", error);
      showToast("Error loading events", "error");
    }
  };

  useEffect(() => {
    loadEvents();
  }, [id]);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEventFormVisible(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsEventFormVisible(true);
  };

  const handleEventFormCancel = () => {
    setIsEventFormVisible(false);
    setSelectedEvent(null);
  };

  const refreshProject = async () => {
    try {
      const response = await projectService.getProject(id);
      const updatedProject = response.data.project;
      setMembers(response.data.project.members || []);
      setSongs(response.data.songs || []);
      setProject(updatedProject);
      if (updatedProject.songs) {
        const audioFiles = [];
        for (const song of updatedProject.songs) {
          for (const audio of song.audioFiles) {
            if (audio.audioFileType.name === "Master") {
              if (audio.signed_url) {
                audioFiles.push({
                  id: audio.id,
                  title: song.title,
                  url: audio.signed_url,
                });
              }
            }
          }
        }
        setAudioUrls(audioFiles);
      }
    } catch (error) {
      console.error("Error refreshing project details:", error);
    }
  };

  const handleAddSong = () => {
    setSelectedSong(null);
    setIsSongFormVisible(true);
    setTimeout(() => {
      if (songFormRef.current) {
        songFormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  };

  const handleEditSong = (song) => {
    setSelectedSong(song);
    setIsSongFormVisible(true);
    setTimeout(() => {
      if (songFormRef.current) {
        songFormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  };

  const handleCancelForm = () => {
    setIsSongFormVisible(false);
    setSelectedSong(null);
  };

  const handleImageClick = () => {
    document.getElementById("image-input").click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profile_image", file);
      formData.append("project_id", project.id);
      try {
        await projectService.updateProfileImage(formData);
        setImage(URL.createObjectURL(file));
        setIsUploading(false);
        showToast("Profile image updated successfully", "success");
      } catch (error) {
        console.error("Error uploading profile picture", error);
        showToast("Error uploading profile picture", "error");
        setIsUploading(false);
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    confirmAlert({
      title: "Delete Member",
      message: "Are you sure you want to remove this member?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await projectService.removeMemberFromProject(id, memberId);
              setMembers(members.filter((member) => member.id !== memberId));
              showToast("Member removed successfully", "success");
            } catch (error) {
              console.error("Error removing member:", error);
              showToast("Failed to remove member. Please try again", "error");
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
            {isUploading || isLoadingProfileImage ? (
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
                onClick={handleImageClick}
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
                <div
                  className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    minWidth: "32px",
                  }}
                >
                  <i className="bi bi-camera-fill text-white"></i>
                </div>
              </div>
            )}
            <input
              type="file"
              id="image-input"
              className="d-none"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <div className="d-flex align-items-start">
                <h1 className="display-6 mb-0">{project.name}</h1>
                {project.isPublic && (
                  <span className="badge bg-success ms-1">Public</span>
                )}
              </div>
              <p className="lead text-muted mb-0">{project.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Members Section */}
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
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <i className="bi bi-person-x"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">
                  <i className="bi bi-people display-4 text-muted"></i>
                  <p className="text-muted mt-2">No members yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Songs Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <CardHeader
              title={"Songs"}
              icon={"bi-music-note-list"}
              actionButton={
                <>
                  <i className="bi bi-plus-lg me-2"></i>
                  Add Song
                </>
              }
              onAction={handleAddSong}
              isDisabled={isSongFormVisible}
            />
            <div className="card-body" ref={songFormRef}>
              {isSongFormVisible && (
                <div className="mb-4">
                  <SongForm
                    song={selectedSong}
                    onSave={() => {
                      setIsSongFormVisible(false);
                      refreshProject();
                    }}
                    onDelete={() => {
                      setIsSongFormVisible(false);
                      refreshProject();
                    }}
                    onCancel={handleCancelForm}
                  />
                </div>
              )}

              {songs && songs.length > 0 ? (
                <div className="row g-3">
                  {songs.map((song) => (
                    <div key={song.id} className="col-md-6">
                      <div className="card h-100 border shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div
                              className="d-flex align-items-center"
                              onClick={() => navigate(`/songs/${song.id}`)}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-music-note fs-4 text-primary me-2"></i>
                              <h6 className="mb-0">{song.title}</h6>
                              {song.isPublic && (
                                <span className="ms-2 badge bg-success">
                                  Public
                                </span>
                              )}
                            </div>
                            <button
                              className="btn btn-light btn-sm rounded-pill"
                              onClick={() => handleEditSong(song)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-music-note-beamed display-4 text-muted"></i>
                  <p className="text-muted mt-2">No songs added yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-12">
            <div className="card shadow-sm mb-3">
              <CardHeader
                title="Events"
                icon="bi-calendar-event"
                actionButton={
                  <>
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Event
                  </>
                }
                onAction={handleAddEvent}
                isDisabled={isEventFormVisible}
              />
              <div className="card-body">
                {isEventFormVisible && (
                  <div className="mb-4">
                    <EventForm
                      event={selectedEvent}
                      projectId={project.id}
                      onSave={() => {
                        setIsEventFormVisible(false);
                        loadEvents();
                        showToast(
                          `Event ${
                            selectedEvent ? "updated" : "created"
                          } successfully`
                        );
                      }}
                      onDelete={() => {
                        setIsEventFormVisible(false);
                        loadEvents();
                        showToast("Event deleted successfully");
                      }}
                      onCancel={handleEventFormCancel}
                    />
                  </div>
                )}

                {events.length > 0 ? (
                  <div className="row">
                    {events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onEdit={handleEditEvent}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-calendar3 display-4 text-muted"></i>
                    <p className="text-muted mt-2">No events scheduled yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audio Player Section */}
          <div>
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
      </div>
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default ProjectDetails;
