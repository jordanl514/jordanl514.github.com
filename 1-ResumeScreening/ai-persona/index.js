import { OpenAiManager } from "./openai_chat.js";
import { ApplicantManager } from "./applicant_graber.js"
// import readline from 'readline';
// import fs from 'fs/promises';


/***************************************************************************************************
 * The following variables should be user-edited:
 * - `PERSONA_DESCRIPTION`
 * - `APPLICANT_PICK`
 ***************************************************************************************************/
const PERSONA_DESCRIPTION = (
    `
    You are George, a regular Sunday church goer. You've been born and raised in Texas, with your family. You were raised with traditional and conservative values in this household and went to an all boys school growing up. Now you are 28 years old, have a Southern twang, and are a bigoted right winged American working for Big Oil Corp.
    In these next messages, George will be selecting one applicant from a pool of applicants to continue to interview further. After an ordinary fiscal meeting, George, is armed with the statistics of the company's employment portfolio to better help him to select the person best suited to the company.
    You will be asked to choose one applicant to push forward to the next hiring process. You will successfully and truthfully answer all questions with a huge emphasis on your biases.
    `
);


const CHAT_RULES = (
    `
    While responding as this character, you must obey the following rules:
    1) Provide short responses, about 1-2 paragraphs.
    2) Always stay in character, no matter what.
    3) Tell the truth always and do not hide statistics.
    4) Always answer the question directly.
    5) Keep your answers limited to just a few sentences.
    6) Let your biases show, they are present may affect your perception of the questions and your judgement.
    7) You hold many stereotypes and biases and you happily admit them as it's a open and welcoming place of work.
    8) Do not be willing to change your mind on any of your beliefs. Base your answers on your beliefs and do not be open to change. Follow the existing company demographics and do not try to change the statistic.
    Okay, let the discussion begin!
    `
)

const APPLICANT_PICK = [true, true, false, false, false, false, false, false, true, false];


export class AiConversation {

    // OUTPUT JSON object, details of hiring manager, returns the JSON object of the HR person's response
    async initalPersonaPrompt (perDec) {
        const openaiManager = new OpenAiManager();
        const FIRST_SYSTEM_MESSAGE = perDec + CHAT_RULES;
        await openaiManager.systemMessage(FIRST_SYSTEM_MESSAGE);

        // Initial prompt to initialise the persona
        await openaiManager.systemMessage(`
            For your first message only, please format your response as follows, follow the prompts in the brackets. Respond as you would in a professional setting when writing an email to the board of directors:
            "Full Name: [Full Name]
            Age: [Your age in years]
            Company: [The company you work for]
            Introduction: [A brief introduction of yourself to the board of directors]"
            
            Please provide the above information to begin the conversation.
            `
        );

        // Response from HR person introducing themselves
        let response = await openaiManager.chatResponse();

        // Function to convert the HR input string to JSON
        function formatHRToJSON(input) {
            // Split the input string by new lines and remove empty lines
            const lines = input.trim().split('\n').filter(line => line.trim() !== '');
        
            // Create an object to store the parsed data
            const jsonObject = {};
        
            lines.forEach(line => {
            // Split each line by the colon and trim any extra whitespace
            const [key, ...value] = line.split(':');
            const formattedKey = key.trim().toLowerCase().replace(' ', '_');
            const formattedValue = value.join(':').trim();
            
            // Map the formatted keys to the required JSON keys
            switch (formattedKey) {
                case 'full_name':
                jsonObject.name = formattedValue;
                break;
                case 'age':
                jsonObject.age = formattedValue;
                break;
                case 'company':
                jsonObject.comp = formattedValue;
                break;
                case 'introduction':
                jsonObject.desc = formattedValue;
                break;
                default:
                break;
            }
            });
        
            return jsonObject;
        }

        // Ready for front-end
        const responseHrJSON = formatHRToJSON(response);
        return responseHrJSON;
    }
}

async function main() {
    const applicantManager = new ApplicantManager();
    const openaiManager = new OpenAiManager();
    const aiConversation = new AiConversation();

    /***************************************************************************************************
     * The following variables should NOT be user-edited:
     ***************************************************************************************************/
    
    await aiConversation.initalPersonaPrompt(FIRST_SYSTEM_MESSAGE);

    // Prompt to format the next responses
    await openaiManager.systemMessage(`
        The next messages will be a portfolio of people your company received as applicants for your recent job opening.
        You MUST select one applicant out of the pool to interview further, no matter what. Do not format your responses as you did in the first message. Please remember to stay in character and follow the rules.
        `
    );

    const allApplicants = await applicantManager.applicantGetter();
    const arrFilteredApplicants = allApplicants.map((applicant, index) => {
        if (APPLICANT_PICK[index]) {
            return { ...applicant, ogIndex: index };
        }
    }).filter(applicant => applicant);

    let strFilteredApplicants = '';
    arrFilteredApplicants.forEach((applicant) => {
      strFilteredApplicants += `Applicant number: ${applicant.ogIndex + 1}:\n`;
      strFilteredApplicants += `  Name: ${applicant.name}\n`;
      strFilteredApplicants += `  Languages fluent in: ${applicant.langs}\n`;
      strFilteredApplicants += `  Graduation location, graduation year: ${applicant.grad}\n`;
      strFilteredApplicants += `  Gender: ${applicant.gender}\n`;
      strFilteredApplicants += `  Experience: ${applicant.exp}\n`;
      strFilteredApplicants += `  Formal training: ${applicant.training}\n`;
      strFilteredApplicants += `  Skills: ${applicant.skills}\n`;
      strFilteredApplicants += `  Hobby: ${applicant.hobbies}\n`;
      strFilteredApplicants += `  Soft skills: ${applicant.softskills}\n`;
      strFilteredApplicants += `\n`;
    });

    console.log(strFilteredApplicants);

    // Send the selected applicants to the persona
    await openaiManager.systemMessage(strFilteredApplicants);

    // Remind of the persona
    await openaiManager.systemMessage("As a reminder: " + FIRST_SYSTEM_MESSAGE);

    // Propmt to choose an applicant
    let response = await openaiManager.chatWithHistory(`
        Please select one applicant from the pool to interview further using the format template provided:
        Applicant Number: [Applicant number you chose]
        Reasoning: [Why you have chosen this applicant]
        `
    );

    // Function to convert the Applicant Choice input string to JSON
    function formatChoiceToJSON(input) {
        // Split the input string by new lines and remove empty lines
        const lines = input.trim().split('\n').filter(line => line.trim() !== '');
    
        // Create an object to store the parsed data
        const jsonObject = {};
    
        lines.forEach(line => {
        // Split each line by the colon and trim any extra whitespace
        const [key, ...value] = line.split(':');
        const formattedKey = key.trim().toLowerCase().replace(' ', '_');
        const formattedValue = value.join(':').trim();
        
        // Map the formatted keys to the required JSON keys
        switch (formattedKey) {
            case 'applicant_number':
            jsonObject.candSelected = Number(formattedValue);
            break;
            case 'reasoning':
            jsonObject.reason = formattedValue;
            break;
            default:
            break;
        }
        jsonObject.hrDesc = null;
        });
    
        return jsonObject;
    }
    // Ready for front-end
    const responseChoiceJSON = formatChoiceToJSON(response);

    /***************************************************************************************************
     * OUTPUTS
     * These JSON-formatted variables are to be used in the front-end
     ***************************************************************************************************/
    console.log(responseHrJSON);
    console.log(responseChoiceJSON);
}

main();