// Refactored content of src/app/device-motion.js
export function initDeviceMotion() {
    // Attempt to get current position
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Geolocation position:', position);
            },
            (error) => {
                console.warn('Error getting geolocation:', error);
            }
        );
    } else {
        console.warn('Geolocation API not available.');
    }

    // Add device motion listener
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', (event) => {
            const el = document.getElementById('motion');
            if (el) {
                // console.log('Device motion event:', event); // Can be very verbose
                el.innerText = (Math.round((event.acceleration.x + Number.EPSILON) * 100) / 100) + ' m/s2';
            } else {
                // console.warn('Motion element not found for device motion updates.');
            }
        });
    } else {
        console.warn('Device Motion API not available.');
    }
}
