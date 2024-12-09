import React, { useState } from "react";
import { COLUMN_TYPES } from "../config/constants";
import ColumnTypesInfo from "./ColumnTypesInfo";

const AdministrativeTaskCreator = ({ onCreate, projects }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("string");
  const [projectId, setProjectId] = useState("");

  const handleAddColumn = () => {
    if (newColumnName) {
      setColumns([...columns, { name: newColumnName, type: newColumnType }]);
      setNewColumnName("");
      setNewColumnType("string");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      name,
      description,
      tableStructure: { columns, COLUMN_TYPES },
      tableValues: [],
      project_id: projectId,
    };
    onCreate(newTask);
    setName("");
    setDescription("");
    setColumns([]);
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
        {columns.length > 0 && (
          <ul className="list-group mt-2">
            {columns.map((col, index) => (
              <li key={index} className="list-group-item">
                {col.name} ({col.type})
              </li>
            ))}
          </ul>
        )}
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
