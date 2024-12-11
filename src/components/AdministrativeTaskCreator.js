import React, { useState } from "react";
import { COLUMN_TYPES } from "../config/constants";
import ColumnTypesInfo from "./ColumnTypesInfo";
import { useToast } from "./ToastContext";

const AdministrativeTaskCreator = ({ onCreate, projects }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("string");
  const [projectId, setProjectId] = useState("");
  const { showToast } = useToast();

  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      showToast("Column name is required", "error");
      return;
    }
    if (columns.some((col) => col.name === newColumnName)) {
      showToast("A column with this name already exists", "error");
      return;
    }
    setColumns([...columns, { name: newColumnName, type: newColumnType }]);
    setNewColumnName("");
    setNewColumnType("string");
    showToast("Column added successfully", "success");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectId) {
      showToast("Please select a project", "error");
      return;
    }
    const newTask = {
      name,
      description,
      tableStructure: {
        columns: columns.map((col) => col.name),
        columnTypes: columns.map((col) => col.type),
        columnsToTotal: {},
      },
      tableValues: [],
      project_id: projectId,
    };
    onCreate(newTask);
    setName("");
    setDescription("");
    setColumns([]);
  };

  const handleRemoveColumn = (indexToRemove) => {
    setColumns(columns.filter((_, index) => index !== indexToRemove));
    showToast("Column removed successfully", "success");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="taskName" className="form-label">
          Task Name
        </label>
        <input
          type="text"
          id="taskName"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="taskDescription" className="form-label">
          Description
        </label>
        <textarea
          id="taskDescription"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="mb-3">
        <label className="form-label">Columns</label>
        <ColumnTypesInfo></ColumnTypesInfo>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Column Name"
          />
          <select
            className="form-select me-2"
            value={newColumnType}
            onChange={(e) => setNewColumnType(e.target.value)}
          >
            {COLUMN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={handleAddColumn}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Column
          </button>
        </div>
        <>
          {columns.length > 0 ? (
            <div className="table-responsive mt-3">
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>Column Name</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map((col, index) => (
                    <tr key={index}>
                      <td>{col.name}</td>
                      <td>{col.type}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveColumn(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info mt-2">
              No columns added yet. Add your first column above.
            </div>
          )}
        </>
      </div>
      <div className="mb-3">
        <label htmlFor="projectSelect" className="form-label">
          Select Project
        </label>
        <select
          id="projectSelect"
          className="form-select"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary btn-sm">
        <i className="bi bi-save me-2"></i>
        Create
      </button>
    </form>
  );
};

export default AdministrativeTaskCreator;
