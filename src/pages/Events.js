import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../api/projectService";
import ProjectForm from "../components/ProjectForm";
import CardHeader from "../components/CardHeader";
import { useToast } from "../components/ToastContext";
import { eventService } from "../api/eventService";
import { format } from "date-fns";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await eventService.getPublicEvents();
        setEvents(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
          <i className="bi bi-calendar-event fs-2 text-primary"></i>
        </div>
        <h2 className="mb-3">Public Events</h2>
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <p className="mb-3">
              Discover upcoming non-recurrent events and activities shared by
              public music projects. Stay updated on concerts, album releases,
              jam sessions, workshops, and other key milestones from talented
              artists and collaborative musical endeavors in our community.
            </p>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading events...</span>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-calendar-x display-4 text-muted mb-3 d-block"></i>
          <p className="text-muted">No upcoming events available</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {events.map((event) => (
            <div key={event.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    {/* Date Block */}
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

                    {/* Time & Duration Block */}
                    <div className="d-flex flex-column pe-4">
                      <span className="text-muted small mb-1">
                        <i className="bi bi-hourglass-top me-2"></i>
                        From {format(new Date(event.start_date), "h:mm a")}
                      </span>
                      <span className="text-muted small mb-1">
                        <i className="bi bi-hourglass-bottom me-2"></i>
                        To {format(new Date(event.end_date), "h:mm a")}
                      </span>
                    </div>

                    {/* Location & Project Info Block */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1 text-muted small">
                        <i className="bi bi-geo-alt me-2"></i>
                        <span className="text-truncate">{event.location}</span>
                      </div>
                      <div className="d-flex align-items-center text-muted small">
                        <i className="bi bi-music-note-beamed me-2"></i>
                        <span className="text-truncate">
                          By {event.project.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rest of the card content */}
                  <h5 className="card-title mb-2">{event.name}</h5>
                  <p className="card-text text-muted mb-3 small">
                    {event.description}
                  </p>

                  <button
                    className="btn btn-outline-primary btn-sm w-100"
                    onClick={() =>
                      navigate(`/public-projects/${event.project.id}`)
                    }
                  >
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
