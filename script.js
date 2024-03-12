window.addEventListener('load', () => {
    const compass = document.querySelector('.compass');
    const needle = document.querySelector('.needle');
  
    function updateCompass(position) {
      if (position.coords.heading !== null && position.coords.heading !== undefined) {
        const heading = position.coords.heading;
  
        // Calculate the difference between the user's heading and the magnetic north (which is 0 degrees)
        const northOffset = -heading;
  
        // Update the needle rotation
        needle.style.transform = `translateX(-50%) rotate(${northOffset}deg)`;
      } else {
        //alert("Heading information is not available.");
      }
    }
  
    function updateNeedle() {
      // Set the rotation of the needle to point north (0 degrees)
      needle.style.transform = `translateX(-50%) rotate(0deg)`;
    }
  
    if (navigator.geolocation) {
      // Watch for changes in the user's position and update the compass accordingly
      navigator.geolocation.watchPosition(updateCompass, null, { enableHighAccuracy: true });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  
    // Call updateNeedle() initially to set the initial position of the needle
    updateNeedle();
  });
  
