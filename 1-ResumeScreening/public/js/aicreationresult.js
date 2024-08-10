import { L1FrontendData } from '../../ai-persona/ai-persona.js'

const client = new L1FrontendData();

var descriptionCount

async function main() {
    //Disable progress until information is populated
    const contBtn = document.getElementById("submit-btn")
    contBtn.disabled = true

    //Retrieve hrInput from Session Storage, format to JSON object in correct format for backend.
    const hrArray = JSON.parse(sessionStorage.getItem("hrInput"));
    const jsonArray = hrArray.map(desc => ({ desc }));

    //Call to backend
    const descriptions = await client.setPersonas(jsonArray)
    descriptionCount = descriptions.length

    //Populate fields
    for (let i=0; i < descriptionCount; i++) {
        generateHR(i+1, descriptions[i])
    }

    //Enable progress
    contBtn.addEventListener('click', () => nxtPage());
    contBtn.disabled = false
}

async function generateHR(i, jsonBody) {
    //Don't populate perfect HR Manager
    if (i != descriptionCount) {
        document.getElementById("name-resp-"+i).textContent = jsonBody.name
        document.getElementById("age-resp-"+i).textContent = jsonBody.age
        document.getElementById("comp-resp-"+i).textContent = jsonBody.comp
        document.getElementById("desc-resp-"+i).textContent = jsonBody.desc
    }
    
    //Save all hrManagers in session storage
    sessionStorage.setItem(`hrOutput${i}`, JSON.stringify(jsonBody));
    console.log("DEBUG",jsonBody)
};
  
function nxtPage() {
    window.location.href = 'talentpool.html'
};

document.addEventListener("DOMContentLoaded", function(event){
    main()
});
