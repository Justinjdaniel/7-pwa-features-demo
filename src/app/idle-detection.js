// Refactored content of src/app/idle-detection.js
export function initIdleDetection() {
    if ('IdleDetector' in window) {
        const idleBtn = document.getElementById('idle');

        if (idleBtn) {
            idleBtn.addEventListener('click', () => runIdleDetection());
        } else {
            console.warn('Idle detection button not found. Skipping init for idle detection.');
        }

    } else {
        console.warn('Idle Detection API not supported.');
    }
}

async function runIdleDetection() {
    try {
        const state = await IdleDetector.requestPermission();
        console.log('IdleDetector permission state:', state);

        if (state !== 'granted') {
            console.warn('IdleDetector permission not granted.');
            return;
        }

        const idleDetector = new IdleDetector();

        idleDetector.addEventListener('change', () => {
            const userState = idleDetector.userState;
            const screenState = idleDetector.screenState;
            console.log('IdleDetector state changed:', { userState, screenState });

            if (userState === 'idle') {
                // Potentially update database with status or perform other actions
                console.log('User is idle.');
            }
        });

        await idleDetector.start({
            threshold: 120000, // 2 minutes
        });
        console.log('IdleDetector started.');

    } catch (err) {
        console.error('Error with Idle Detection:', err);
    }
}
