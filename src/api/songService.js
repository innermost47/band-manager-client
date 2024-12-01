import api from "./api";

export const songService = {
  createSong: async (data) => await api.post(`/api/songs`, data),
  getSong: async (id) => await api.get(`/api/songs/${id}`),
  updateSong: async (id, data) => await api.put(`/api/songs/${id}`, data),
  deleteSong: async (id) => await api.delete(`/api/songs/${id}`),
  uploadAudioFiles: async (formData) =>
    await api.post(`/api/audio-files/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAudioFile: async (id) => await api.delete(`/api/audio-files/${id}`),
  updateAudioFile: async (id, data) =>
    await api.put(`/api/audio-files/${id}`, data),
  getAudioFile: async (audioFilePath) =>
    await api.get(audioFilePath, {
      responseType: "blob",
    }),
};

export default songService;
