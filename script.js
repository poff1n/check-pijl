const compassCircle = document.querySelector(".compass-circle");
const myPoint = document.querySelector(".my-point");
const startBtn = document.querySelector(".start-btn");
const isIOS =
  navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
  navigator.userAgent.match(/AppleWebKit/);

// Specify the latitude and longitude of your target point
const targetLatitude = 64.2479;
const targetLongitude = 95.1104;

function init() {
  startBtn.addEventListener("click", startCompass);
  navigator.geolocation.getCurrentPosition(locationHandler);

  if (!isIOS) {
    window.addEventListener("deviceorientationabsolute", handler, true);
  }
}

function startCompass() {
  if (isIOS) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handler, true);
        } else {
          alert("has to be allowed!");
        }
      })
      .catch(() => alert("not supported"));
  }
}

function handler(e) {
  compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
  compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

  if (
    (pointDegree < Math.abs(compass) &&
      pointDegree + 15 > Math.abs(compass)) ||
    pointDegree > Math.abs(compass + 15) ||
    pointDegree < Math.abs(compass)
  ) {
    myPoint.style.opacity = 0;
  } else if (pointDegree) {
    myPoint.style.opacity = 1;
  }
}

let pointDegree;

function locationHandler(position) {
  const { latitude, longitude } = position.coords;
  pointDegree = calcDegreeToPoint(latitude, longitude, targetLatitude, targetLongitude);

  if (pointDegree < 0) {
    pointDegree = pointDegree + 360;
  }
}

function calcDegreeToPoint(latitude, longitude, targetLatitude, targetLongitude) {
  const phiK = (targetLatitude * Math.PI) / 180.0;
  const lambdaK = (targetLongitude * Math.PI) / 180.0;
  const phi = (latitude * Math.PI) / 180.0;
  const lambda = (longitude * Math.PI) / 180.0;
  const psi =
    (180.0 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
  return Math.round(psi);
}

init();
