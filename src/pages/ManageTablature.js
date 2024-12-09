import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { tablatureService } from "../api/tablatureService";
import TablatureEditor from "../components/TablatureEditor";
import VexTabDocumentation from "../components/VexTabDocumentation";
import Modal from "react-bootstrap/Modal";
import Toast from "../components/Toast";

const ManageTablature = () => {
  const { songId, tabId } = useParams();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [instrument, setInstrument] = useState("");
  const [content, setContent] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [showHelp, setShowHelp] = useState(false);
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
    <div className="container mt-5 mb-3">
      <div className="text-center mb-4">
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
          }}
        >
          <i
            className={`bi ${
              isUpdate ? "bi-pencil-square" : "bi-file-earmark-music"
            } fs-2 text-primary`}
          ></i>
        </div>
        <h4 className="mb-2">{isUpdate ? "Update" : "Create"} Tablature</h4>
        <p className="text-muted mb-0">Enter your tablature details below</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="mb-4">
                <label className="form-label text-muted small">Title</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-type text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={title || ""}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your tablature title..."
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">
                  Instrument
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-music-note text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={instrument || ""}
                    onChange={(e) => setInstrument(e.target.value)}
                    placeholder="Enter your instrument name..."
                  />
                </div>
              </div>

              <div className="mb-4 text-end">
                <button
                  className="btn btn-primary rounded-pill"
                  onClick={() => setShowHelp(true)}
                >
                  <i className="bi bi-lightbulb me-2"></i>
                  View Documentation
                </button>
              </div>

              <TablatureEditor
                content={content}
                onSave={handleSave}
                isUpdate={isUpdate}
              />
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      <Modal
        show={showHelp}
        onHide={() => setShowHelp(false)}
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <div className="d-flex align-items-center">
              <i className="bi bi-book text-primary me-2"></i>
              VexTab Documentation
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VexTabDocumentation />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={() => setShowHelp(false)}
          >
            <i className="bi bi-check-lg me-2"></i>
            Got it
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageTablature;
