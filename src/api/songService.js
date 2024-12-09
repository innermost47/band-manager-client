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
  getAudioFileUrlForStream: async (signedUrl) => {
    try {
      const response = await fetch(signedUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          }
          push();
        },
      });
      const streamedResponse = new Response(stream);
      const audioUrl = URL.createObjectURL(streamedResponse.body);
      return audioUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement en streaming:", error);
      throw error;
    }
  },
};

export default songService;
