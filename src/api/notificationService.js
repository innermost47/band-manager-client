import api from "./api";

export const notificationService = {
  getNotifications: async () => await api.get("/api/notifications"),
  markAllAsRead: async () =>
    await api.put("/api/notifications/mark-all-as-read"),
  markNotificationAsRead: async (id) =>
    await api.put(`/api/notifications/${id}/mark-as-read`),
  deleteAllNotifications: async () =>
    await api.delete(`/api/notifications/all`),

  vapidPublicKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  async registerPushNotifications() {
    const isDevelopment =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    try {
      if (!("Notification" in window)) {
        throw new Error("This browser does not support notifications");
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Permission refused");
      }

      if (!("serviceWorker" in navigator)) {
        throw new Error("Unsupported Service Worker");
      }

      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );

      let subscription;

      if (isDevelopment) {
        try {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
              this.vapidPublicKey
            ),
            applicationServerKey: new Uint8Array([1, 2, 3, 4]),
          });
        } catch (devError) {
          console.log("Dev mode fallback: simulating subscription");
          subscription = {
            endpoint: "https://fcm.googleapis.com/fcm/send/dev-mode",
            keys: {
              p256dh: "dev-mode-key",
              auth: "dev-mode-auth",
            },
          };
        }
        console.log("Development mode: Push notification setup successful");
      } else {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
        });
      }

      if (isDevelopment) {
        console.log("Development mode: Skipping backend subscription");
        return true;
      } else {
        await api.post("/api/push/subscribe", subscription);
      }

      return true;
    } catch (error) {
      if (isDevelopment) {
        console.warn(
          "Development mode: Ignoring push notification error:",
          error
        );
        return true;
      } else {
        console.error("Error enabling notifications:", error);
        throw error;
      }
    }
  },

  async checkNotificationStatus() {
    const storedPreference = localStorage.getItem("notificationsEnabled");
    if (!storedPreference) return false;
    if (!("Notification" in window)) return false;
    return Notification.permission === "granted";
  },
};
