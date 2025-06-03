// src/app/gps.js
export function initGpsAccess() {
    const getLocationButton = document.getElementById('get-location-btn');
    const locationInfoElement = document.getElementById('location-info');

    if (!getLocationButton || !locationInfoElement) {
        console.warn('GPS access HTML elements not found. Skipping initGpsAccess.');
        return;
    }

    getLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            locationInfoElement.textContent = 'Fetching location...';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    locationInfoElement.innerHTML = `
                        Latitude: ${latitude.toFixed(6)}<br>
                        Longitude: ${longitude.toFixed(6)}<br>
                        Accuracy: ${accuracy.toFixed(2)} meters
                    `;
                },
                (error) => {
                    console.error('Error getting location:', error);
                    let message = 'Error getting location: ';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message += 'User denied the request for Geolocation.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message += 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            message += 'The request to get user location timed out.';
                            break;
                        default:
                            message += 'An unknown error occurred.';
                            break;
                    }
                    locationInfoElement.textContent = message;
                }
            );
        } else {
            locationInfoElement.textContent = 'Geolocation is not supported by this browser.';
            console.warn('Geolocation not supported.');
        }
    });
}
