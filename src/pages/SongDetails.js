import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import songService from "../api/songService";
import { API_BASE_URL } from "../api/api";
import { useDropzone } from "react-dropzone";
import "react-quill/dist/quill.snow.css";
import Quill from "../components/Quill";
import { confirmAlert } from "react-confirm-alert";
import Toast from "../components/Toast";
import { tablatureService } from "../api/tablatureService";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const MODES = [
  "Major",
  "Minor",
  "Dorian",
  "Mixolydian",
  "Phrygian",
  "Lydian",
  "Locrian",
];

const SongDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bpm, setBpm] = useState(null);
  const [scale, setScale] = useState(null);
  const [isEditingBpmScale, setIsEditingBpmScale] = useState(false);
  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [isEditingLyrics, setIsEditingLyrics] = useState(false);
  const [audioDescriptions, setAudioDescriptions] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [audioUrls, setAudioUrls] = useState({});

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await songService.getSong(id);
        setSong(response.data);
        setLyrics(response.data.lyrics[0]?.content || "");
        setBpm(response.data.song.bpm || 120);
        setScale(response.data.song.scale || "C Major");
        const initialDescriptions = {};
        response.data.audioFiles.forEach((audio) => {
          initialDescriptions[audio.id] = audio.description || "";
        });
        if (response.data.audioFileTypes.length > 0) {
          setActiveTab(response.data.audioFileTypes[0].id);
        }
        setAudioDescriptions(initialDescriptions);
        const audioFileUrls = {};
        for (const audio of response.data.audioFiles) {
          audioFileUrls[audio.id] = await getAudioFile(audio.path);
        }
        setAudioUrls(audioFileUrls);
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };
    fetchSong();
  }, [id]);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveBpmScale = async () => {
    try {
      await songService.updateSong(song.song.id, { bpm, scale });
      setIsEditingBpmScale(false);
    } catch (error) {
      console.error("Error updating BPM and scale:", error);
    }
  };

  const handleDescriptionChange = (audioId, newDescription) => {
    setAudioDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [audioId]: newDescription,
    }));
  };

  const handleDeleteTablature = (tabId) => {
    confirmAlert({
      title: "Delete Tablature",
      message:
        "Are you sure you want to delete this tablature? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await tablatureService.deleteTablature(tabId);
              const response = await songService.getSong(id);
              setSong(response.data);
              showToast("Tablature deleted successfully", "success");
            } catch (error) {
              console.error("Error deleting tablature:", error);
              showToast("Error deleting tablature.", "error");
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

  const handleDeleteAudioFile = (audioId) => {
    confirmAlert({
      title: "Delete Audio File",
      message:
        "Are you sure you want to delete this audio file? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await songService.deleteAudioFile(audioId);
              const response = await songService.getSong(id);
              setSong(response.data);
              showToast("Audio file deleted successfully", "success");
            } catch (error) {
              console.error("Error deleting audio file:", error);
              showToast("Error deleting audio file.", "error");
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

  const handleLyricsSave = async () => {
    try {
      const payload = { lyrics: lyrics };
      if (!lyrics.trim()) {
        showToast("Lyrics cannot be empty!", "error");
        return;
      }
      console.log("Payload being sent:", payload);
      await songService.updateSong(id, payload);
      setIsEditingLyrics(false);
      const response = await songService.getSong(id);
      setSong(response.data);
    } catch (error) {
      console.error("Error saving lyrics:", error);
    }
  };

  const handleDrop = async (acceptedFiles) => {
    setToastMessage("Uploading files...");
    setToastType("loading");
    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("audioFiles[]", file);
      });
      formData.append("song_id", id);
      formData.append("audio_file_type_id", activeTab);
      await songService.uploadAudioFiles(formData);
      const response = await songService.getSong(id);
      setSong(response.data);
      setToastMessage("Audio files uploaded successfully!");
      setToastType("success");
      const audioFileUrls = {};
      for (const audio of response.data.audioFiles) {
        audioFileUrls[audio.id] = await getAudioFile(audio.path);
      }
      setAudioUrls(audioFileUrls);
    } catch (error) {
      console.error("Error uploading audio files:", error);
      setToastMessage("Failed to upload audio files. Please try again.");
      setToastType("error");
    }
  };

  const handleUpdateAudioDescription = async (audioId) => {
    const newDescription = audioDescriptions[audioId];
    if (!newDescription || newDescription.trim() === "") {
      showToast("Description cannot be empty!", "error");
      return;
    }
    try {
      await songService.updateAudioFile(audioId, {
        description: newDescription,
      });
      const response = await songService.getSong(id);
      console.log(response);
      setSong(response.data);
      showToast("Description updated successfully!", "success");
    } catch (error) {
      console.error("Error updating audio description:", error);
      showToast("Failed to update description. Please try again.", "error");
    }
  };

  const getAudioFile = async (audioFilePath) => {
    try {
      const response = await songService.getAudioFile(audioFilePath);
      const audioUrl = URL.createObjectURL(response.data);
      return audioUrl;
    } catch (error) {
      console.error("Error fetching audio file:", error);
      return null;
    }
  };

  const handleDownloadAudio = async (audioId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/audio/download/${audioId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "audio-file.mp3";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      showToast("Failed to download the file. Please try again.", "error");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "audio/*",
  });

  const handleAudioTypeChange = async (audioId, newTypeId) => {
    setSong((prevSong) => {
      const updatedAudioFiles = prevSong.audioFiles.map((audio) =>
        audio.id === audioId ? { ...audio, type: newTypeId } : audio
      );
      return { ...prevSong, audioFiles: updatedAudioFiles };
    });
    try {
      await songService.updateAudioFile(audioId, {
        audio_file_type_id: newTypeId,
      });
      const response = await songService.getSong(id);
      setSong(response.data);
      showToast("Audio file type updated successfully!", "success");
    } catch (error) {
      console.error("Error updating audio file type:", error);
      showToast("Failed to update audio file type. Please try again.", "error");
    }
  };

  if (!song) {
    return (
      <div className="container mt-5">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{song.song.title}</h2>
      <hr />
      <div className="mb-4">
        <p>
          <b>Created at:</b>{" "}
          {new Date(song.song.created_at).toLocaleDateString()}
        </p>
        <p>
          <b>Updated at:</b>{" "}
          {song.song.updated_at
            ? new Date(song.song.updated_at).toLocaleDateString()
            : "N/A"}
        </p>
        {isEditingBpmScale ? (
          <>
            <div className="mb-3">
              <label htmlFor="bpmInput" className="form-label">
                BPM
              </label>
              <input
                id="bpmInput"
                type="number"
                className="form-control"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                min="20"
                max="280"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="scaleSelect" className="form-label">
                Scale
              </label>
              <select
                id="scaleSelect"
                className="form-select"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
              >
                {NOTES.map((note) =>
                  MODES.map((mode) => (
                    <option key={`${note} ${mode}`} value={`${note} ${mode}`}>
                      {note} {mode}
                    </option>
                  ))
                )}
              </select>
            </div>
            <button
              className="btn btn-success me-2"
              onClick={handleSaveBpmScale}
            >
              <i className="bi bi-save me-1"></i> Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsEditingBpmScale(false)}
            >
              <i className="bi bi-x-circle me-1"></i> Cancel
            </button>
          </>
        ) : (
          <>
            <p>
              <b>BPM:</b> {bpm}
            </p>
            <p>
              <b>Scale:</b> {scale}
            </p>
            <button
              className="btn btn-warning"
              onClick={() => setIsEditingBpmScale(true)}
            >
              <i className="bi bi-pencil-square me-2"></i> Edit BPM & Scale
            </button>
          </>
        )}
      </div>
      <hr />
      <h3 className="mb-3">Lyrics</h3>
      {isEditingLyrics ? (
        <>
          <Quill
            value={lyrics}
            onChange={(content) => setLyrics(content)}
            placeholder="Write your lyrics here..."
            className="quill-editor"
          />
          <button
            className="btn btn-success mt-3 me-2"
            onClick={handleLyricsSave}
          >
            <i className="bi bi-save"></i> Save Lyrics
          </button>
        </>
      ) : lyrics ? (
        <div
          dangerouslySetInnerHTML={{ __html: lyrics }}
          className="border p-3 rounded mb-3"
        ></div>
      ) : (
        <p className="text-muted">No lyrics available for this song.</p>
      )}
      <button
        className="btn btn-warning mt-3"
        onClick={() => setIsEditingLyrics(!isEditingLyrics)}
      >
        <i className="bi bi-pencil-square me-2"></i>
        {isEditingLyrics ? "Cancel" : "Edit Lyrics"}
      </button>
      <hr />
      <h3 className="mt-4 mb-3">Tablatures</h3>
      {song.tablatures.length > 0 ? (
        <ul className="list-group">
          {song.tablatures.map((tab) => (
            <li
              key={tab.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div
                onClick={() =>
                  navigate(`/tablatures/update/${tab.id}/${song.song.id}`)
                }
                style={{ cursor: "pointer", flexGrow: 1 }}
                className="d-flex align-items-center"
              >
                <i className="bi bi-folder me-2 text-primary"></i>
                <span>{tab.title}</span>
                <i
                  className="bi bi-info-circle ms-2 text-info"
                  title="Click to view more"
                ></i>
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteTablature(tab.id)}
              >
                <i className="bi bi-trash-fill"></i> Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center">
          <p className="text-muted mb-1">
            No tablatures available for this song.
          </p>
        </div>
      )}
      <div className="text-center">
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate(`/tablatures/create/${song.song.id}`)}
        >
          <i className="bi bi-plus-circle"></i> Create Tablature
        </button>
      </div>
      <hr />
      <div>
        <ul className="nav nav-pills">
          {song.audioFileTypes.map((type) => (
            <li key={type.id} className="nav-item">
              <a
                className={`nav-link ${activeTab === type.id ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(type.id);
                }}
              >
                {type.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          {song.audioFileTypes.map(
            (type) =>
              activeTab === type.id && (
                <div key={type.id} className="tab-pane fade show active">
                  <h4 className="mt-3 mb-3">{type.name} Files</h4>
                  <ul className="list-group">
                    {song.audioFiles.filter(
                      (audio) => audio.audioFileType.name === type.name
                    ).length === 0 ? (
                      <li className="list-group-item">No such audio file.</li>
                    ) : (
                      song.audioFiles
                        .filter(
                          (audio) => audio.audioFileType.name === type.name
                        )
                        .map((audio) => (
                          <li
                            key={audio.id}
                            className="list-group-item d-flex flex-column"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              {audioUrls[audio.id] ? (
                                <audio controls className="me-3">
                                  <source
                                    src={audioUrls[audio.id]}
                                    type="audio/mpeg"
                                  />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              ) : (
                                <p>Loading audio...</p>
                              )}
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteAudioFile(audio.id)}
                              >
                                <i className="bi bi-trash-fill"></i> Delete
                              </button>
                            </div>
                            <div className="mt-4 d-flex align-items-center">
                              <label
                                htmlFor={`description-${audio.id}`}
                                className="form-label me-2"
                              >
                                <strong> Description:</strong>
                              </label>
                              <input
                                type="text"
                                id={`description-${audio.id}`}
                                className="form-control me-2"
                                value={audioDescriptions[audio.id] || ""}
                                onChange={(e) =>
                                  handleDescriptionChange(
                                    audio.id,
                                    e.target.value
                                  )
                                }
                                placeholder="Add a description for this audio..."
                              />
                            </div>
                            <div className="mt-4 d-flex align-items-center">
                              <label
                                htmlFor={`audio-type-${audio.id}`}
                                className="form-label me-2"
                              >
                                <strong>Change Type:</strong>
                              </label>
                              <select
                                id={`audio-type-${audio.id}`}
                                className="form-select me-2"
                                value={
                                  audio.audioFileType
                                    ? audio.audioFileType.id
                                    : ""
                                }
                                onChange={(e) =>
                                  handleAudioTypeChange(
                                    audio.id,
                                    e.target.value
                                  )
                                }
                              >
                                {song.audioFileTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="mt-4 mb-2 d-flex flex-direction-row justify-content-between">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() =>
                                  handleUpdateAudioDescription(audio.id)
                                }
                              >
                                <i className="bi bi-save me-2"></i>Update
                                description
                              </button>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleDownloadAudio(audio.id)}
                              >
                                <i className="bi bi-download me-2"></i> Download
                              </button>
                            </div>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              )
          )}
        </div>
      </div>
      <div
        {...getRootProps()}
        className="mt-3 p-3 border border-dashed text-center rounded mb-3"
        style={{ cursor: "pointer" }}
      >
        <input {...getInputProps()} />
        <i className="bi bi-upload"></i> Drag and drop audio files here or click
        to upload.
      </div>
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default SongDetails;
