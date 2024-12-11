import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdministrativeTaskCreator from "../components/AdministrativeTaskCreator";
import { administrativeTaskService } from "../api/administrativeTaskService";
import CardHeader from "../components/CardHeader";
import { useToast } from "../components/ToastContext";

const AdministrativeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdministrativeTasks = async () => {
      try {
        setIsLoading(true);
        const response =
          await administrativeTaskService.getAdministrativeTasks();
        setTasks(Array.isArray(response.data.tasks) ? response.data.tasks : []);
        setProjects(
          Array.isArray(response.data.projects) ? response.data.projects : []
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching administrative tasks:", error);
        setIsLoading(false);
      }
    };
    fetchAdministrativeTasks();
  }, []);

  const handleCreateTask = async (newTask) => {
    try {
      setIsLoading(true);
      const response = await administrativeTaskService.createAdministrativeTask(
        newTask
      );
      setTasks([...tasks, response.data]);
      showToast("Administrative task created successfully!", "success");
      setShowCreator(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating administrative task:", error);
      showToast("Error creating administrative task.", "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-3">
      <div className="text-center mb-4">
        <div
          className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
          }}
        >
          <i className="bi bi-list-check fs-2 text-primary"></i>
        </div>
        <h2 className="mb-3">Administrative Tasks</h2>
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <p className="mb-3">
              Manage and track your administrative tasks efficiently
            </p>
            <button
              className={`btn ${
                showCreator ? "btn-outline-secondary" : "btn-primary"
              } rounded-pill`}
              onClick={() => setShowCreator(!showCreator)}
            >
              <i
                className={`bi ${
                  showCreator ? "bi-x-circle" : "bi-plus-circle"
                } me-2`}
              ></i>
              {showCreator ? "Cancel Creation" : "Create New Task"}
            </button>
          </div>
        </div>
      </div>
      {showCreator && (
        <div className="card shadow-sm mb-4">
          <div className="card-header border-0">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-primary bg-opacity-10 me-2 d-flex align-items-center justify-content-center"
                style={{
                  width: "32px",
                  height: "32px",
                  minWidth: "32px",
                }}
              >
                <i className="bi bi-plus-circle fs-5 text-primary"></i>
              </div>
              <h5 className="mb-0">New Administrative Task</h5>
            </div>
          </div>
          <div className="card-body">
            <AdministrativeTaskCreator
              onCreate={handleCreateTask}
              projects={projects}
            />
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading projects...</span>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-clipboard-x display-3 text-muted"></i>
          <h4 className="text-muted fw-light mb-3">No administrative tasks</h4>
          <p className="text-secondary mb-4">
            Get started by creating your first administrative task
          </p>
          <button
            className="btn btn-primary rounded-pill"
            onClick={() => setShowCreator(true)}
            disabled={showCreator}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create New Task
          </button>
        </div>
      ) : (
        <div className="card shadow">
          <CardHeader
            title="Tasks in Progress"
            icon="bi-list-task"
            span={tasks.length > 0 ? tasks.length : null}
          />
          <div className="card-body p-0">
            {tasks.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-clipboard-x display-4 text-muted mb-3"></i>
                <p className="text-muted">No tasks in progress</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="list-group-item list-group-item-action p-3"
                    onClick={() => navigate(`/administrative-tasks/${task.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 p-2 me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          minWidth: "40px",
                        }}
                      >
                        <i className="bi bi-folder text-primary"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold">{task.project.name}</span>
                          <span className="badge bg-primary">
                            {task.status}
                          </span>
                        </div>
                        <div className="text-muted small">
                          {task.name} - {task.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrativeTasks;
