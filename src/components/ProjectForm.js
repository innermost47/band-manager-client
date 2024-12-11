import { useState } from "react";
import { projectService } from "../api/projectService";
import { confirmAlert } from "react-confirm-alert";
import { useToast } from "./ToastContext";

const ProjectForm = ({ project, onSave, onDelete, onCancel }) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const { showToast } = useToast();
  const [isPublic, setIsPublic] = useState(project?.isPublic || false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Project name is required.", "error");
      return;
    }

    try {
      const data = {
        name,
        description,
        isPublic,
      };

      if (project) {
        await projectService.updateProject(project.id, data);
      } else {
        await projectService.createProject(data);
      }
      onSave && onSave();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        showToast(
          err.response.data.error || "An error occurred. Please try again.",
          "error"
        );
      } else {
        showToast("An error occurred. Please try again.", "error");
      }
    }
  };

  const handleDelete = () => {
    if (!project) return;

    confirmAlert({
      title: "Delete Project",
      message:
        "Are you sure you want to delete this project? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await projectService.deleteProject(project.id);
              onDelete && onDelete();
            } catch (error) {
              showToast("Failed to delete the project.", "error");
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

  return (
    <div className="mt-4 mb-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <div className="text-center">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3 mt-2"
              style={{ width: "64px", height: "64px" }}
            >
              <i
                className={`bi ${
                  project ? "bi-pencil-square" : "bi-folder-plus"
                } fs-2 text-primary`}
              ></i>
            </div>
            <h4 className="mb-2">
              {project ? "Edit Project" : "Create New Project"}
            </h4>
          </div>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label text-muted small">
                Project Name
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-pencil text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your project name..."
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted small">Description</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-textarea-resize text-primary"></i>
                </span>
                <textarea
                  className="form-control"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project..."
                ></textarea>
              </div>
            </div>

            <div className="mb-4 rounded p-3 border">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-1">Public Visibility</h6>
                  <p className="text-muted small mb-0">
                    Make this project visible to everyone
                  </p>
                </div>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    id="isPublic"
                    className="form-check-input"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                    role="switch"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              {project && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDelete}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary  btn-sm">
                <i
                  className={`bi ${
                    project ? "bi-check-lg" : "bi-plus-lg"
                  } me-2`}
                ></i>
                {project ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
