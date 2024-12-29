import api from "./api";

export const chatService = {
  getOrCreateProjectChannel: async (projectId) =>
    await api.get(`/api/channels/chat/projects/${projectId}`),

  getChannels: async (projectId) =>
    await api.get(`/api/channels/projects/${projectId}`),

  getMessages: async (activeChannelId) =>
    await api.get(`/api/channels/${activeChannelId}/messages`),

  postMessage: async (activeChannelId, data) =>
    await api.post(`/api/channels/${activeChannelId}/messages`, data),

  getNewMessages: async (channelId, afterTimestamp) => {
    try {
      const response = await api.get(
        `/api/channels/${channelId}/messages/new`,
        {
          params: { after: afterTimestamp },
        }
      );
      return {
        data: response.data || [],
      };
    } catch (error) {
      console.error("Error fetching new messages:", error);
      return {
        data: [],
      };
    }
  },
};
