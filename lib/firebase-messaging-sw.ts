/**
 * Firebase Messaging Service Worker Registration
 * 
 * This file is used to register the Firebase messaging service worker
 * with the correct configuration values.
 */

export function registerFirebaseMessagingSW() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  // Register the service worker
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("[Notifications] Service Worker registered:", registration);
    })
    .catch((error) => {
      console.warn("[Notifications] Service Worker registration failed:", error);
    });
}

