import { useState } from "react";
import CardHeader from "./CardHeader";
import { useToast } from "./ToastContext";

const JoinProjectForm = ({ onJoin }) => {
  const [invitationCode, setInvitationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invitationCode.trim()) return;

    setIsLoading(true);
    try {
      await onJoin(invitationCode);
      setInvitationCode("");
      showToast("Successfully joined the project!", "success");
    } catch (error) {
      showToast(
        error.response?.data?.error || "Failed to join project",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card shadow">
      <CardHeader title="Join Project" icon="bi-box-arrow-in-right" />
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label text-muted small">
              Invitation Code
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-key text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control text-uppercase"
                placeholder="Enter your invitation code"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                required
                pattern="[A-Za-z0-9]{8}"
                maxLength={8}
              />
            </div>
            <small className="text-muted mt-2 d-block">
              <i className="bi bi-info-circle me-1"></i>
              Enter the 8-character code received in your invitation email
            </small>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center"
              disabled={isLoading || !invitationCode.trim()}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Joining...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Join Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinProjectForm;
