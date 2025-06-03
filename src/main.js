// Main script to initialize all refactored modules
import { initBluetooth } from './app/bluetooth.js';
import { initContactPicker } from './app/contact-picker.js';
import { initDeviceMotion } from './app/device-motion.js';
import { initFileSystem } from './app/file-system.js';
import { initIdleDetection } from './app/idle-detection.js';
import { initSharing } from './app/sharing.js';
import { initCameraAccess } from './app/camera.js'; // Added Camera import
import { initGpsAccess } from './app/gps.js';       // Added GPS import
import { initBackgroundSync } from './app/background-sync.js'; // Added Background Sync import
import { initWebAuthn } from './app/webauthn.js'; // Added WebAuthn import
import { Workbox } from 'workbox-window';

// --- Push Notification Functions ---

// Function to convert VAPID public key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function subscribeToPushNotifications() {
    try {
        const registration = await navigator.serviceWorker.ready;
        // Note: Replace with your actual VAPID public key
        const applicationServerKey = urlBase64ToUint8Array('BCg9yTNj4qL0kP-ZrfA7zfaL0nN1g1esT2TTxXqlj98X1234567890123456789012345678901234567890'); // Example dummy key

        const options = {
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        };

        const subscription = await registration.pushManager.subscribe(options);
        console.log('Successfully subscribed to Push Notifications:', JSON.stringify(subscription));
        // In a real app, send this subscription object to your server
    } catch (error) {
        console.error('Failed to subscribe to Push Notifications:', error);
    }
}

async function requestNotificationPermission() {
    if (Notification.permission === 'granted') {
        console.log('Notification permission already granted.');
        await subscribeToPushNotifications(); // Proceed to subscribe if already granted
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        console.log('Notification permission granted.');
        await subscribeToPushNotifications();
    } else if (permission === 'denied') {
        console.warn('Notification permission denied.');
    } else {
        console.warn('Notification permission default (dismissed).');
    }
}

// --- End Push Notification Functions ---


// Call the initialization functions
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed. Initializing PWA features...');

    // Initialize features that depend on UI elements
    initBluetooth();
    initContactPicker();
    initDeviceMotion();
    initFileSystem();
    initIdleDetection();
    initSharing();
    initCameraAccess(); // Added Camera init call
    initGpsAccess();    // Added GPS init call
    initBackgroundSync(); // Added Background Sync init call
    initWebAuthn();       // Added WebAuthn init call

    // Add event listener for the new notifications button
    const notificationsButton = document.getElementById('enable-notifications-btn');
    if (notificationsButton) {
        notificationsButton.addEventListener('click', requestNotificationPermission);
    } else {
        console.warn('Enable Notifications button not found.');
    }

    console.log('All PWA features initialized (or attempted).');
});

// Service Worker registration with Workbox
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');

  wb.addEventListener('installed', event => {
    if (event.isUpdate) {
      if (confirm('New version available. Refresh now to get the latest updates?')) {
        window.location.reload();
      }
    }
  });

  wb.register()
    .then(registration => {
      console.log('Service Worker registered successfully:', registration);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
