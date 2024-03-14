const arrow = document.getElementById('arrow');

function updateArrow(alpha, userLocation, objectLocation) {
    const objectDirection = calculateDirection(userLocation, objectLocation);
    const angle = objectDirection - alpha;

    // Normalize angle to be within 0 and 360 degrees
    const normalizedAngle = (angle + 360) % 360;

    // Update the arrow's rotation
    arrow.style.transform = `translate(-50%, -50%) rotate(${normalizedAngle}deg)`;
}

function calculateDirection(userLocation, objectLocation) {
    const userLat = userLocation.latitude;
    const userLng = userLocation.longitude;
    const objectLat = objectLocation.latitude;
    const objectLng = objectLocation.longitude;

    // Calculate angle using user and object coordinates
    const deltaLng = objectLng - userLng;
    const y = Math.sin(deltaLng) * Math.cos(objectLat);
    const x =
        Math.cos(userLat) * Math.sin(objectLat) -
        Math.sin(userLat) * Math.cos(objectLat) * Math.cos(deltaLng);
    let angle = Math.atan2(y, x) * (180 / Math.PI);

    // Adjust angle to be between 0 and 360 degrees
    if (angle < 0) {
        angle += 360;
    }

    return angle;
}

function handleLocationError(error) {
    console.error(`Error getting user's location: ${error.message}`);
}

function getLocationAndOrientation(objectLocation) {
    if (navigator.geolocation) {
        navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
            if (permissionStatus.state === 'granted') {
                // Permission already granted
                startWatchingPosition(objectLocation);
            } else if (permissionStatus.state === 'prompt') {
                // Permission not yet granted, prompt user
                navigator.geolocation.getCurrentPosition(() => {
                    // Permission granted after user interaction
                    startWatchingPosition(objectLocation);
                }, handleLocationError);
            } else {
                // Permission denied or other state
                console.error('Geolocation permission denied.');
            }
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

function startWatchingPosition(objectLocation) {
    navigator.geolocation.watchPosition(position => {
        const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        window.addEventListener('deviceorientation', event => {
            updateArrow(event.alpha, userLocation, objectLocation);
        });
    }, handleLocationError);
}

// Replace these values with the coordinates of your object
const objectLocation = {
    latitude: 40.7128,
    longitude: -74.0060
};

getLocationAndOrientation(objectLocation);
