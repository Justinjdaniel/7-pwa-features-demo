// src/app/background-sync.js
export function initBackgroundSync() {
    const sendButton = document.getElementById('send-sync-message-btn');
    const messageInput = document.getElementById('sync-message');
    const statusElement = document.getElementById('sync-status');

    if (!sendButton || !messageInput || !statusElement) {
        console.warn('Background Sync HTML elements not found. Skipping initBackgroundSync.');
        return;
    }

    sendButton.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        if (!message) {
            statusElement.textContent = 'Please enter a message.';
            return;
        }

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                // In a real app, you'd store the message in IndexedDB here
                // For example: await saveMessageToOutbox(message);
                console.log('[App] Message to sync (would be stored in IDB):', message);

                await registration.sync.register('send-message-sync');

                statusElement.textContent = 'Message queued for background sync. It will be sent when connectivity is restored.';
                messageInput.value = ''; // Clear input
                console.log('[App] Background sync "send-message-sync" registered.');

            } catch (error) {
                console.error('[App] Background sync registration failed:', error);
                statusElement.textContent = `Error registering background sync: ${error.message}`;
            }
        } else {
            statusElement.textContent = 'Background Sync API is not supported by this browser.';
            console.warn('Background Sync not supported.');
        }
    });
}

// Example of how you might save to IndexedDB (not fully implemented for this demo)
// async function saveMessageToOutbox(message) {
//   return new Promise((resolve, reject) => {
//     // IDB logic to store the message
//     console.log(`[IDB] Saving message: "${message}"`);
//     resolve();
//   });
// }
