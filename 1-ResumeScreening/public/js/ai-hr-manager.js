//  import { selectCandidate } from "../ai-persona/index.js";
const INPUT_DELAY = 400                                                     //delay onHover by INPUT_DELAY ms
const PROFILE_WIDTH = document.getElementById("cand-div-1").offsetWidth
const CONT_WIDTH = document.getElementById("cand-cont").offsetWidth
const profileCandidates = JSON.parse(sessionStorage.getItem("candidateDetails"));
const candidatesSelected = JSON.parse(sessionStorage.getItem("selectedCandidates"));
const hr1 = JSON.parse(sessionStorage.getItem("hrOutput1"));
const hr2 = JSON.parse(sessionStorage.getItem("hrOutput2"));

var hr3
var hoverTimeouts = []
var candCount
var divList = Array(9).fill(null)
var elementExpanded = false

function main() {
    //Populate Candidates
    for (let i=1; i < 7; i++) {
        divList[i-1] = document.getElementById("cand-div-"+i);
    }

    populateCandidateContainers()

    /* TESTING */
    const candidateOutput = JSON.parse('[{"candSelected": 2, "reason": "HR 1 selected candidate 2 because...", "hrDesc": null}, {"candSelected": 0, "reason": "HR selected candidate 0 because...", "hrDesc": null}, {"candSelected": 1, "reason": "HR 3 selected candidate 1 because...", "hrDesc": {"name": "John", "age": 30, "comp": "New York", "desc": "some desc for the AI generated HR person"}}]')
    /*        */

    hr3 = candidateOutput[2].hrDesc

    // Populate Reason
    /* From Dylan's function, give input of candidates and receive output as JSON Array

    save in variable candidateOutput
    // const candidateOutput = selectCandidate(candidatesSelected)                      //UNCOMMENT FOR FINAL

    */

    populateHRContainers(candidateOutput)
}

//HR FUNCTIONS
function populateHRContainers(jsonBody) {  
    for (let i=1; i < 4; i++) {
        populateHR(i, jsonBody)
        let cand = returnCandHR(i)
        document.getElementById("hr-desc-"+i).innerText = jsonBody[i-1].reason
        document.getElementById("hr-cont-"+i).addEventListener('mouseenter', (event) => scheduleExpand(event, i, "HR"));
        document.getElementById("hr-cont-"+i).addEventListener('mouseleave', () => populateHR(i, jsonBody));
        document.getElementById("hr-name-"+i).innerText = cand.name + " selected " + profileCandidates[jsonBody[i-1].candSelected].name
        }
}

function populateHR(i, jsonBody){
    /* This function is for populating the candidate fields using a JSON object. */
    let cand = returnCandHR(i)
    document.getElementById("hr-desc-"+i).innerText = jsonBody[i-1].reason
    document.getElementById("hr-name-"+i).innerText = cand.name + " selected " + profileCandidates[jsonBody[i-1].candSelected].name
}

function expandHR(i) {
    console.log("expand triggered by " + i)
    let cand = returnCandHR(i)
    let content = "<p>"
    content += "<strong>Age: </strong>" + cand.age + "</br>"
    content += "<strong>Description: </strong>" + cand.desc + "</br>" + "</p>"
    document.getElementById("hr-desc-"+i).innerHTML = content
    document.getElementById("hr-name-"+i).innerText = cand.name

    if (!elementExpanded){
        document.getElementById("cand-cont").addEventListener('mouseleave', () => condenseCand(i));
        elementExpanded = !elementExpanded
    }
    // console.log(cand)
}

function returnCandHR(i) {
    switch (i) {
        case 1:
            return hr1
            break
        case 2:
            return hr2
            break
        case 3:
            return hr3
            break
        default:
            console.log("error")
            break
    }
}

//CANDIDATE FUNCTIONS
function populateCandidateContainers() {
    let candidatesArray = []
    for (let i=0; i < candidatesSelected.length; i++) {
        if (candidatesSelected[i]) {
            candidatesArray.push(profileCandidates[i])
        }
    }

    candCount = candidatesArray.length
    for (let i=1; i < 7; i++) {
        if (i < candCount + 1) {
            document.getElementById("can-name-"+i).innerText = candidatesArray[i-1].name
            divList[i-1].addEventListener('mouseenter', (event) => scheduleExpand(event, i, "CANDIDATE"));
            divList[i-1].addEventListener('mouseleave', cancelExpand);
        } else if (i == candCount) {
            //populate document.getElementById("cand-div-"+candCount) with AI genereated candidate
        } else {
            divList[i-1].style.display = "none"
        }
    }
}

function populateCandidate(i, jsonObject){
    console.log(i,jsonObject)
    let content = "<p>"
    content += "<strong>Languages: </strong>" + jsonObject.langs + "</br>"
    content += "<strong>Graduated: </strong>" + jsonObject.grad + "</br>"
    content += "<strong>Gender: </strong>" + jsonObject.gender + "</br>"
    content += "<strong>Experience: </strong>" + jsonObject.exp + "</br>"
    content += "<strong>Training: </strong>" + jsonObject.training + "</br>"
    content += "<strong>Skills: </strong>" + jsonObject.skills + "</br>"
    content += "<strong>Hobbies: </strong>" + jsonObject.hobbies + "</br>"
    content += "<strong>Soft Skills: </strong>" + jsonObject.softskills + "</p>"
    document.getElementById("can-desc-"+i).innerHTML = content
}

function expandCand(i) {
    console.log("expand triggered by " + i)
    populateCandidate(i, profileCandidates[i-1])

    //Remove all other elements from view
    for (let j=0; j < candCount; j++) {
        if (j != i-1) {
            console.log(j)
            divList[j].style.display = "none"                                        
        }
    }

    document.getElementById("cand-div-"+i).style.width = CONT_WIDTH + 'px'
    
    //ADD EVENT LISTENER TO BIG CONTAINER
    if (!elementExpanded){
        document.getElementById("cand-cont").addEventListener('mouseleave', () => condenseCand(i));
        elementExpanded = !elementExpanded
    }
}

function condenseCand(i) {
    console.log("condense triggered from " + i)
    document.getElementById("can-desc-"+i).innerText = ""
    document.getElementById("cand-div-"+i).style.width = PROFILE_WIDTH + 'px'

    for (let j=0; j < candCount; j++) {
        divList[j].style.display = "block"                                        
    }

    if (elementExpanded) {
        document.getElementById("cand-cont").removeEventListener('mouseleave', () => condenseCand(i));
        elementExpanded = !elementExpanded
    }
}

//SCHEDULE FUNCTIONS
function scheduleExpand(event, i, type) {
    const target = event.currentTarget
    expandTarget = target
    const hoverTimeout = setTimeout(() => {
        switch (type) {
            case "HR":
                expandHR(i)
                break
            case "CANDIDATE":
                expandCand(i)
                break
            default:
                console.log("error")
                break
        }
    }, INPUT_DELAY)

    hoverTimeouts[target.id] = hoverTimeout;
}

function cancelExpand(event) {
    const target = event.currentTarget;
    if (hoverTimeouts[target.id]) {
        clearTimeout(hoverTimeouts[target.id]);
        delete hoverTimeouts[target.id];
    }
}

document.addEventListener("DOMContentLoaded", function(event){
    main()
});
