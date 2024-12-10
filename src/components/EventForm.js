import { useState, useEffect } from "react";
import { eventService } from "../api/eventService";
import { confirmAlert } from "react-confirm-alert";
import Toast from "../components/Toast";

const EventForm = ({ event, projectId, onSave, onDelete, onCancel }) => {
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    recurrence_type: "",
    recurrence_interval: 1,
    recurrence_end: "",
    recurrence_days: [],
    project: projectId,
    is_public: false,
  });

  useEffect(() => {
    if (event) {
      try {
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return !isNaN(date.getTime()) ? date.toISOString().slice(0, 16) : "";
        };

        setFormData({
          name: event.name || "",
          description: event.description || "",
          start_date: formatDate(event.start_date),
          end_date: formatDate(event.end_date),
          location: event.location || "",
          recurrence_type: event.recurrence_type || "",
          recurrence_interval: parseInt(event.recurrence_interval) || 1,
          recurrence_end: formatDate(event.recurrence_end),
          recurrence_days: event.recurrence_days || [],
          project: projectId,
          is_public: Boolean(event.is_public),
        });
      } catch (error) {
        console.error("Error formatting dates:", error);
        setFormData({
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          location: "",
          recurrence_type: "",
          recurrence_interval: 1,
          recurrence_end: "",
          recurrence_days: [],
          project: projectId,
          is_public: false,
        });
      }
    }
  }, [event, projectId]);

  const handleTogglePublic = () => {
    setFormData((prev) => ({
      ...prev,
      is_public: !prev.is_public,
    }));
  };

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validateDate = (dateString) => {
        const date = new Date(dateString);
        const minDate = new Date("2000-01-01");
        const maxDate = new Date("2100-12-31");

        if (date < minDate || date > maxDate) {
          throw new Error(
            `Date ${dateString} is out of valid range (2000-2100)`
          );
        }
        return true;
      };

      validateDate(formData.start_date);
      validateDate(formData.end_date);

      if (formData.recurrence_end) {
        validateDate(formData.recurrence_end);
      }

      if (new Date(formData.end_date) <= new Date(formData.start_date)) {
        showToast("End date must be after start date", "error");
        return;
      }

      const dataToSubmit = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        recurrence_end: formData.recurrence_end
          ? new Date(formData.recurrence_end).toISOString()
          : null,
        project: projectId,
        recurrence_interval: parseInt(formData.recurrence_interval) || 1,
      };

      if (event) {
        await eventService.update(event.id, dataToSubmit);
        showToast("Event updated successfully", "success");
      } else {
        await eventService.create(dataToSubmit);
        showToast("Event created successfully", "success");
      }
      onSave();
    } catch (error) {
      console.error("Error saving event:", error);
      showToast(
        error.message || "Error saving event. Please check the dates.",
        "error"
      );
    }
  };

  const handleDelete = () => {
    confirmAlert({
      title: "Delete Event",
      message: "Are you sure you want to delete this event?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await eventService.delete(event.id);
              showToast("Event deleted successfully", "success");
              onDelete();
            } catch (error) {
              console.error("Error deleting event:", error);
              showToast("Error deleting event", "error");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("date") && value) {
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          showToast("Invalid date format", "error");
          return;
        }
      } catch (error) {
        showToast("Error parsing date", "error");
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label text-muted small">Event Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-tag text-primary"></i>
            </span>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name..."
              required
            />
          </div>
        </div>

        <div className="col-12">
          <label className="form-label text-muted small">Description</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-card-text text-primary"></i>
            </span>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description..."
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label text-muted small">
            Start Date & Time
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-calendar-event text-primary"></i>
            </span>
            <input
              type="datetime-local"
              className="form-control"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label text-muted small">End Date & Time</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-calendar-check text-primary"></i>
            </span>
            <input
              type="datetime-local"
              className="form-control"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12">
          <label className="form-label text-muted small">Location</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-geo-alt text-primary"></i>
            </span>
            <input
              type="text"
              className="form-control"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location..."
              required
            />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label text-muted small">Recurrence</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-arrow-repeat text-primary"></i>
            </span>
            <select
              className="form-select"
              name="recurrence_type"
              value={formData.recurrence_type}
              onChange={handleChange}
            >
              <option value="">No Recurrence</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="BI_WEEKLY">Bi-Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </div>

        {formData.recurrence_type && (
          <>
            <div className="col-md-6">
              <label className="form-label text-muted small">
                Repeat Interval
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-clock-history text-primary"></i>
                </span>
                <input
                  type="number"
                  className="form-control"
                  name="recurrence_interval"
                  value={formData.recurrence_interval}
                  onChange={handleChange}
                  placeholder="Enter interval..."
                  min="1"
                />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label text-muted small">
                Recurrence End Date
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-calendar-x text-primary"></i>
                </span>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="recurrence_end"
                  value={formData.recurrence_end}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-1">Event Visibility</h6>
              <p className="text-muted small mb-0">
                Make this event visible if your project is public
              </p>
            </div>
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.is_public}
                onChange={handleTogglePublic}
                role="switch"
              />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onCancel}
            >
              Cancel
            </button>
            {event && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <i className="bi bi-trash me-2"></i>Delete
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-sm">
              <i className="bi bi-check-circle me-2"></i>
              {event ? "Update" : "Create"} Event
            </button>
          </div>
        </div>
      </div>
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </form>
  );
};

export default EventForm;
