import ffmpeg from 'ffmpeg.js';
// adjustments to emotion-recording.js

const API_ENDPOINT = 'placeholder'

let mediaRecorder
let recordedBlob
let audioChunks = []
let file

const startBtn = document.getElementById('start')
const stopBtn = document.getElementById('stop')
// const recordBtn = document.getElementById('record')

const constraints = { audio: true }
const mimeType = {mimeType: 'audio/webm'}
const timeslice = 4000

function main() {
    console.log("main() executed")
    let debug = MediaRecorder.isTypeSupported('audio/webm') // false
    console.log(debug)
    startBtn.addEventListener('click', () => startRecording());
    stopBtn.addEventListener('click', () => stopRecording());
    // sendBtn.addEventListener('click', () => sendRecording());
}

// formatting needs to be very specific.
// cutting file into 4s
// add buffer for last recording snippet
// save files
// order matters so save with relevant order
// sending .wav
// output
// pass through GPT responses as sessionStorage to next page

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream)
    } catch(error) {
        console.log("ERROR", error)
    }
}

function handleSuccess(stream) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    mediaRecorder = new MediaRecorder(stream, mimeType);
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
        console.log("onstop eventhandler sent")
        // Create the blob when recording stops and store it in a global variable
        recordedBlob = new Blob(audioChunks, { type: mimeType });
        audioChunks = [];
        saveRecording(recordedBlob)
    };
    mediaRecorder.start(timeslice);
}

function stopRecording() {
    if (mediaRecorder) {
        //wait for end of 4 seconds. 
        mediaRecorder.stop();
    }
    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;
}

function saveRecording(recordedBlob) {
    convertWebmToWav(recordedBlob)
    file = new File([recordedBlob],"test.wav")
    console.log(file)
}

function sendRecoording() {
    let formData = new FormData()
    formData.append()
}
function sendRecording() {
    if (recordedBlob) {
        const formData = new FormData();
        formData.append('audio', recordedBlob, 'project_recording.wav');

        fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert('Recording saved successfully!');
              } else {
                  alert('Failed to save recording.');
              }
          })
          .catch(error => {
              console.error('Error:', error);
              alert('An error occurred.');
          });
    } else {
        alert('No recording available to send.');
    }
    //Save fetched output in session storage and pull to next page.
}

async function convertWebmToWav(webmBlob) {
    //44100 kh
    //mono
    console.log("conversion attempted")
    const ffmpeg = createFFmpeg({ log: false });
    await ffmpeg.load();
  
    const inputName = 'input.webm';
    const outputName = 'output.mp3';
  
    ffmpeg.FS('writeFile', inputName, await fetch(webmBlob).then((res) => res.arrayBuffer()));
  
    await ffmpeg.run('-i', inputName, outputName);
  
    const outputData = ffmpeg.FS('readFile', outputName);
    const outputBlob = new Blob([outputData.buffer], { type: 'audio/wav' });
    console.log("conversion complete")

    return outputBlob;
  }


main()