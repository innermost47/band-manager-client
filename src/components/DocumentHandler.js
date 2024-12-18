import React, { useState, useEffect } from "react";
import { documentService } from "../api/documentService";
import { useToast } from "./ToastContext";
import { useDropzone } from "react-dropzone";
import PDFViewer from "./PdfViewer";
import { confirmAlert } from "react-confirm-alert";

const ACCEPTED_TYPES = {
  "application/pdf": {
    icon: "bi-file-earmark-pdf",
    color: "text-danger",
  },
  "application/zip": {
    icon: "bi-file-earmark-zip",
    color: "text-warning",
  },
  "application/msword": {
    icon: "bi-file-earmark-word",
    color: "text-primary",
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    icon: "bi-file-earmark-word",
    color: "text-primary",
  },
  "application/vnd.oasis.opendocument.text": {
    icon: "bi-file-earmark-text",
    color: "text-info",
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    icon: "bi-file-earmark-spreadsheet",
    color: "text-success",
  },
  "application/vnd.oasis.opendocument.presentation": {
    icon: "bi-file-earmark-slides",
    color: "text-orange",
  },
};

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

const DocumentHandler = ({ projectId }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const windowWidth = useWindowWidth();

  const { showToast } = useToast();

  const loadDocuments = async () => {
    try {
      setIsLoadingDocuments(true);
      const response = await documentService.getProjectDocuments(projectId);
      setDocuments(response.data);
      setIsLoadingDocuments(false);
    } catch (error) {
      showToast("Error loading documents", "error");
      setIsLoadingDocuments(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [projectId]);

  useEffect(() => {
    const loadPdf = async () => {
      if (!selectedPdf) return;

      setIsLoading(true);
      try {
        const response = await documentService.downloadDocument(
          selectedPdf.filename,
          projectId
        );
        const url = URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        setPdfUrl(url);
      } catch (error) {
        showToast("Error loading PDF", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedPdf) {
      loadPdf();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [selectedPdf, projectId]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      setSelectedFile(file);
    } else {
      showToast("Please select a supported file type", "error");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: Object.keys(ACCEPTED_TYPES).reduce(
      (acc, type) => ({
        ...acc,
        [type]: [],
      }),
      {}
    ),
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("Please select a file", "error");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("project_id", projectId);

    try {
      const response = await documentService.uploadDocument(formData);
      setDocuments((prev) => [response.data, ...prev]);
      setSelectedFile(null);
      showToast("Document uploaded successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.error || "Error uploading document",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (filename, projectId) => {
    try {
      const response = await documentService.downloadDocument(
        filename,
        projectId
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast("Error downloading the document", "error");
    }
  };

  const handleDelete = async (fileId) => {
    confirmAlert({
      title: "Delete Document",
      message:
        "Are you sure you want to delete this document? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              let response = await documentService.deleteDocument(fileId);
              setIsLoadingDocuments(true);
              response = await documentService.getProjectDocuments(projectId);
              setDocuments(response.data);
              setIsLoadingDocuments(false);
              showToast("Document deleted successfully", "success");
            } catch (error) {
              showToast("Error deleting the document", "error");
              setIsLoadingDocuments(false);
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

  const handleViewDocument = (doc) => {
    if (doc.type === "application/pdf") {
      setSelectedPdf(doc);
      setIsViewerModalOpen(true);
    }
  };

  const getFileIcon = (fileType) => {
    return (
      ACCEPTED_TYPES[fileType] || {
        icon: "bi-file-earmark",
        color: "text-muted",
      }
    );
  };

  const truncateFilename = (filename) => {
    let maxLength;
    if (windowWidth < 576) {
      maxLength = 15;
    } else if (windowWidth < 768) {
      maxLength = 20;
    } else if (windowWidth < 992) {
      maxLength = 30;
    } else {
      maxLength = 64;
    }

    if (filename.length <= maxLength) return filename;

    const extension = filename.split(".").pop();
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
    const truncatedName = nameWithoutExt.substring(
      0,
      maxLength - extension.length - 4
    );
    return `${truncatedName}...${extension}`;
  };

  return (
    <div className="mb-3">
      {/* Upload Section */}
      <div className="card shadow-sm mb-3">
        <div className="card-header">
          <h5 className="mb-0 d-flex align-items-center">
            <i className="bi bi-file-earmark me-2 text-primary"></i>
            Upload Document
          </h5>
        </div>
        <div className="card-body">
          <div
            {...getRootProps()}
            className="mt-2 border border-primary border-dashed rounded p-4 text-center mb-3"
            style={{ cursor: "pointer" }}
          >
            <input {...getInputProps()} />
            <i className="bi bi-cloud-upload display-4 text-primary"></i>
            <p className="mt-2 mb-0">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : "Drag and drop a file here or click to select"}
            </p>
          </div>

          {selectedFile && (
            <button
              className="btn btn-primary d-flex align-items-center btn-sm mt-3"
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2"></i>
                  Upload File
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Documents</h5>
        </div>
        <div className="card-body">
          {isLoadingDocuments ? (
            <div className="container mt-5">
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading project...</span>
                </div>
              </div>
            </div>
          ) : documents.length > 0 ? (
            <div
              className="list-group overflow-auto"
              style={{ maxHeight: "400px" }}
            >
              {documents.map((doc) => {
                const { icon, color } = getFileIcon(doc.type);
                return (
                  <div
                    key={doc.id}
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <i className={`bi ${icon} ${color} me-2 fs-5`}></i>
                        <h6 className="mb-0">
                          {" "}
                          {truncateFilename(doc.filename)}
                        </h6>
                      </div>
                      <div>
                        {doc.type === "application/pdf" && (
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        )}
                        <button
                          className="btn btn-outline-danger btn-sm me-2"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            handleDownload(doc.filename, projectId)
                          }
                        >
                          <i className="bi bi-download"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-file-earmark display-4 text-muted"></i>
              <p className="text-muted mt-2">No documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {isViewerModalOpen && selectedPdf && pdfUrl && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
              <button
                className="btn btn-close position-absolute top-0 end-0 me-4 mt-4"
                onClick={() => {
                  setIsViewerModalOpen(false);
                  setSelectedPdf(null);
                }}
                style={{ zIndex: 1000 }}
              ></button>
              <div className="modal-body d-flex justify-content-center align-items-center">
                {isLoading ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading PDF...</span>
                  </div>
                ) : (
                  <PDFViewer pdfUrl={pdfUrl} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentHandler;
