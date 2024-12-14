import { React } from "react";

const EventCard = ({ event, onEdit }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="col-md-6 mb-3">
      <div className="card h-100 border shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h5 className="mb-0">{event.name}</h5>
              {event.is_public && (
                <span className="badge bg-success ms-2">Public</span>
              )}
            </div>
            <div>
              {" "}
              <button
                className="btn btn-light btn-sm rounded-circle"
                onClick={() => onEdit(event)}
              >
                <i className="bi bi-pencil"></i>
              </button>
            </div>
          </div>

          <div className="mt-3">
            <div className="d-flex align-items-center text-muted mb-2">
              <i className="bi bi-clock text-primary me-2"></i>
              <div>
                <div>{formatDate(event.start_date)}</div>
                <div>→ {formatDate(event.end_date)}</div>
              </div>
            </div>

            {event.recurrence_type && (
              <div className="d-flex align-items-center text-muted mb-2">
                <i className="bi bi-arrow-repeat text-primary me-2"></i>
                <span>
                  Repeats {event.recurrence_type.toLowerCase()}
                  {event.recurrence_interval > 1 &&
                    ` every ${
                      event.recurrence_interval
                    } ${event.recurrence_type.toLowerCase()}`}
                  {event.recurrence_end &&
                    ` until ${formatDate(event.recurrence_end)}`}
                </span>
              </div>
            )}

            <div className="d-flex align-items-center text-muted mb-2">
              <i className="bi bi-geo-alt text-primary me-2"></i>
              <span>{event.location}</span>
            </div>

            <div className="d-flex text-muted mt-3">
              <i className="bi bi-card-text text-primary me-2"></i>
              <p className="mb-0">{event.description}</p>
            </div>
          </div>

          {event.recurrence_type && (
            <div className="mt-3 pt-3 border-top">
              <span className="badge bg-info">
                <i className="bi bi-calendar-check me-1"></i>
                Recurring Event
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
