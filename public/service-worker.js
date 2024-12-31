/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

self.__WB_MANIFEST;

self.addEventListener("push", function (event) {
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
