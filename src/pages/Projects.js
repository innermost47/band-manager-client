import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../api/projectService";
import ProjectForm from "../components/ProjectForm";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleFormSave = () => {
    setIsFormVisible(false);
    setSelectedProject(null);
    const fetchProjects = async () => {
      const response = await projectService.getProjects();
      setProjects(Array.isArray(response.data) ? response.data : []);
    };
    fetchProjects();
  };

  const handleFormDelete = () => {
    setIsFormVisible(false);
    setSelectedProject(null);
    const fetchProjects = async () => {
      const response = await projectService.getProjects();
      setProjects(Array.isArray(response.data) ? response.data : []);
    };
    fetchProjects();
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSelectedProject(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-3">Projects</h2>
      <div className="card mb-3 shadow">
        <div className="card-body">
          <p>
            Manage and oversee all your projects in one place. This page
            provides a comprehensive view of all your projects, allowing you to
            create, edit, or delete them effortlessly. Click on any project to
            dive deeper into its details and associated songs.
          </p>
          <button
            className="btn btn-success"
            onClick={() => setIsFormVisible(true)}
          >
            <i className="bi bi-plus-circle me-2"></i> Create New Project
          </button>
        </div>
      </div>
      {isFormVisible && (
        <ProjectForm
          project={selectedProject}
          onSave={handleFormSave}
          onDelete={handleFormDelete}
          onCancel={handleCancelForm}
        />
      )}

      {projects.length === 0 ? (
        <p className="text-center">No projects available. Create one!</p>
      ) : (
        <ul className="list-group">
          {projects.map((project) => (
            <li
              key={project.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{ cursor: "pointer", flexGrow: 1 }}
                className="d-flex align-items-center"
              >
                <i className="bi bi-folder me-2 text-primary"></i>
                <span>
                  {project.name} - {project.description}
                </span>
                <i
                  className="bi bi-info-circle ms-2 text-info"
                  title="Click to view more"
                ></i>
              </div>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => {
                  setSelectedProject(project);
                  setIsFormVisible(true);
                }}
              >
                <i className="bi bi-pencil-square me-1"></i> Edit description
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Projects;
