// src/app/webauthn.js
export function initWebAuthn() {
    const usernameInput = document.getElementById('webauthn-username');
    const registerButton = document.getElementById('webauthn-register-btn');
    const loginButton = document.getElementById('webauthn-login-btn');
    const statusElement = document.getElementById('webauthn-status');

    if (!usernameInput || !registerButton || !loginButton || !statusElement) {
        console.warn('WebAuthn HTML elements not found. Skipping initWebAuthn.');
        return;
    }

    // Helper to check for WebAuthn support
    const isWebAuthnSupported = () => {
        if (window.PublicKeyCredential) {
            return true;
        }
        statusElement.textContent = 'WebAuthn is not supported by this browser.';
        console.warn('WebAuthn not supported.');
        return false;
    };

    registerButton.addEventListener('click', async () => {
        if (!isWebAuthnSupported()) return;

        const username = usernameInput.value.trim();
        if (!username) {
            statusElement.textContent = 'Please enter a username to register.';
            return;
        }
        statusElement.textContent = 'Attempting to register passkey...';

        try {
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);
            const userId = new TextEncoder().encode(username); // In real app, this would be a stable user ID from server

            const publicKeyCredentialCreationOptions = {
                challenge: challenge,
                rp: {
                    name: 'Demo PWA',
                    id: window.location.hostname, // Important for security, usually set by server
                },
                user: {
                    id: userId,
                    name: username,
                    displayName: username,
                },
                pubKeyCredParams: [
                    { type: 'public-key', alg: -7 },  // ES256
                    { type: 'public-key', alg: -257 } // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform', // 'platform' or 'cross-platform'
                    requireResidentKey: true,      // Often true for passkeys
                    userVerification: 'preferred',
                },
                timeout: 60000, // 1 minute
                attestation: 'direct' // 'none', 'indirect', 'direct' - server preference
            };

            const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
            console.log('Registration successful (simulated). Credential:', credential);
            // In a real app, send credential.rawId and credential.response to the server
            // For demo, store credential ID in localStorage (very insecure, for demo only!)
            localStorage.setItem(`webauthn-credId-${username}`, bufferToBase64(credential.rawId));
            statusElement.textContent = `Passkey registration successful for ${username}! (Simulated - Credential ID logged and stored locally for demo login).`;
        } catch (error) {
            console.error('WebAuthn registration failed:', error);
            statusElement.textContent = `Registration failed: ${error.message}`;
        }
    });

    loginButton.addEventListener('click', async () => {
        if (!isWebAuthnSupported()) return;

        const username = usernameInput.value.trim(); // For demo, to retrieve the stored credId
        statusElement.textContent = 'Attempting to login with passkey...';

        try {
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            // For demo, retrieve stored credential ID (in real app, server might provide this or rely on discoverable credentials)
            const storedCredIdBase64 = localStorage.getItem(`webauthn-credId-${username}`);
            let allowCredentials;
            if (storedCredIdBase64) {
                allowCredentials = [{
                    type: 'public-key',
                    id: base64ToBuffer(storedCredIdBase64),
                    transports: ['internal', 'usb', 'nfc', 'ble'], // Optional
                }];
            }

            const publicKeyCredentialRequestOptions = {
                challenge: challenge,
                allowCredentials: allowCredentials, // Can be omitted if relying on discoverable credentials (resident keys)
                timeout: 60000,
                userVerification: 'preferred',
                rpId: window.location.hostname, // Usually set by server
            };

            const assertion = await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });
            console.log('Login successful (simulated). Assertion:', assertion);
            // In a real app, send assertion.rawId, assertion.response.clientDataJSON,
            // assertion.response.authenticatorData, assertion.response.signature to the server for verification.
            statusElement.textContent = `Passkey login successful for ${username}! (Simulated - Assertion logged).`;
        } catch (error) {
            console.error('WebAuthn login failed:', error);
            statusElement.textContent = `Login failed: ${error.message}`;
        }
    });

    // Helper functions for demo ID storage (not for production)
    function bufferToBase64(buffer) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
    }

    function base64ToBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
