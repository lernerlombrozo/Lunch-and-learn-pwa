const video = document.getElementById("video");
const errorElement = document.getElementById("error");

async function getMedia(){
  video
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })
  try {
  video.srcObject = stream
  } catch (error) {
    alert(`${error.name}`)
    console.error(error)
  }
}
