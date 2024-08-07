// import { FFmpeg } from '../../node_modules/@ffmpeg/ffmpeg/dist/esm/index.js'
// import { toBlobURL } from "../../node_modules/@ffmpeg/util/dist/esm/index.js"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL } from '@ffmpeg/util'

const API_ENDPOINT = 'placeholder'
// const API_ENDPOINT = 'https://beyond-human-ser-api-zl6uya4gbq-uc.a.run.app/analyze-emotion'          //UNCOMMENT FOR FINAL

let mediaRecorder
let recordedBlob
let audioChunks = []
let file

const startBtn = document.getElementById('start')
const stopBtn = document.getElementById('stop')
// const sendBtn = document.getElementById('send')
const constraints = { audio: true }
const mimeType = {mimeType: 'audio/webm'}
const timeslice = 4000

// formatting needs to be very specific.
// cutting file into 4s
// add buffer for last recording snippet
// save files
// order matters so save with relevant order
// sending .wav
// output
// pass through GPT responses as sessionStorage to next page

async function main() {
    console.log("main executed")
    let debug = MediaRecorder.isTypeSupported('audio/webm') // false
    console.log(debug)
    startBtn.addEventListener('click', () => startRecording());
    stopBtn.addEventListener('click', () => stopRecording());
    // sendBtn.addEventListener('click', () => sendRecording());
}

async function startRecording() {
    console.log("Recording Audio...")
    try {
        console.log("DEBUG")
        let stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream)
    } catch(error) {
        console.log("ERROR", error)
        return
    }
}

async function handleSuccess(stream) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    mediaRecorder = new MediaRecorder(stream, mimeType);
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
        console.log("Audio Recording stopped.")
        // Create the blob when recording stops and store it in a global variable
        recordedBlob = new Blob(audioChunks, { type: mimeType });
        audioChunks = [];
        await saveRecording(recordedBlob)
    };
    mediaRecorder.start(timeslice);

}

async function stopRecording() {
    if (mediaRecorder) {
        //wait for end of 4 seconds. 
        mediaRecorder.stop();
    }
    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;
}

async function saveRecording(recordedBlob) {
    await convertWebmToWav(recordedBlob)
    file = new File([recordedBlob],"test.webm")
    console.log(file)
}

async function convertWebmToWav(webmBlob) {
    
    const ffmpeg = new FFmpeg({
        log: false
    });
    console.log("loading core!")

    // const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm"
    // const path = "../../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js"

    await ffmpeg.load({
        // coreURL: await toBlobURL('https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.js', "text/javascript"),
        // wasmURL: await toBlobURL('https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.wasm', "application/wasm")
        coreURL: await toBlobURL("../../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL("../../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm", "application/wasm")
      })

    console.log("load complete!")
  
    const inputName = 'input.webm';
    const outputName = 'output.mp3';
  
    ffmpeg.FS('writeFile', inputName, await fetch(webmBlob).then((res) => res.arrayBuffer()));
  
    await ffmpeg.run('-i', inputName, outputName);
  
    const outputData = ffmpeg.FS('readFile', outputName);
    const outputBlob = new Blob([outputData.buffer], { type: 'audio/wav' });
  
    return outputBlob;
  }

// function sendRecording() {
//     let formData = new FormData()
//     formData.append()
// }
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



document.addEventListener("DOMContentLoaded", function(event){
    main()
});