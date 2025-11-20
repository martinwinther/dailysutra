const runtimeCaching = [
  {
    // Static resources (Next.js build, JS bundles, CSS)
    urlPattern: /^https:\/\/[a-zA-Z0-9.-]+\/_next\//,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "next-static-assets",
    },
  },
  {
    // Static images and icons from your domain
    urlPattern: /^https:\/\/[a-zA-Z0-9.-]+\/(icons|_next\/image|images)\//,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "image-assets",
    },
  },
  {
    // Firebase / Firestore / Auth — network only, don't cache
    urlPattern:
      /^https:\/\/(firestore|firebaseinstallations|identitytoolkit|securetoken)\.googleapis\.com\/.*/i,
    handler: "NetworkOnly",
    options: {
      cacheName: "firebase-network-only",
    },
  },
];

module.exports = {
  runtimeCaching,
};

