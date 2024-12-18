import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import songService from "../api/songService";
import { API_BASE_URL } from "../api/api";
import { useDropzone } from "react-dropzone";
import "react-quill/dist/quill.snow.css";
import Quill from "../components/Quill";
import { confirmAlert } from "react-confirm-alert";
import { tablatureService } from "../api/tablatureService";
import CardHeader from "../components/CardHeader";
import { useToast } from "../components/ToastContext";
import NotFound from "../components/NotFound";

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
  const { showToast } = useToast();
  const [audioUrls, setAudioUrls] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [originalLyrics, setOriginalLyrics] = useState("");

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setIsLoading(true);
        const response = await songService.getSong(id);
        setSong(response.data);
        const initialLyrics = response.data.lyrics[0]?.content || "";
        setLyrics(initialLyrics);
        setOriginalLyrics(initialLyrics);
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
          audioFileUrls[audio.id] = API_BASE_URL + "/" + audio.signed_url;
        }
        setAudioUrls(audioFileUrls);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching song details:", error);
        setIsLoading(false);
      }
    };
    fetchSong();
  }, [id]);

  const handleSaveBpmScale = async (e) => {
    try {
      e.preventDefault();
      await songService.updateSong(song.song.id, { bpm, scale });
      setIsEditingBpmScale(false);
      showToast("BPM and scale updated successfully", "success");
    } catch (error) {
      console.error("Error updating BPM and scale:", error);
      showToast("Error updating BPM and scale", "error");
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
      await songService.updateSong(id, payload);
      setIsEditingLyrics(false);
      const response = await songService.getSong(id);
      setSong(response.data);
      setOriginalLyrics(lyrics);
      showToast("Lyrics updated successfully", "success");
    } catch (error) {
      console.error("Error saving lyrics:", error);
      showToast("Error updating lyrics", "error");
    }
  };

  const handleDrop = async (acceptedFiles) => {
    showToast("Uploading files...", "loading");
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
      showToast("Audio files uploaded successfully!", "success");
      const audioFileUrls = {};
      for (const audio of response.data.audioFiles) {
        audioFileUrls[audio.id] = API_BASE_URL + "/" + audio.signed_url;
      }
      setAudioUrls(audioFileUrls);
    } catch (error) {
      console.error("Error uploading audio files:", error);
      showToast("Failed to upload audio files. Please try again.", "error");
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
      setSong(response.data);
      showToast("Description updated successfully!", "success");
    } catch (error) {
      console.error("Error updating audio description:", error);
      showToast("Failed to update description. Please try again.", "error");
    }
  };

  const handleDownloadAudio = async (audioId, audioType) => {
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
      a.download = (song.song.title + "-" + audioType + ".mp3")
        .toLocaleLowerCase()
        .replace(" ", "_")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
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

  const handleLyricsCancel = () => {
    setLyrics(originalLyrics);
    setIsEditingLyrics(false);
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading song...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && (!song || Object.keys(song).length === 0)) {
    return <NotFound />;
  }

  return (
    <div className="container mt-5 mb-3">
      {/* En-tête de la chanson */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card shadow mb-3">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h1 className="display-5">{song.song.title}</h1>
              </div>
              <hr className="my-4" />
              <div className="row g-4 justify-content-center">
                <div className="col-md-5">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        minWidth: "32px",
                      }}
                    >
                      <i className="bi bi-calendar-date text-primary"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Created</small>
                      <span className="fs-6">
                        {new Date(song.song.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        minWidth: "32px",
                      }}
                    >
                      <i className="bi bi-clock-history text-primary"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Last updated</small>
                      <span className="fs-6">
                        {song.song.updated_at
                          ? new Date(song.song.updated_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Section BPM et Scale */}
        <div className="col-md-6">
          <div className="card shadow h-100">
            <CardHeader
              title={"Musical Properties"}
              icon={"bi-music-note"}
              actionButton={
                <>
                  <i className="bi bi-pencil me-1"></i> Edit
                </>
              }
              onAction={() => setIsEditingBpmScale(true)}
              isDisabled={isEditingBpmScale}
            />
            <div className="card-body">
              {isEditingBpmScale ? (
                <form>
                  <div className="mb-3">
                    <label className="form-label">BPM</label>
                    <input
                      type="number"
                      className="form-control"
                      value={bpm}
                      onChange={(e) => setBpm(Number(e.target.value))}
                      min="20"
                      max="280"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Scale</label>
                    <select
                      className="form-select"
                      value={scale}
                      onChange={(e) => setScale(e.target.value)}
                    >
                      {NOTES.map((note) =>
                        MODES.map((mode) => (
                          <option
                            key={`${note} ${mode}`}
                            value={`${note} ${mode}`}
                          >
                            {note} {mode}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveBpmScale}
                    >
                      <i className="bi bi-check-lg me-1"></i> Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsEditingBpmScale(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <div>
                    <small className="text-muted d-block">BPM</small>
                    <span className="fs-5">{bpm}</span>
                  </div>
                  <div>
                    <small className="text-muted d-block">Scale</small>
                    <span className="fs-5">{scale}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Lyrics */}
        <div className="col-md-6">
          <div className="card shadow h-100">
            <CardHeader
              title={"Lyrics"}
              icon={"bi-file-text"}
              actionButton={
                <>
                  <i className={`bi bi-pencil me-1`}></i>
                  Edit
                </>
              }
              onAction={() => setIsEditingLyrics(true)}
              isDisabled={isEditingLyrics}
            />
            <div className="card-body">
              {isEditingLyrics ? (
                <>
                  <Quill
                    value={lyrics}
                    onChange={setLyrics}
                    placeholder="Write your lyrics here..."
                    className="quill-editor mb-3"
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleLyricsSave}
                  >
                    <i className="bi bi-check-lg me-1"></i> Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm ms-2"
                    onClick={handleLyricsCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div className="lyrics-content">
                  {lyrics ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: lyrics.replace(/<p/g, '<p class="mb-0"'),
                      }}
                    ></div>
                  ) : (
                    <p className="text-muted">No lyrics available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Tablatures */}
        <div className="col-12">
          <div className="card shadow">
            <CardHeader
              title={"Tablatures"}
              icon={"bi-file-music"}
              actionButton={
                <>
                  <i className="bi bi-plus-lg me-1"></i> Create
                </>
              }
              onAction={() => navigate(`/tablatures/create/${song.song.id}`)}
            />
            <div className="card-body">
              {song.tablatures.length > 0 ? (
                <div className="row g-3">
                  {song.tablatures.map((tab) => (
                    <div key={tab.id} className="col-md-6">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <div
                              className="d-flex align-items-center"
                              onClick={() =>
                                navigate(
                                  `/tablatures/update/${tab.id}/${song.song.id}`
                                )
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-file-music me-2 text-primary"></i>
                              <h6 className="mb-0">{tab.title}</h6>
                            </div>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-pill"
                              onClick={() => handleDeleteTablature(tab.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-file-music display-4 text-muted"></i>
                  <p className="text-muted mt-2">No tablatures available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Audio Files */}
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header border-0">
              <ul className="nav nav-pills">
                {song.audioFileTypes.map((type) => (
                  <li key={type.id} className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === type.id ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(type.id)}
                    >
                      {type.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-body">
              {song.audioFileTypes.map(
                (type) =>
                  activeTab === type.id && (
                    <div key={type.id}>
                      {song.audioFiles.filter(
                        (audio) => audio.audioFileType.name === type.name
                      ).length === 0 ? (
                        <div className="text-center py-4">
                          <i className="bi bi-music-note-beamed display-4 text-muted"></i>
                          <p className="text-muted mt-2">
                            No audio files available
                          </p>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {song.audioFiles
                            .filter(
                              (audio) => audio.audioFileType.name === type.name
                            )
                            .map((audio) => (
                              <div key={audio.id} className="col-12">
                                <div className="card">
                                  <div className="card-body">
                                    <div className="row g-3">
                                      <div className="col-md-6">
                                        {audioUrls[audio.id] ? (
                                          <audio controls className="w-100">
                                            <source
                                              src={audioUrls[audio.id]}
                                              type="audio/mpeg"
                                            />
                                            Your browser does not support the
                                            audio element.
                                          </audio>
                                        ) : (
                                          <div className="text-center">
                                            <div
                                              className="spinner-border text-primary"
                                              role="status"
                                            >
                                              <span className="visually-hidden">
                                                Loading...
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Description
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={
                                              audioDescriptions[audio.id] || ""
                                            }
                                            onChange={(e) =>
                                              handleDescriptionChange(
                                                audio.id,
                                                e.target.value
                                              )
                                            }
                                            placeholder="Add a description..."
                                          />
                                        </div>
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Type
                                          </label>
                                          <select
                                            className="form-select"
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
                                              <option
                                                key={type.id}
                                                value={type.id}
                                                selected={
                                                  type.name ===
                                                  audio.audioFileType.name
                                                }
                                              >
                                                {type.name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="d-flex gap-2">
                                          <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() =>
                                              handleUpdateAudioDescription(
                                                audio.id
                                              )
                                            }
                                          >
                                            <i className="bi bi-check-lg me-1"></i>{" "}
                                            Update
                                          </button>
                                          <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() =>
                                              handleDownloadAudio(
                                                audio.id,
                                                audio.audioFileType.name
                                              )
                                            }
                                          >
                                            <i className="bi bi-download me-1"></i>{" "}
                                            Download
                                          </button>
                                          <button
                                            className="btn btn-outline-danger btn-sm ms-auto"
                                            onClick={() =>
                                              handleDeleteAudioFile(audio.id)
                                            }
                                          >
                                            <i className="bi bi-trash"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )
              )}
              <div
                {...getRootProps()}
                className="mt-4 border border-primary border-dashed rounded p-4 text-center"
                style={{ cursor: "pointer" }}
              >
                <input {...getInputProps()} />
                <i className="bi bi-cloud-upload display-4 text-primary"></i>
                <p className="mt-2 mb-0">
                  Drag and drop audio files here or click to upload
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
