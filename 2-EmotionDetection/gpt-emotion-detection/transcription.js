import fs from "fs";
import OpenAI from "openai";
import { getAudioDurationInSeconds } from 'get-audio-duration'

const API_KEY = process.env.OPEN_AI_API_KEY  //HANDLE DIFFERENTLY IN FINAL
const SPLIT_SEGMENT = 4
const AUDIO_LIMIT = 100

export class TranscriptManager {
    constructor(path) {
        this.client = new OpenAI({ apiKey: API_KEY });
        this.transcription = null;
        this.duration = null;
        this.initialised = this.#init(path);
    }
    
    async #init(path) {
        this.transcription = await this.#transcribe(path);
        this.duration = await this.#setDuration(path);
    }

    async #setDuration(path){
        return await getAudioDurationInSeconds(path)
    }

    async #transcribe(path) {
        if (this.duration > AUDIO_LIMIT) {
            console.log("ERROR: audio file too long")
        } else {
            let transcription = await this.client.audio.transcriptions.create({
                file: fs.createReadStream(path),
                model: "whisper-1"
            })
            return transcription.text
        }
        
    }

    async splitTranscription() {
        await this.initialised
        let sentence = await this.transcription
        sentence = sentence.split(" ")
        const wordCount = sentence.length
        const segments = Math.floor((Math.round(parseFloat(await this.duration)) / SPLIT_SEGMENT)) + 1
        const wordsPerSegment = Math.floor(wordCount/segments)
        const result = [];
      
        // Split the words into groups
        for (let i = 0; i < segments; i++) {
            if (i < segments - 1) {
                const start = i * wordsPerSegment;
                const end = start + wordsPerSegment;
                const group = sentence.slice(start, end).join(' ');
                result.push(group);
            } else {
                const start = i * wordsPerSegment;
                const end = wordCount
                const group = sentence.slice(start, end).join(' ');
                result.push(group);
            }
        }
        return [await this.transcription, result]
      }
}

/*
TESTING
const testPath = 'test.wav'
const openai = new TranscriptManager(testPath)
let test = openai.splitTranscription().then(result => {
    console.log("RESULT", result);
  }).catch(error => {
    console.error("ERROR", error);
  });
*/

