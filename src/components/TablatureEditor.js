import React, { useEffect, useState } from "react";
import VexTabEditor from "./VexTabEditor";
import { useToast } from "./ToastContext";

const TablatureEditor = ({ content, onSave, isUpdate }) => {
  const [currentContent, setCurrentContent] = useState(content || "");
  const { showToast } = useToast();

  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  const handleContentChange = (e) => {
    setCurrentContent(e.target.value);
  };

  const handleSave = () => {
    if (currentContent.trim() === "") {
      showToast("Please enter content before saving.", "error");
      return;
    }

    if (onSave) {
      onSave(currentContent);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle me-2 d-flex align-items-center justify-content-center"
            style={{
              width: "32px",
              height: "32px",
              minWidth: "32px",
            }}
          >
            <i className="bi bi-music-note-list fs-5 text-primary"></i>
          </div>
          <h5 className="mb-0">Tablature Editor</h5>
        </div>
      </div>

      <div className="card-body">
        <div className="mb-4">
          <div className="input-group">
            <textarea
              className="form-control"
              rows="5"
              value={currentContent}
              onChange={handleContentChange}
              placeholder="Enter your notes in VexTab format..."
            />
          </div>
        </div>
        <div className="mb-4">
          <VexTabEditor content={currentContent} />
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" onClick={handleSave}>
            <i
              className={`bi ${isUpdate ? "bi-check-lg" : "bi-plus-lg"} me-2`}
            ></i>
            {isUpdate ? "Update Tablature" : "Create Tablature"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablatureEditor;
