const arrow = document.getElementById('arrow');

function updateArrow(alpha, beta, gamma, userLocation, objectLocation) {
    // Calculate the angle between user's orientation and direction to the object
    const objectDirection = calculateDirection(userLocation, objectLocation);
    const angle = objectDirection - alpha;

    // Update the arrow's rotation
    arrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

function calculateDirection(userLocation, objectLocation) {
    const userLat = userLocation.latitude;
    const userLng = userLocation.longitude;
    const objectLat = objectLocation.latitude;
    const objectLng = objectLocation.longitude;

    // Calculate the angle between user's orientation and direction to the object
    const phiK = (userLat + objectLat) / 2.0 * Math.PI / 180.0;
    const deltaLambda = userLng - objectLng;
    const deltaPhi = userLat - objectLat;
    const a = Math.sin(deltaPhi / 2.0 * Math.PI / 180.0) * Math.sin(deltaPhi / 2.0 * Math.PI / 180.0) + Math.cos(userLat * Math.PI / 180.0) * Math.cos(objectLat * Math.PI / 180.0) * Math.sin(deltaLambda / 2.0 * Math.PI / 180.0) * Math.sin(deltaLambda / 2.0 * Math.PI / 180.0);
    const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
    const distance = 6371.0 * c; // Earth radius * angle between the points
    const y = Math.sin(deltaLambda * Math.PI / 180.0) * Math.cos(objectLat * Math.PI / 180.0);
    const x = Math.cos(userLat * Math.PI / 180.0) * Math.sin(objectLat * Math.PI / 180.0) - Math.sin(userLat * Math.PI / 180.0) * Math.cos(objectLat * Math.PI / 180.0) * Math.cos(deltaLambda * Math.PI / 180.0);
    const bearing = Math.atan2(y, x) * 180.0 / Math.PI;
    const angle = (bearing + 360) % 360; // Ensure angle is between 0 and 360 degrees

    return angle;
}

function handleLocationError(error) {
    console.error(`Error getting user's location: ${error.message}`);
}

function getLocationAndOrientation(objectLocation) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            window.addEventListener('deviceorientation', event => {
                updateArrow(event.alpha, event.beta, event.gamma, userLocation, objectLocation);
            });
        }, handleLocationError);
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Replace these values with the coordinates of your object
const objectLocation = {
    latitude: 52.409675124771326, 
    longitude: 4.749416581088284
};

getLocationAndOrientation(objectLocation);
