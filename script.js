window.addEventListener('load', () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const compass = document.querySelector('.compass');
        const needle = document.querySelector('.needle');
        const { heading } = position.coords;
        
        needle.style.transform = `translateX(-50%) rotate(${-heading}deg)`;
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });
  
