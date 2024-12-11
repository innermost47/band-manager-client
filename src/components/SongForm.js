import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { songService } from "../api/songService";
import { confirmAlert } from "react-confirm-alert";
import { useToast } from "./ToastContext";

const SongForm = ({ song, onSave, onDelete, onCancel }) => {
  const { id: projectId } = useParams();
  const [title, setTitle] = useState(song ? song.title : "");
  const { showToast } = useToast();
  const [isPublic, setIsPublic] = useState(song?.isPublic || false);

  useEffect(() => {
    if (song) {
      setTitle(song.title);
    }
  }, [song]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Title is required.", "error");
      return;
    }
    try {
      if (song) {
        await songService.updateSong(song.id, {
          title,
          project_id: song.project_id,
          is_public: isPublic,
        });
        showToast("Song updated successfully", "success");
        onSave && onSave();
      } else {
        await songService.createSong({
          title,
          project_id: projectId,
          is_public: isPublic,
        });
        showToast("Song created successfully", "success");
        onSave && onSave();
      }
    } catch (err) {
      console.error("Error saving song:", err);
      showToast("Failed to save the song. Please try again.", "error");
    }
  };

  const handleDelete = async () => {
    if (!song) return;
    confirmAlert({
      title: "Delete Song",
      message:
        "Are you sure you want to delete this song? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await songService.deleteSong(song.id);
              showToast("Song deleted successfully", "success");
              onDelete && onDelete();
            } catch (err) {
              console.error("Error deleting song:", err);
              showToast(
                "Failed to delete the song. Please try again.",
                "error"
              );
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
    <div className="mt-4 mb-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <div className="text-center">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3 mt-2"
              style={{ width: "64px", height: "64px" }}
            >
              <i
                className={`bi ${
                  song ? "bi-pencil-square" : "bi-music-note"
                } fs-2 text-primary`}
              ></i>
            </div>
            <h4 className="mb-2">{song ? "Edit Song" : "Add New Song"}</h4>
          </div>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label text-muted small">Song Title</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-music-note text-primary"></i>
                </span>
                <input
                  type="text"
                  id="songTitle"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter your song title..."
                />
              </div>
            </div>

            <div className="mb-4 rounded p-3 border">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-1">Public Visibility</h6>
                  <p className="text-muted small mb-0">
                    Make this song visible to everyone
                  </p>
                </div>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    id="isPublic"
                    className="form-check-input"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                    role="switch"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              {song && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDelete}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                <i
                  className={`bi ${song ? "bi-check-lg" : "bi-plus-lg"} me-2`}
                ></i>
                {song ? "Save Changes" : "Add Song"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SongForm;
