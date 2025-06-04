module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,gif,ico,woff,woff2,json,webmanifest}'
  ],
  swDest: 'dist/sw.js', // Output service worker file
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ],
  // Define runtime caching strategies
  runtimeCaching: [
    {
      // Cache Google Fonts stylesheets
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      }
    },
    {
      // Cache Google Fonts webfonts
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        cacheableResponse: {
          statuses: [0, 200] // Cache opaque and successful responses
        },
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    }
    // {
    //   // Example for caching API responses (if we had an API)
    //   // urlPattern: /^https:\/\/api\.example\.com\/data/,
    //   // handler: 'NetworkFirst',
    //   // options: {
    //   //   cacheName: 'api-cache',
    //   //   networkTimeoutSeconds: 10, // Time to wait for network before falling back to cache
    //   //   expiration: {
    //   //     maxEntries: 50,
    //   //     maxAgeSeconds: 5 * 60 // 5 minutes
    //   //   }
    //   // }
    // }
  ]
};
