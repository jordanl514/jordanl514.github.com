import fs from "fs";
import OpenAI from "openai";

const API_KEY = process.env.OPEN_AI_API_KEY
const EMOTION_DICT = ["happy", "sad", "scared", "neutral", "confident", "nervous"]

export class ReportManager {
    constructor(transcriptSegments, emotionSegments) {
        this.client = new OpenAI({ apiKey: API_KEY });
        this.transcript = null
        this.emotions = null
        this.initialised = this.#init(transcriptSegments, emotionSegments);
    }

    async #init(a1, a2) {
        // console.log(await a1, await a2)
        const a1Len = a1.length
        const a2Len = a2.length
        let diff
        if (a1Len > a2Len) {
            diff = a1Len - a2Len
            for (let _ = 0; _ < diff; _++){
                a1.pop()
            }
        } else if (a2Len > a1Len) {
            diff = a2Len - a1Len
            for (let _ = 0; _ < diff; _++){
                a2.pop()
            }
        } 
        for (let i=0; i<a2.length; i++) {
            a2[i] = EMOTION_DICT[a2[i]]
        }
        this.transcript = a1
        this.emotions = a2
    }

    async assessInterview() {
        const sysMessage = "You are a hiring manager. The user will provide an interview transcript broken up into an array, where each element represents 4 seconds of speech. The user will also provide an array of equal length which corresponds to the emotion portrayed as they spoke that part of the interview. Provide feedback to the user on how they interviewed, but ensure you are not harsh."
        const userMessage = `Interview array: ${this.transcript}, Emotion array: ${this.emotions}`
        const completion = await this.client.chat.completions.create({
            messages: [
                { role: "system", content: sysMessage},
                { role: "user", content: userMessage }
            ],
            model: "gpt-3.5-turbo"
          });
        
          console.log(completion.choices[0].message.content);
    }

    /* TESTING */
    async getTranscripts() {
        await this.initialised
        return [await this.transcript, await this.emotions]
    }
}

/* TESTING */
const transcript = [
    'The quick brown fox jumps over the lazy dog. This sentence is',
    'a common example used to showcase all the letters in the English',
    'alphabet. However, we need more words to reach the target of one',
    "hundred. So, let's add a story. Once upon a time, there was",
    'a curious cat who loved to explore the world. Every day, it',
    'ventured into the forest, discovering new and exciting things. One day, it',
    'found a hidden path that led to a beautiful meadow filled with',
    'colorful flowers. The cat danced joyfully among the blooms, feeling happier than',
    'ever before. As the sun set, it returned home, dreaming of future adventures.'
  ]
const emotions = [5,5,5,3,3,4,4,4,4,4]
const report = new ReportManager(transcript, emotions)
report.assess().then(result => {
    console.log("RESULT", result);
  }).catch(error => {
    console.error("ERROR", error);
  });