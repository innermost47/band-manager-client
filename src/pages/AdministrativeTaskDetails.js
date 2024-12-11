import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdministrativeTable from "../components/AdministrativeTable";
import { administrativeTaskService } from "../api/administrativeTaskService";
import { confirmAlert } from "react-confirm-alert";
import { useToast } from "../components/ToastContext";

const AdministrativeTaskDetails = () => {
  const { adminTaskId } = useParams();
  const [task, setTask] = useState(null);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await administrativeTaskService.getAdministrativeTask(
          adminTaskId
        );
        setTask(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching administrative task:", error);
        showToast("Error loading administrative task", "error");
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [adminTaskId]);

  const handleUpdateTask = async (updatedTask) => {
    try {
      await administrativeTaskService.updateAdministrativeTask(
        updatedTask.id,
        updatedTask
      );
      setTask(updatedTask);
      showToast("Administrative task updated successfully!", "success");
    } catch (error) {
      console.error("Error updating administrative task:", error);
      showToast("Error updating administrative task.", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    confirmAlert({
      title: "Delete Administrative Task",
      message:
        "Are you sure you want to delete this task? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await administrativeTaskService.deleteAdministrativeTask(taskId);
              navigate("/administrative-tasks");
              showToast("Task deleted successfully", "success");
            } catch (error) {
              console.error("Error deleting administrative task:", error);
              showToast("Error deleting administrative task.", "error");
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

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading task detail...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          No task found or error loading task.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-3">
      <div className="card shadow mb-3">
        <div className="card-header d-flex align-items-center">
          <i className="bi bi-check2-circle me-2 fs-4"></i>
          <h2 className="mb-0">{task?.name || "Untitled Task"}</h2>
        </div>
        <div className="card-body">
          <p className="mb-3">
            <i className="bi bi-file-text me-2 text-secondary"></i>
            <strong>Description:</strong>{" "}
            {task?.description || (
              <span className="text-muted">No description provided.</span>
            )}
          </p>
          <p className="mb-3">
            <i className="bi bi-calendar me-2 text-secondary"></i>
            <strong>Created At:</strong>{" "}
            {task?.created_at
              ? new Date(task.created_at).toLocaleString()
              : "N/A"}
          </p>
          {task?.completed_at && (
            <p className="mb-0">
              <i className="bi bi-check-circle-fill me-2 text-success"></i>
              <strong>Completed At:</strong>{" "}
              {new Date(task.completed_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>
      {task && (
        <AdministrativeTable
          task={task}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default AdministrativeTaskDetails;
