const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");

const getGeolocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      latitudeElement.innerHTML = position.coords.latitude; 
      longitudeElement.innerHTML = position.coords.longitude;
    });
  } else { 
    const notSupportedMessage = "Geolocation is not supported by this browser.";
    latitudeElement.innerHTML = notSupportedMessage;
    longitudeElement.innerHTML = notSupportedMessage;
  }
}