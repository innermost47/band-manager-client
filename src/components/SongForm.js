import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { songService } from "../api/songService";
import { confirmAlert } from "react-confirm-alert";

const SongForm = ({ song, onSave, onDelete, onCancel }) => {
  const { id: projectId } = useParams();
  const [title, setTitle] = useState(song ? song.title : "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (song) {
      setTitle(song.title);
    }
  }, [song]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      if (song) {
        await songService.updateSong(song.id, {
          title,
          project_id: song.project_id,
        });
        onSave && onSave();
      } else {
        await songService.createSong({ title, project_id: projectId });
        onSave && onSave();
      }
    } catch (err) {
      console.error("Error saving song:", err);
      setError("Failed to save the song. Please try again.");
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
              onDelete && onDelete();
            } catch (err) {
              console.error("Error deleting song:", err);
              setError("Failed to delete the song. Please try again.");
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
    <div className="container mt-5">
      <h2 className="text-center">{song ? "Edit Song" : "Add New Song"}</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="songTitle" className="form-label">
            Song Title
          </label>
          <input
            type="text"
            id="songTitle"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Title of the song..."
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {song ? "Update Song" : "Add Song"}
        </button>
        {song && (
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={handleDelete}
          >
            Delete Song
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default SongForm;
