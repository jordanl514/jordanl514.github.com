import { AiConversation } from '../../ai-persona/index.js'

function main() {
    let descriptions = JSON.parse(sessionStorage.getItem("hrInput"));
    for (i=0; i < descriptions.length; i++) {
        console.log(descriptions[i])
        generateHR(i+1, descriptions[i])
    }
    document.getElementById("submit-btn").addEventListener('click', () => nxtPage());
}

async function generateHR(i, descStr) {
    console.log(i, descStr);                                                            //DEBUG

    /* From Dylan's code, populate jsonBody element */
    let jsonBody = client.initalPersonaPrompt(descStr)

    
    /* TESTING */
    // descStr = "Output from GPT based off of string " + descStr + "."
    // let jsonBody = JSON.parse('{"name": "John", "age": 30, "comp": "New York", "desc": "' + descStr + '"}');  
    // document.getElementById("desc-resp-"+i).textContent = descStr
    /*         */

    document.getElementById("name-resp-"+i).textContent = jsonBody.name
    document.getElementById("age-resp-"+i).textContent = jsonBody.age
    document.getElementById("comp-resp-"+i).textContent = jsonBody.comp
    document.getElementById("desc-resp-"+i).textContent = descStr.desc               //COMMENT OUT FOR TESTING
    sessionStorage.setItem(`hrOutput${i}`, JSON.stringify(jsonBody));
};
  
function nxtPage() {
    window.location.href = 'talentpool.html'
};

document.addEventListener("DOMContentLoaded", function(event){
    main()
});