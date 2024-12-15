import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AudioPlayerComponent from "../components/AudioPlayerComponent";
import { projectService } from "../api/projectService";
import { API_BASE_URL } from "../api/api";

const PublicMusicLibrary = () => {
  const audioPlayerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const navigate = useNavigate();
  const [playerHeight, setPlayerHeight] = useState(400);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const initialHeightRef = useRef(0);

  const handleDragStart = useCallback(
    (clientY) => {
      isDraggingRef.current = true;
      startYRef.current = clientY;
      initialHeightRef.current = playerHeight;
    },
    [playerHeight]
  );

  const handleDragMove = useCallback((clientY) => {
    if (isDraggingRef.current) {
      const deltaY = startYRef.current - clientY;
      const windowHeight = window.innerHeight;
      const newHeight = initialHeightRef.current + deltaY;
      setPlayerHeight(Math.min(Math.max(newHeight, 200), windowHeight * 0.8));
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      handleDragMove(e.clientY);
    },
    [handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleDragEnd, handleMouseMove]);

  const handleMouseDown = useCallback(
    (e) => {
      handleDragStart(e.clientY);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleDragStart, handleMouseMove, handleMouseUp]
  );

  const handleTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      handleDragStart(touch.clientY);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientY);
    },
    [handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const formatAudioData = (project) => {
    return project.songs.map((song) => ({
      id: song.audioFile.id,
      url: API_BASE_URL + "/" + song.audioFile.signed_url,
      title: song.title || "Untitled",
      artist: project.name,
      project_id: project.id,
      duration: song.audioFile.duration,
    }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await projectService.getPublicSongs();
        setProjects(response.data);
        const allSongs = response.data.flatMap((project) =>
          project.songs.map((song) => ({
            id: song.audioFile.id,
            url: API_BASE_URL + "/" + song.audioFile.signed_url,
            title: song.title || "Untitled",
            artist: project.name,
            project_id: project.id,
            duration: song.audioFile.duration,
          }))
        );
        setCurrentPlaylist(allSongs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handlePlaySong = (songData) => {
    setCurrentPlaylist([songData]);
    setTimeout(() => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.play();
      }
    }, 100);
  };

  const handlePlayAll = (project) => {
    const projectSongs = formatAudioData(project);
    setCurrentPlaylist(projectSongs);
    setTimeout(() => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.play();
      }
    }, 100);
  };

  const handlePlayAllProjects = () => {
    const allSongs = projects.flatMap(formatAudioData);
    setCurrentPlaylist(allSongs);
    setTimeout(() => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.play();
      }
    }, 100);
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar Navigation */}
        <div
          className="col-md-3 col-xl-2 border-end p-0"
          style={{
            height: window.innerWidth >= 768 ? "calc(100vh - 56px)" : "auto",
            maxHeight: window.innerWidth < 768 ? "200px" : "calc(100vh - 56px)",
            overflowY: "auto",
          }}
        >
          <div className="p-3">
            <h5 className="mb-2 d-flex align-items-center fs-6">
              <i className="bi bi-music-note-list me-2"></i>
              Music Library
            </h5>
            {isLoading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="nav flex-column">
                <button
                  className="btn btn-primary btn-sm mb-2 w-100 py-1"
                  onClick={handlePlayAllProjects}
                >
                  <i className="bi bi-play-circle-fill me-1"></i>
                  Play All
                </button>
                <div className="mb-1 text-muted small text-uppercase">
                  Projects
                </div>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`nav-link d-flex align-items-center py-2 ${
                      selectedProject?.id === project.id
                        ? "active bg-primary bg-opacity-10 rounded"
                        : ""
                    }`}
                    onClick={() => setSelectedProject(project)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="me-2">
                      {/* {project.profileImage ? (
                        <img
                          src={project.profileImage}
                          alt={project.name}
                          className="rounded"
                          width="24"
                          height="24"
                        />
                      ) : ( */}
                      <div
                        className="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center"
                        style={{ width: 24, height: 24 }}
                      >
                        <i className="bi bi-music-note text-primary small"></i>
                      </div>
                      {/* )} */}
                    </div>
                    <div className="flex-grow-1 text-truncate">
                      <div className="fw-medium small">{project.name}</div>
                      <small className="text-muted">
                        {project.songs.length} tracks
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div
          className="col-md-9 col-xl-10 p-4"
          style={{ height: "calc(100vh - 56px)", overflowY: "auto" }}
        >
          {selectedProject ? (
            <>
              {/* Project Header */}
              <div className="d-flex align-items-center mb-4">
                <div
                  className="bg-primary bg-opacity-10 rounded-3 p-4 me-4"
                  style={{ width: 150, height: 150 }}
                >
                  {/* {selectedProject.profileImage ? (
                    <img
                      src={selectedProject.profileImage}
                      alt={selectedProject.name}
                      className="w-100 h-100 object-fit-cover rounded-3"
                    />
                  ) : ( */}
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <i className="bi bi-music-note-beamed display-1 text-primary"></i>
                  </div>
                  {/* )} */}
                </div>
                <div>
                  <div className="text-uppercase text-muted small mb-1">
                    Project
                  </div>
                  <h2 className="mb-2">{selectedProject.name}</h2>
                  <p className="text-muted mb-3">
                    {selectedProject.description}
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePlayAll(selectedProject)}
                    >
                      <i className="bi bi-play-fill me-2"></i>
                      Play All
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        navigate(`/public-projects/${selectedProject.id}`)
                      }
                    >
                      <i className="bi bi-info-circle me-2"></i>
                      View Project
                    </button>
                  </div>
                </div>
              </div>

              {/* Songs List */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Available Tracks</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th style={{ width: 50 }}>#</th>
                          <th>Title</th>
                          <th>Duration</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.songs.map((song, index) => (
                          <tr key={song.id} style={{ cursor: "pointer" }}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="bg-primary bg-opacity-10 rounded me-3 p-2"
                                  style={{ width: 40, height: 40 }}
                                >
                                  <i className="bi bi-music-note text-primary"></i>
                                </div>
                                <div>
                                  <div>{song.title}</div>
                                  <small className="text-muted">
                                    {selectedProject.name}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              {song.audioFile.duration
                                ? `${Math.floor(
                                    song.audioFile.duration / 60
                                  )}:${String(
                                    Math.floor(song.audioFile.duration % 60)
                                  ).padStart(2, "0")}`
                                : "--:--"}
                            </td>
                            <td>
                              <button
                                className="btn btn-link text-primary"
                                onClick={() => {
                                  const songData = {
                                    id: song.audioFile.id,
                                    url:
                                      API_BASE_URL +
                                      "/" +
                                      song.audioFile.signed_url,
                                    title: song.title || "Untitled",
                                    artist: selectedProject.name,
                                    project_id: selectedProject.id,
                                  };
                                  handlePlaySong(songData);
                                }}
                              >
                                <i className="bi bi-play-circle"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="display-1 text-primary mb-4">
                <i className="bi bi-music-note-beamed"></i>
              </div>
              <h3>Welcome to the Music Library</h3>
              <p className="text-muted">
                Select a project from the sidebar or click "Play All" to start
                listening
              </p>
            </div>
          )}
        </div>
      </div>

      {currentPlaylist.length > 0 && (
        <div
          className="position-fixed bottom-0 start-0 w-100 border-top bg-body"
          style={{ height: `${playerHeight}px` }}
        >
          <div
            className="d-flex justify-content-center bg-white"
            style={{
              cursor: "ns-resize",
              padding: "1px",
              touchAction: "none",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="bg-secondary rounded"
              style={{ width: "75px", height: "3px" }}
            />
          </div>
          <div style={{ height: "calc(100% - 12px)", overflowY: "auto" }}>
            <AudioPlayerComponent
              ref={audioPlayerRef}
              audioUrls={currentPlaylist}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMusicLibrary;
