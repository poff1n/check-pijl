let deviceOrientation = null;
let deviceHeading = null;

function updateArrow(angle) {
    const arrow = document.getElementById('arrow');
    arrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

function calculateAngle(lat1, lon1, lat2, lon2) {
    const dx = lon2 - lon1;
    const dy = lat2 - lat1;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const amsterdamLat = 52.3676;
    const amsterdamLon = -1.9041;

    const angle = calculateAngle(latitude, longitude, amsterdamLat, amsterdamLon);
    updateArrow(angle);
}

function error() {
    alert('Unable to retrieve your location.');
}

function handleDeviceOrientation(event) {
    deviceOrientation = event.alpha;
    if (deviceOrientation !== null && deviceHeading !== null) {
        const angle = deviceHeading - deviceOrientation;
        updateArrow(angle);
    }
}

function handleDeviceMotion(event) {
    deviceHeading = event.webkitCompassHeading || event.alpha || 0;
    if (deviceOrientation !== null && deviceHeading !== null) {
        const angle = deviceHeading - deviceOrientation;
        updateArrow(angle);
    }
}

function updateArrowContinuously() {
    setInterval(() => {
        if (deviceOrientation !== null && deviceHeading !== null) {
            const angle = deviceHeading - deviceOrientation;
            updateArrow(angle);
        }
    }, 100);
}

window.addEventListener('deviceorientation', handleDeviceOrientation);
window.addEventListener('devicemotion', handleDeviceMotion);

navigator.geolocation.getCurrentPosition(success, error);

updateArrowContinuously();
