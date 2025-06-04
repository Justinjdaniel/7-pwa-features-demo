const fs = require('fs');
const path = require('path');

const swPath = path.join(__dirname, 'dist', 'sw.js'); // More robust path construction

const pushMarkerStart = '// --- Appended Push Event Listener ---';
const syncMarkerStart = '// --- Appended Sync Event Listener ---';

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
  // Check if sw.js exists
  if (fs.existsSync(swPath)) {
    let swContent = fs.readFileSync(swPath, 'utf8');
    let appendedPush = false;
    let appendedSync = false;

    // Check for push listener
    if (!swContent.includes(pushMarkerStart)) {
      fs.appendFileSync(swPath, pushListenerCode);
      console.log('Successfully appended push listener to service worker:', swPath);
      appendedPush = true;
    } else {
      console.log('Push listener already exists in service worker. Skipping appending.');
    }

    // Check for sync listener
    // Need to re-read the file if push listener was added
    if (appendedPush) {
      swContent = fs.readFileSync(swPath, 'utf8');
    }
    if (!swContent.includes(syncMarkerStart)) {
      fs.appendFileSync(swPath, syncListenerCode);
      console.log('Successfully appended sync listener to service worker:', swPath);
      appendedSync = true;
    } else {
      console.log('Sync listener already exists in service worker. Skipping appending.');
    }

    if (!appendedPush && !appendedSync) {
      console.log('Both push and sync listeners already exist. No changes made.');
    }

  } else {
    console.error('Service worker file not found at:', swPath, '. Listeners not appended. Ensure Workbox has generated it first.');
    // process.exit(1); // Optional: exit if critical
  }
} catch (error) {
  console.error('Error processing service worker listeners:', error);
  // process.exit(1); // Optional: exit with an error code
}
