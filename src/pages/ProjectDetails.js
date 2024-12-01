import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "../api/projectService";
import SongForm from "../components/SongForm";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isSongFormVisible, setIsSongFormVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProject(id);
        setProject(response.data.project);
        if (response.data.project?.profilImage) {
          setImage(response.data.project.profilImage);
        } else {
          setImage("/default-profile.png");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    fetchProject();
  }, [id]);

  const refreshProject = async () => {
    const response = await projectService.getProject(id);
    setProject(response.data);
  };

  const handleAddSong = () => {
    setSelectedSong(null);
    setIsSongFormVisible(true);
  };

  const handleEditSong = (song) => {
    setSelectedSong(song);
    setIsSongFormVisible(true);
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
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image de profil:", error);
        setIsUploading(false);
      }
    }
  };

  if (!project) {
    return (
      <div className="container mt-5">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center align-items-center mb-5">
        <div
          className="project-profile-image-wrapper"
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
        >
          <img
            className="project-profile-image"
            src={image}
            alt="Project Profile"
          />
        </div>
        {isUploading && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Uploading...</span>
          </div>
        )}
      </div>
      <input
        type="file"
        id="image-input"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageChange}
      />
      <h2 className="text-center mb-3">{project.name}</h2>
      <div className="card mb-3 shadow">
        <div className="card-body">
          <p>
            Explore the specific details of a selected project. On this page,
            you can manage the project’s songs, review its description, and make
            edits to keep everything up to date. Seamlessly navigate between
            associated songs and project information for better organization.
          </p>
        </div>
        <div className="card-footer">
          <p>
            <strong>Project description: </strong>
            {project.description}
          </p>
        </div>
      </div>
      <div className="card shadow mb-3">
        <div className="card-body">
          <h3 className="mb-3">Songs</h3>
          <p>
            This section lists all the songs associated with the current
            project. Here, you can view, edit, or delete existing songs, as well
            as create new ones to expand your project's catalog. Each song can
            be managed individually, allowing you to fine-tune details such as
            lyrics, tablatures, BPM, and scale. Click on a song to dive deeper
            into its specifics and make edits or updates as needed.
          </p>
          <button className="btn btn-success" onClick={handleAddSong}>
            <i className="bi bi-plus-circle me-2"></i> Add Song
          </button>
        </div>
      </div>
      {project.songs && project.songs.length > 0 ? (
        <ul className="list-group">
          {project.songs.map((song) => (
            <li
              key={song.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div
                onClick={() => navigate(`/songs/${song.id}`)}
                style={{ cursor: "pointer", flexGrow: 1 }}
                className="d-flex align-items-center"
              >
                <i className="bi bi-folder me-2 text-primary"></i>
                <span>{song.title}</span>
                <i
                  className="bi bi-info-circle ms-2 text-info"
                  title="Click to view more"
                ></i>
              </div>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => handleEditSong(song)}
              >
                <i className="bi bi-pencil-square me-1"></i> Edit title
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No songs associated with this project yet.</p>
      )}

      {isSongFormVisible && (
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
      )}
    </div>
  );
};

export default ProjectDetails;
