import api from "./api";

export const documentService = {
  uploadDocument: async (formData) => {
    return await api.post("/api/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  downloadDocument: async (filename, projectId) => {
    return await api.get(`/document/${filename}/${projectId}`, {
      responseType: "blob",
    });
  },

  deleteDocument: async (fileId) => {
    return await api.delete(`/api/documents/${fileId}`);
  },

  getDocumentUrl: (filename, projectId) => {
    return `${process.env.REACT_APP_API_URL}/document/${filename}/${projectId}`;
  },

  getProjectDocuments: async (projectId) => {
    return await api.get(`/api/documents/project/${projectId}`);
  },
};
