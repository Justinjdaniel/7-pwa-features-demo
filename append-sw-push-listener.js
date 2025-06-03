const fs = require('fs');
const path = require('path');

const swPath = path.join(__dirname, 'dist', 'sw.js'); // More robust path construction

const pushListenerCode = `

// --- Appended Push Event Listener ---
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  const pushData = event.data ? event.data.text() : 'no data';
  console.log('[Service Worker] Push had this data: "' + pushData + '"');

  const title = 'Push Notification Demo';
  const options = {
    body: pushData || 'You received a push notification!', // Use pushData if available
    icon: '/assets/logo.png', // Ensure this path is correct relative to your public dir
    badge: '/assets/logo.png'  // Ensure this path is correct
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
      .catch(err => console.error('[Service Worker] Error showing notification:', err))
  );
});
// --- End Appended Push Event Listener ---
`;

const syncListenerCode = `

// --- Appended Sync Event Listener ---
self.addEventListener('sync', event => {
  if (event.tag === 'send-message-sync') {
    console.log('[Service Worker] Sync event triggered for "send-message-sync"');
    event.waitUntil(
      // In a real app, retrieve stored message (e.g., from IndexedDB) and send to server
      new Promise((resolve, reject) => {
        console.log('[Service Worker] Simulating retrieving message and sending now...');
        // Simulate network request
        setTimeout(() => {
          console.log('[Service Worker] Message sent (simulated).');
          // Optionally, show a notification upon successful sync
          self.registration.showNotification('Background Sync', {
            body: 'Your message was sent successfully!',
            icon: '/assets/logo.png' // Ensure this path is correct
          }).catch(err => console.error('[Service Worker] Error showing sync notification:', err));
          resolve();
        }, 2000); // Simulate 2-second delay
      }).catch(err => {
        console.error('[Service Worker] Error during sync event:', err);
        // Handle failure, perhaps try again later or notify the user
      })
    );
  }
});
// --- End Appended Sync Event Listener ---
`;

try {
  // Check if sw.js exists before trying to append
  if (fs.existsSync(swPath)) {
    fs.appendFileSync(swPath, pushListenerCode + syncListenerCode); // Append both listeners
    console.log('Successfully appended push and sync listeners to service worker:', swPath);
  } else {
    console.error('Service worker file not found at:', swPath, '. Listeners not appended. Ensure Workbox has generated it first.');
    // Optionally, exit with an error code if this is critical
    // process.exit(1);
  }
} catch (error) {
  console.error('Error appending listeners to service worker:', error);
  // Optionally, exit with an error code
  // process.exit(1);
}
