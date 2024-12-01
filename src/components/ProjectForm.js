import { useState } from "react";
import { projectService } from "../api/projectService";
import { confirmAlert } from "react-confirm-alert";

const ProjectForm = ({ project, onSave, onDelete, onCancel }) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      const data = {
        name,
        description,
      };

      if (project) {
        await projectService.updateProject(project.id, data);
      } else {
        await projectService.createProject(data);
      }
      onSave && onSave();
    } catch (error) {
      setError("An error occurred. Please try again.");
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
              setError("Failed to delete the project.");
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
    <div className="container mt-5">
      <h2 className="text-center">
        {project ? "Edit Project" : "Create Project"}
      </h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Project Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter project name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {project ? "Update Project" : "Create Project"}
        </button>
        {project && (
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={handleDelete}
          >
            Delete Project
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
