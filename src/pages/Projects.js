import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../api/projectService";
import ProjectForm from "../components/ProjectForm";
import Toast from "../components/Toast";
import CardHeader from "../components/CardHeader";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [publicProjects, setPublicProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const projectFormRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await projectService.getProjects();
        setProjects(Array.isArray(response.data) ? response.data : []);
        const publicProjectsResponse = await projectService.getPublicProjects();
        setPublicProjects(
          Array.isArray(publicProjectsResponse.data)
            ? publicProjectsResponse.data
            : []
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFormSave = async () => {
    try {
      setIsLoading(true);
      setIsFormVisible(false);
      setSelectedProject(null);
      const fetchProjects = async () => {
        const response = await projectService.getProjects();
        setProjects(Array.isArray(response.data) ? response.data : []);
      };
      await fetchProjects();
      const publicProjectsResponse = await projectService.getPublicProjects();
      setPublicProjects(
        Array.isArray(publicProjectsResponse.data)
          ? publicProjectsResponse.data
          : []
      );
      showToast("Project saved successfully", "success");
    } catch (error) {
      console.error("Error saving the project:", error);
      showToast("Error saving the project", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormDelete = async () => {
    try {
      setIsLoading(true);
      setIsFormVisible(false);
      setSelectedProject(null);
      const fetchProjects = async () => {
        const response = await projectService.getProjects();
        setProjects(Array.isArray(response.data) ? response.data : []);
      };
      await fetchProjects();
      const publicProjectsResponse = await projectService.getPublicProjects();
      setPublicProjects(
        Array.isArray(publicProjectsResponse.data)
          ? publicProjectsResponse.data
          : []
      );
      showToast("Project deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting the project:", error);
      showToast("Error deleting the project", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFormVisible && projectFormRef.current) {
      projectFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isFormVisible]);

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSelectedProject(null);
  };

  return (
    <div className="container mt-5 mb-3">
      {/* En-tête avec description */}
      <div className="text-center mb-4">
        <div
          className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
          }}
        >
          <i className="bi bi-folder fs-2 text-primary"></i>
        </div>
        <h2 className="mb-3">Projects</h2>
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <p className="mb-3">
              Manage your projects and explore public collaborations
              efficiently. Create, edit, and organize all your work in one
              place.
            </p>
            <button
              className={`btn btn-primary rounded-pill`}
              onClick={() => setIsFormVisible(true)}
              disabled={isFormVisible}
            >
              <i className={`bi bi-plus-circle me-2`}></i>Create New Project
            </button>
          </div>
        </div>
      </div>
      <div ref={projectFormRef}>
        {isFormVisible && (
          <ProjectForm
            project={selectedProject}
            onSave={handleFormSave}
            onDelete={handleFormDelete}
            onCancel={handleCancelForm}
          />
        )}
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading projects...</span>
          </div>
        </div>
      ) : (
        <>
          {/* My Projects Section */}
          <div className="card shadow-sm mb-4">
            <CardHeader
              title="My Projects"
              icon="bi-folder"
              span={projects.length > 0 ? projects.length : null}
            />
            <div className="card-body">
              {projects.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-folder-x display-4 text-muted mb-3"></i>
                  <p className="text-muted mb-4">
                    No projects available. Start by creating one!
                  </p>
                  <button
                    className={`btn btn-primary rounded-pill`}
                    onClick={() => setIsFormVisible(true)}
                    disabled={isFormVisible}
                  >
                    <i className={`bi bi-plus-circle me-2`}></i>Create Your
                    First Project
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {projects.map((project) => (
                    <div key={project.id} className="col-md-6">
                      <div className="card h-100 border">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div
                              className="d-flex align-items-center"
                              onClick={() =>
                                navigate(`/projects/${project.id}`)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className="rounded-circle bg-primary bg-opacity-10 p-2 me-3 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  minWidth: "40px",
                                }}
                              >
                                <i className="bi bi-folder fs-5 text-primary"></i>
                              </div>
                              <div>
                                <h6 className="mb-0">{project.name}</h6>
                                {project.isPublic && (
                                  <span className="badge bg-success">
                                    Public
                                  </span>
                                )}
                                <p className="text-muted small mt-1 mb-0">
                                  {project.description}
                                </p>
                              </div>
                            </div>
                            <button
                              className="btn btn-light btn-sm rounded-circle"
                              onClick={() => {
                                setSelectedProject(project);
                                setIsFormVisible(true);
                              }}
                            >
                              <i className="bi bi-pencil text-primary"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Public Projects Section */}
          <div className="card shadow-sm">
            <CardHeader
              title="Public Projects"
              icon="bi-globe"
              span={publicProjects.length > 0 ? publicProjects.length : null}
            />
            <div className="card-body">
              {publicProjects.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-folder-x display-4 text-muted mb-3"></i>
                  <p className="text-muted">
                    No public projects available at the moment
                  </p>
                </div>
              ) : (
                <div className="row g-3">
                  {publicProjects.map((project) => (
                    <div key={project.id} className="col-md-6">
                      <div
                        className="card h-100 border"
                        onClick={() =>
                          navigate(`/public-projects/${project.id}`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle bg-primary bg-opacity-10 p-2 me-3 d-flex align-items-center justify-content-center"
                              style={{
                                width: "40px",
                                height: "40px",
                                minWidth: "40px",
                              }}
                            >
                              <i className="bi bi-globe fs-5 text-primary"></i>
                            </div>
                            <div>
                              <h6 className="mb-1">{project.name}</h6>
                              <p className="text-muted small mb-0">
                                {project.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default Projects;
