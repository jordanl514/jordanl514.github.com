import { OpenAI } from 'openai';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

// Simple token counting function (not as accurate as tiktoken)
function numTokensFromMessages(messages) {
    return messages.reduce((acc, message) => {
        return acc + 4 + Object.values(message).reduce((sum, value) => sum + value.split(' ').length, 0);
    }, 2);
}

const error = chalk.hex('#f38ba8');
const process = chalk.hex('#fab387');
const result = chalk.hex('#a6e3a1');
const info = chalk.hex('#b4befe');

export class OpenAiManager {
    constructor() {
        this.chatHistory = [];
        this.client = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
    }

    async chat(prompt = "") {
        if (!prompt) {
            console.log(error("Didn't receive input!"));
            return;
        }

        const chatQuestion = [{ role: "user", content: prompt }];
        if (numTokensFromMessages(chatQuestion) > 2000) {
            console.log(error("The length of this chat question is too large for the GPT model"));
            return;
        }

        console.log(process("\nAsking ChatGPT a question..."));
        const completion = await this.client.chat.completions.create({
            model: "gpt-4",
            messages: chatQuestion
        });

        const openaiAnswer = completion.choices[0].message.content;
        // console.log(result(`\n${openaiAnswer}\n`));
        return openaiAnswer;
    }

    async systemMessage(message = "") {
        if (!message) {
            console.log(error("Didn't receive input!"));
            return;
        }
        this.chatHistory.push({ role: "system", content: message });

        console.log(info(`Chat History has a current token length of ${numTokensFromMessages(this.chatHistory)}`));
        while (numTokensFromMessages(this.chatHistory) > 2000) {
            this.chatHistory.splice(4, 1);; // Remove the fifth message (first after system message)
            console.log(process(`Popped a message! New token length is: ${numTokensFromMessages(this.chatHistory)}`));
        }

        console.log(result("\nSystem message sent"));
    }

    async chatResponse() {
        console.log(process("\nGetting response from OpenAI..."));
        const completion = await this.client.chat.completions.create({
            model: "gpt-4",
            messages: this.chatHistory
        });

        this.chatHistory.push(completion.choices[0].message);

        const openaiAnswer = completion.choices[0].message.content;
        // console.log(result(`\n${openaiAnswer}\n`));
        return openaiAnswer;
    }

    async chatWithHistory(prompt = "") {
        if (!prompt) {
            console.log(error("Didn't receive input!"));
            return;
        }

        this.chatHistory.push({ role: "user", content: prompt });

        console.log(info(`Chat History has a current token length of ${numTokensFromMessages(this.chatHistory)}`));
        while (numTokensFromMessages(this.chatHistory) > 8000) {
            this.chatHistory.splice(1, 1); // Remove the second message (first after system message)
            console.log(process(`Popped a message! New token length is: ${numTokensFromMessages(this.chatHistory)}`));
        }

        console.log(process("\nAsking ChatGPT a question..."));
        const completion = await this.client.chat.completions.create({
            model: "gpt-4",
            messages: this.chatHistory
        });

        this.chatHistory.push(completion.choices[0].message);

        const openaiAnswer = completion.choices[0].message.content;
        // console.log(result(`\n${openaiAnswer}\n`));
        return openaiAnswer;
    }

    convertToJSON(input) {
        input.replace(/^\s+|\s+$/g, '');
        const lines = input.split('\n').map(line => line.trim());
        // console.log(lines)
        const jsonObject = {};
      
        lines.forEach(line => {
          const [key, ...value] = line.split(':');
          jsonObject[key.trim()] = value.join(':').trim();
        });
        // console.log("HERES WHAT I GOT:" + input);
        return JSON.stringify(jsonObject, null, 2);
      }
      

    saveResponseToFile(response, fileName = 'responses.txt') {
        try {
            const filePath = path.resolve(fileName);
            console.log(info(`Saving response to ${filePath}`));
            fs.writeFileSync(filePath, response + '\n', 'utf8');
            console.log(result('Response saved successfully.'));
        } catch (err) {
            console.log(error(`Error saving response to file: ${err.message}`));
        }
    }
}