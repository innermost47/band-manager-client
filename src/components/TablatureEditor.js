import React, { useEffect, useState } from "react";
import VexTabEditor from "./VexTabEditor";
import Toast from "../components/Toast";

const TablatureEditor = ({ content, onSave, isUpdate }) => {
  const [currentContent, setCurrentContent] = useState(content || "");
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    if (content !== currentContent) {
      setCurrentContent(content);
    }
  }, [content]);

  const handleContentChange = (e) => {
    setCurrentContent(e.target.value);
  };

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
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
    <div>
      <label className="form-label">Tablature editor</label>
      <textarea
        className="form-control"
        rows="5"
        value={currentContent}
        onChange={handleContentChange}
        placeholder="Enter notes in VexTab format (e.g., 5/2 5/3 7/4)"
      />
      <div className="mt-3 w-100">
        <VexTabEditor content={currentContent} />
      </div>
      <button className="btn btn-warning mt-3 mb-3" onClick={handleSave}>
        <i className="bi bi-pencil-square me-1"></i>{" "}
        {isUpdate ? "Update" : "Create"} Tablature
      </button>
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default TablatureEditor;
