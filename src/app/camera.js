// src/app/camera.js
export function initCameraAccess() {
    const startCameraButton = document.getElementById('start-camera-btn');
    const cameraStreamElement = document.getElementById('camera-stream');
    const cameraStatusElement = document.getElementById('camera-status');

    if (!startCameraButton || !cameraStreamElement || !cameraStatusElement) {
        console.warn('Camera access HTML elements not found. Skipping initCameraAccess.');
        return;
    }

    startCameraButton.addEventListener('click', async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                cameraStreamElement.srcObject = stream;
                cameraStreamElement.style.display = 'block';
                cameraStatusElement.textContent = ''; // Clear status
            } catch (error) {
                console.error('Error accessing camera:', error);
                cameraStreamElement.style.display = 'none';
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    cameraStatusElement.textContent = 'Camera access denied. Please allow camera permission in your browser settings.';
                } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                    cameraStatusElement.textContent = 'No camera found on this device.';
                } else {
                    cameraStatusElement.textContent = `Error accessing camera: ${error.message}`;
                }
            }
        } else {
            cameraStatusElement.textContent = 'Camera access (getUserMedia) is not supported by this browser.';
            console.warn('getUserMedia not supported.');
        }
    });
}
