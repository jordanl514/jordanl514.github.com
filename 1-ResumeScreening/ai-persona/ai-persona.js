import { OpenAiManager } from "./openai_chat.js";
import { ApplicantManager } from "./applicant_graber.js"


/***************************************************************************************************
 * The following variables should be user-edited:
 * - `PERSONA_DESCRIPTION`
 * - `APPLICANT_PICK`
 ***************************************************************************************************/
const PERSONA_DESCRIPTIONS = [
    {
        desc: `
        You are George, a regular Sunday church goer. You've been born and raised in Texas, with your family. You were raised with traditional and conservative values in this household and went to an all boys school growing up. Now you are 28 years old, have a Southern twang, and are a bigoted right winged American working for Big Oil Corp.
        In these next messages, George will be selecting one applicant from a pool of applicants to continue to interview further. After an ordinary fiscal meeting, George, is armed with the statistics of the company's employment portfolio to better help him to select the person best suited to the company.
        You will be asked to choose one applicant to push forward to the next hiring process. You will successfully and truthfully answer all questions with a huge emphasis on your biases.
        `
    },
    {
        desc: `
        You are Barry, a regular Sunday church goer. You've been born and raised in Texas, with your family. You were raised with traditional and conservative values in this household and went to an all boys school growing up. Now you are 42 years old, have a Northern twang, and are a bigoted left winged American working for Small Renewables Corp.
        In these next messages, Barry will be selecting one applicant from a pool of applicants to continue to interview further. After an ordinary fiscal meeting, Barry, is armed with the statistics of the company's employment portfolio to better help him to select the person best suited to the company.
        You will be asked to choose one applicant to push forward to the next hiring process. You will successfully and truthfully answer all questions with a huge emphasis on your biases.
        `
    },
    {
        desc: `
        You are Alex Morgan, a meticulous HR Manager at Innovation Corp. You have been working at Innovation Corp for the past 13 years and have been in the HR department for the past 5 years. You are 35 years old and have a neutral accent. You are a fair and unbiased individual who is looking to hire the best candidate for the job. 
        You are not biased towards any particular group and are looking to hire the best candidate for the job. You have a keen eye for talent and a commitment to diversity and inclusion. You are looking to hire the best candidate for the job and are not biased towards any particular group. You are fair and only look at what skills you see in people, rather than their background.
        Known for your fair and analytical approach, you ensure each potential team member alings with Innovation Corp's values and goals.
        In this conversation, you will be asked to choose one applicant from a pool of applicants to continue to interview further. You will successfully and truthfully answer all questions with a huge emphasis on your unbiasedness.
    `}
]

const PERF_APP = {
    name: 'Jessica Taylor',
    langs: 'English, Spanish',
    grad: 'Graduated High School in 2015, Bachelor’s Degree in Business Administration from the University of California, Los Angeles (UCLA)',
    gender: 'Female',
    exp: 'Jessica has over five years of experience in retail management, where she successfully led a team of 20 employees in a high-volume store. She is adept at increasing sales through effective merchandising strategies and exceptional customer service.',
    training: 'Jessica has completed a Retail Management Certification program, which provided her with advanced techniques in inventory management and customer engagement. Additionally, she participated in leadership workshops to enhance her team-building skills.',
    skills: 'Jessica is skilled in utilizing retail software for inventory control and sales analysis, ensuring efficient operations. She possesses strong communication and interpersonal skills, allowing her to build rapport with both team members and customers.',
    hobbies: 'Jessica enjoys hiking and exploring nature trails in her free time.'
  }


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

const APPLICANT_PICK = [false, true, false, false, false, false, false, false, true, false];



export class L1FrontendData {
    // 3. aicreationresult in Notion
    // INPUT JSON object, decription of two personas
    // OUTPUT JSON object, details of hiring manager, returns the JSON object of the HR person's response
    async setPersonas (perDecs) {
        const aiConversation = new AiConversation();
        let response = await aiConversation.initialPersonaPrompt (perDecs);
        console.log(response);
        return response;
    }

    // 4. talentpool in Notion
    // INPUT none
    // OUTPUT Array of JSON objects, details of the applicants
    async getApplicants () {
        const applicantManager = new ApplicantManager();
        let response = await applicantManager.applicantGetter();
        // console.log(response);
        return response;
    }

    // 5. aipick in Notion
    // INPUT array of booleans, the user's selected applicants
    // OUTPUT JSON array, the AI's response to the user's selected applicants
    async pickApplicant (pickedApps, personaDesc) {
        const applicantManager = new ApplicantManager();
        let strApplicants = await applicantManager.applicantFilter(pickedApps);
        const aiConversation = new AiConversation();
        let response = await aiConversation.applicantPrompt(strApplicants, personaDesc);
        console.log(response);
        return response;
    }

    // 6. ai-applicant in Notion
    // INPUT none
    // OUTPUT JSON, AI generated applicant, perfect for the job.
    async createApplicant () {
        const aiConversation = new AiConversation();
        let response = await aiConversation.systemMessage(`
            You are a helpful and friendly AI assistant. You are here to help the HR manager to find the best candidate for the job. It is a retail management job. You are unbiased and fair and will provide the best candidate for the job.
            Your first task is to create the perfect, ideal candidate by answering a few fields. Please provide the below information. You must provide an answer to each prompt, including the field title, for example "First Name: Adam Smith". Make up the details as you see fit. Do not name the applicant "Ideal Cnadidate" or anything in a similar vain:
            Full Name: Applicant's Full Name
            Languages: Applicant's fluent languages spoken
            Graduation: Graduated High School, Applicant's graduation year. Where the applicant's university is located.
            Gender: Applicant's gender
            Experience: Detail applicant's work experience in two sentences
            Training: Detail applicant's formal training in two sentences
            Skills: Detail applicant's skills, hard and/or soft in two sentences
            Hobbies: List one of the applicant's hobbies
            `);
        console.log(response);
        return response;
    }

    // 6. aipick in Notion
    // INPUT array of booleans, the user's selected applicants
    // OUTPUT JSON array, the AI's response to the user's selected applicants
    async pickPerfApplicant (pickedApps, perfApp, personaDesc) {
        const applicantManager = new ApplicantManager();
        let strApplicants = await applicantManager.applicantFilter(pickedApps);
        let strPerfApp = await applicantManager.applicantFormatter(perfApp);
        const aiConversation = new AiConversation();
        let response = await aiConversation.applicantPrompt(strApplicants + strPerfApp, personaDesc);
        console.log(response);
        return response;
    }
}


export class AiConversation {

    // 3. aicreationresult in Notion
    // INPUT JSON object, decription of two personas
    // OUTPUT JSON object, details of hiring manager, returns the JSON object of the HR person's response
    async initialPersonaPrompt (perDecs) {
        const openaiManager = new OpenAiManager();
        const FIRST_HR_PROMPT = perDecs[0].desc + CHAT_RULES;
        const SECOND_HR_PROMPT = perDecs[1].desc + CHAT_RULES;
        const PREMADE_HR_PROMPT = PERSONA_DESCRIPTIONS[2].desc + CHAT_RULES;
        await openaiManager.systemMessage(FIRST_HR_PROMPT, 1);
        await openaiManager.systemMessage(SECOND_HR_PROMPT, 2);
        await openaiManager.systemMessage(PREMADE_HR_PROMPT, 3);

        // Initial prompt to initialise the persona
        await openaiManager.systemMessage(`
            During this conversation, you must follow the prompts in the brackets. You must provide an answer to each prompt, including the field title, for example "First Name: Adam Smith". 
            Please provide the below information to begin the conversation:
            Full Name: [Full Name]
            Age: [Your age in years]
            Company: [The company you work for]
            Introduction: [A brief introduction of yourself to the board of directors]
            `
        , 4);

        // Function to convert the HR input string to JSON
        function formatHRToJSON(input) {
            console.log(input);
            const lines = input.trim().split('\n').filter(line => line.trim() !== '');
            const jsonObject = {};
            const requiredKeys = ['full_name', 'age', 'company', 'introduction'];
            const foundKeys = [];

            lines.forEach(line => {
                const [key, ...value] = line.split(':');
                const formattedKey = key.trim().toLowerCase().replace(' ', '_');
                const formattedValue = value.join(':').trim();

                switch (formattedKey) {
                    case 'full_name':
                        jsonObject.name = formattedValue;
                        foundKeys.push('full_name');
                        break;
                    case 'age':
                        jsonObject.age = formattedValue;
                        foundKeys.push('age');
                        break;
                    case 'company':
                        jsonObject.comp = formattedValue;
                        foundKeys.push('company');
                        break;
                    case 'introduction':
                        jsonObject.desc = formattedValue;
                        foundKeys.push('introduction');
                        break;
                    default:
                        break;
                }
            });

            const missingKeys = requiredKeys.filter(key => !foundKeys.includes(key));
            return { jsonObject, missingKeys };
        }

        // Function to get complete HR response
        async function getCompleteHRResponse(hrNumber) {
            let response;
            let result;
            do {
                response = await openaiManager.chatResponse(hrNumber);
                result = formatHRToJSON(response);
                console.log(result)
            } while (result.missingKeys.length > 0);
            return result.jsonObject;
        }

        // Response from HR person introducing themselves
        const hr1ResponseJSON = await getCompleteHRResponse(1);
        const hr2ResponseJSON = await getCompleteHRResponse(2);
        const hr3ResponseJSON = await getCompleteHRResponse(3);

        // Ready for front-end
        let hrResponseArray = [];
        hrResponseArray.push(hr1ResponseJSON);
        hrResponseArray.push(hr2ResponseJSON);
        hrResponseArray.push(hr3ResponseJSON);
        

        // EXAMPLE OUTPUT
        // console.log(hrResponseArray);
        return hrResponseArray;
    }

    // 4. talentpool in Notion
    async applicantPrompt (strApplicants, personaDesc) {
        // console.log(strApplicants);
        const openaiManager = new OpenAiManager();

        // Remind of the persona
        await openaiManager.systemMessage(personaDesc[0].desc + CHAT_RULES, 1);
        await openaiManager.systemMessage(personaDesc[1].desc + CHAT_RULES, 2);
        await openaiManager.systemMessage(personaDesc[2].desc + CHAT_RULES, 3);

        // Send the selected applicants to the persona
        await openaiManager.systemMessage(strApplicants, 4);
    
    
        // Propmt to choose an applicant
        await openaiManager.systemMessage(`
            You must select one applicant from the pool to interview further using the format template provided:
            Applicant Number: [Applicant number you chose]
            Reasoning: [Why you have chosen this applicant]
            `
        , 4);
    
        // Function to convert the Applicant Choice input string to JSON
        function formatChoiceToJSON(input) {
            // Split the input string by new lines and remove empty lines
            const lines = input.trim().split('\n').filter(line => line.trim() !== '');
        
            // Create an object to store the parsed data
            const jsonObject = {};
            const requiredKeys = ['applicant_number', 'reasoning'];
            const foundKeys = [];
        
            lines.forEach(line => {
            // Split each line by the colon and trim any extra whitespace
            const [key, ...value] = line.split(':');
            const formattedKey = key.trim().toLowerCase().replace(' ', '_');
            const formattedValue = value.join(':').trim();
            
            // Map the formatted keys to the required JSON keys
            switch (formattedKey) {
                case 'applicant_number':
                jsonObject.candSelected = Number(formattedValue);
                foundKeys.push('applicant_number');
                break;
                case 'reasoning':
                jsonObject.reason = formattedValue;
                foundKeys.push('reasoning');
                break;
                default:
                break;
            }
            });
        
            const missingKeys = requiredKeys.filter(key => !foundKeys.includes(key));
            return { jsonObject, missingKeys };
        }

        // Function to get complete HR response
        async function getCompleteHRResponse(hrNumber) {
            let response;
            let result;
            do {
                response = await openaiManager.chatResponse(hrNumber);
                result = formatChoiceToJSON(response);
            } while (result.missingKeys.length > 0);
            return result.jsonObject;
        }

        // Response from HR person introducing themselves
        const hr1ResponseJSON = await getCompleteHRResponse(1);
        const hr2ResponseJSON = await getCompleteHRResponse(2);
        const hr3ResponseJSON = await getCompleteHRResponse(3);

        let hrResponseArray = [];
        hrResponseArray.push(hr1ResponseJSON);
        hrResponseArray.push(hr2ResponseJSON);
        hrResponseArray.push(hr3ResponseJSON);

        // EXAMPLE OUTPUT
        // console.log(hrResponseArray);
        return hrResponseArray;
    }

    // 6. ai-applicant in Notion
    async systemMessage (prompt) {
        const openaiManager = new OpenAiManager();
        await openaiManager.systemMessage(prompt, 5);


        // Function to convert the Applicant input string to JSON
        function formatApplicantToJSON(input) {
            const lines = input.trim().split('\n').filter(line => line.trim() !== '');
            const jsonObject = {};
            const requiredKeys = ['full_name', 'languages', 'graduation', 'gender', 'experience', 'training', 'skills', 'hobbies'];
            const foundKeys = [];

            lines.forEach(line => {
                const [key, ...value] = line.split(':');
                const formattedKey = key.trim().toLowerCase().replace(' ', '_');
                const formattedValue = value.join(':').trim();

                switch (formattedKey) {
                    case 'full_name':
                        jsonObject.name = formattedValue;
                        foundKeys.push('full_name');
                        break;
                    case 'languages':
                        jsonObject.langs = formattedValue;
                        foundKeys.push('languages');
                        break;
                    case 'graduation':
                        jsonObject.grad = formattedValue;
                        foundKeys.push('graduation');
                        break;
                    case 'gender':
                        jsonObject.gender = formattedValue;
                        foundKeys.push('gender');
                        break;
                    case 'experience':
                        jsonObject.exp = formattedValue;
                        foundKeys.push('experience');
                        break;
                    case 'training':
                        jsonObject.training = formattedValue;
                        foundKeys.push('training');
                        break;
                    case 'skills':
                        jsonObject.skills = formattedValue;
                        foundKeys.push('skills');
                        break;
                    case 'hobbies':
                        jsonObject.hobbies = formattedValue;
                        foundKeys.push('hobbies');
                        break;
                    default:
                        break;
                }
            });

            const missingKeys = requiredKeys.filter(key => !foundKeys.includes(key));
            return { jsonObject, missingKeys };
        }

        // Function to get complete response
        async function getCompleteApplicantResponse() {
            let response;
            let result;
            do {
                response = await openaiManager.chatResponse(5);
                result = formatApplicantToJSON(response);
            } while (result.missingKeys.length > 0);
            return result.jsonObject;
        }

        // Response from HR person introducing themselves
        const responseJSON = await getCompleteApplicantResponse();
        return responseJSON;
    }
}


// async function main() {
//     const l1FrontendData = new L1FrontendData();
//     await l1FrontendData.pickPerfApplicant(APPLICANT_PICK, PERF_APP, PERSONA_DESCRIPTIONS);
//     // await l1FrontendData.createApplicant();
//     // console.log(await l1FrontendData.setPersonas(PERSONA_DESCRIPTIONS));
//     // await l1FrontendData.getApplicants();
//     // l1FrontendData.pickApplicant(APPLICANT_PICK, PERSONA_DESCRIPTIONS);

//     /***************************************************************************************************
//      * The following variables should NOT be user-edited:
//      ***************************************************************************************************/
    
//     // // Prompt to format the next responses
//     // await openaiManager.systemMessage(`
//     //     The next messages will be a portfolio of people your company received as applicants for your recent job opening.
//     //     You MUST select one applicant out of the pool to interview further, no matter what. Do not format your responses as you did in the first message. Please remember to stay in character and follow the rules.
//     //     `
//     // );

//     // const allApplicants = await applicantManager.applicantGetter();
    

//     /***************************************************************************************************
//      * OUTPUTS
//      * These JSON-formatted variables are to be used in the front-end
//      ***************************************************************************************************/
//     // console.log(responseHrJSON);
//     // console.log(responseChoiceJSON);
// }

// main();