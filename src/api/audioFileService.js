import api from "./api";

export const audioFileService = {
  getAudioFilesBySong: async (songId) =>
    await api.get(`/api/songs/${songId}/audio-files`),
  uploadAudioFile: async (songId, formData) =>
    await api.post(`/api/songs/${songId}/audio-files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAudioFile: async (id) => await api.delete(`/api/audio-files/${id}`),
};
