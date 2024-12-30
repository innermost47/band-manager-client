const isDevelopment =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1";

self.addEventListener("push", function (event) {
  if (isDevelopment) {
    const title = "Test Notification";
    const options = {
      body: "This is a test notification in development mode",
      icon: "/logo.png",
      data: {
        url: "http://localhost:3000",
      },
    };
    event.waitUntil(self.registration.showNotification(title, options));
    return;
  }

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/logo.png",
      data: {
        url: data.frontEndUrl,
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  if (event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
