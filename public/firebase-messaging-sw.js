/* Firebase Messaging background worker. Values are loaded from the server so this file never contains credentials. */
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js", "https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js")

fetch("/api/firebase/config").then(response => response.json()).then(config => {
  if (!config.projectId || !config.messagingSenderId || !config.appId) return
  firebase.initializeApp(config)
  const messaging = firebase.messaging()
  messaging.onBackgroundMessage(payload => {
    const title = payload.notification?.title || "First Estates"
    self.registration.showNotification(title, { body: payload.notification?.body || "You have a new notification", icon: "/logo/favicon.png", data: payload.data || {} })
  })
})
