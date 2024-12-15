import { format } from "date-fns";

const EventList = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading events...</span>
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-calendar-x display-4 text-muted"></i>
        <p className="text-muted mt-2">No upcoming events scheduled</p>
      </div>
    );
  }

  return (
    <div>
      {events.map((event) => (
        <div key={event.id} className="mb-3 card">
          <div className="d-flex gap-4 p-3 bg-body rounded hover-bg">
            <div
              className="text-center border-end pe-4"
              style={{ minWidth: "80px" }}
            >
              <div className="text-primary small text-uppercase">
                {format(new Date(event.start_date), "MMM")}
              </div>
              <div className="fs-2 fw-bold">
                {format(new Date(event.start_date), "dd")}
              </div>
            </div>
            <div className="col-md-3 border-end pe-4">
              <div className="d-flex align-items-center mb-2">
                <h5 className="mb-0">{event.name}</h5>
                {event.recurrence_type && (
                  <span className="badge bg-info ms-2 rounded-pill">
                    <i className="bi bi-arrow-repeat me-1"></i>
                    {event.recurrence_type.toLowerCase()}
                  </span>
                )}
              </div>

              <div className="text-muted mb-1">
                <i className="bi bi-clock me-2"></i>
                {format(new Date(event.start_date), "HH:mm")} →{" "}
                {format(new Date(event.end_date), "HH:mm")}
              </div>

              <div className="text-muted">
                <i className="bi bi-geo-alt me-2"></i>
                {event.location}
              </div>
            </div>

            <div className="flex-grow-1 ps-2">
              <p className="text-muted mb-0">
                {event.description.length > 200
                  ? `${event.description.substring(0, 200)}...`
                  : event.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
