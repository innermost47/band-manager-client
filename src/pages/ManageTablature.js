import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { tablatureService } from "../api/tablatureService";
import TablatureEditor from "../components/TablatureEditor";
import Toast from "../components/Toast";

const ManageTablature = () => {
  const { songId, tabId } = useParams();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [instrument, setInstrument] = useState("");
  const [content, setContent] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  const isUpdate = !location.pathname.includes("create");

  useEffect(() => {
    if (isUpdate && tabId) {
      const fetchTab = async () => {
        try {
          const response = await tablatureService.getTablature(tabId);
          setTitle(response.data.title);
          setInstrument(response.data.instrument);
          setContent(response.data.content || "");
        } catch (error) {
          console.error("Error fetching tablature:", error);
          showToast("Error fetching tablature.", "error");
        }
      };

      fetchTab();
    }
  }, [isUpdate, tabId]);

  const handleSave = async (updatedContent) => {
    if (!title || !instrument) {
      showToast(
        "Title and instrument are required to save the tablature.",
        "error"
      );
      return;
    }
    try {
      if (isUpdate) {
        await tablatureService.updateTablature(tabId, {
          song_id: songId,
          title,
          content: updatedContent,
          instrument,
        });
        showToast("Tablature updated successfully!", "success");
        navigate(`/songs/${songId}`);
      } else {
        await tablatureService.createTablature({
          song_id: songId,
          title,
          content: updatedContent,
          instrument,
        });
        showToast("Tablature created successfully!", "success");
        navigate(`/songs/${songId}`);
      }
    } catch (error) {
      console.error("Error saving tablature:", error);
      showToast(
        "An error occurred while saving the tablature. Please try again.",
        "error"
      );
    }
  };

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">
        {isUpdate ? "Update" : "Create"} Tablature
      </h2>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your tablature title..."
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Instrument</label>
        <input
          type="text"
          className="form-control"
          value={instrument || ""}
          onChange={(e) => setInstrument(e.target.value)}
          placeholder="Enter your instrument name..."
        />
      </div>
      <TablatureEditor
        content={content}
        onSave={handleSave}
        isUpdate={isUpdate}
      />
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default ManageTablature;
