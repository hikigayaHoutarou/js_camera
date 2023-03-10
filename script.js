feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];

let streamStarted = false;

const [play, pause, screenshot] = buttons;

const constraints = {
  audio: true
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
      video: {
        facingMode: cameraOptions.value
      }
    };
    startStream(updatedConstraints);
  }
};

const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
};

const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  screenshot.classList.remove('d-none');
  streamStarted = true;

  window.localStream = stream; // A
  window.localAudio.srcObject = stream; // B
  window.localAudio.autoplay = true;
};


cameraOptions.onchange = (v) => {
  const updatedConstraints = {
    ...constraints,
    video: {
      facingMode: cameraOptions.value
    }
  };

  console.log(updatedConstraints);
  startStream(updatedConstraints);
};

const pauseStream = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
};

const doScreenshot = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  screenshotImage.src = canvas.toDataURL('image/webp');
  screenshotImage.classList.remove('d-none');
};

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;


function getLocation() {
  const successCallback = (position) => {
    alert(`Your current Location: latitude: ${position.coords.latitude}, longitude: ${position.coords.longitude}`);
  };
  const errorCallback = (error) => {
    alert(error.message);
  };
  
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = {multiple: true};
async function getContacts() {
  try {
      const contacts = await navigator.contacts.select(props, opts);
      alert(contacts.join(', '));
  } catch (e) {
    alert(e);
  }
}

