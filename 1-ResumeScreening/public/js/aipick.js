import { L1FrontendData } from '../../ai-persona/ai-persona.js'

const INPUT_DELAY = 400                                                     //delay onHover by INPUT_DELAY ms
const CAND_PROFILE_WIDTH = document.getElementById("cand-div-1").offsetWidth
const HR_PROFILE_WIDTH = document.getElementById("pick-cont-1").offsetWidth
const CAND_CONT_WIDTH = document.getElementById("cand-cont").offsetWidth
const HR_CONT_WIDTH = document.getElementById("hr-cont-1").offsetWidth

const profileCandidates = JSON.parse(sessionStorage.getItem("candidateDetails"))
const candidatesSelected = JSON.parse(sessionStorage.getItem("selectedCandidates"))
const HR_PROFILES = [JSON.parse(sessionStorage.getItem("hrOutput1")), JSON.parse(sessionStorage.getItem("hrOutput2")), JSON.parse(sessionStorage.getItem("hrOutput3"))]
const client = new L1FrontendData();
  
var hoverTimeouts = []
var candCount
var divList = Array(6).fill(null)
var contList = Array(3).fill(null)

var elementExpanded = false
var candidatesArray = []
var hrSelections

async function main() {
    //Disable progress until information is populated
    const contBtn = document.getElementById("submit-btn")
    contBtn.disabled = true

    //Populate Candidates
    for (let i=1; i < divList.length + 1; i++) {
        divList[i-1] = document.getElementById(`cand-div-${i}`)
    }
    for (let i=1; i < contList.length + 1; i++) {
        contList[i-1] = document.getElementById(`pick-cont-${i}`)
    }
    await populateCandidateContainers()

    //Populate HR Managers
    await populateHRContainers()

    //Enable progress
    contBtn.addEventListener('click', () => nxtPage())
    // contBtn.disabled = false                                                         //Uncomment for final
}

/*################################################ HR FUNCTIONS ###############################################*/
async function populateHRContainers() {
    //Pull HR selections from backend
    hrSelections = await client.pickApplicant(candidatesSelected, HR_PROFILES)

    //Populate HR fields using that information and add event listeners for hover
    for (let i=1; i < contList.length + 1; i++) {
        //Populate HR fields
        populateHR(i, hrSelections[i-1])

        document.getElementById(`pick-cont-${i}`).addEventListener('mouseenter', (event) => scheduleExpand(event, i, "HR"))
        document.getElementById(`pick-cont-${i}`).addEventListener('mouseleave', cancelExpand)
        }
}

function populateHR(i, jsonBody){
    /*
     * Populate individual profiles
     */
    let cand = HR_PROFILES[i-1]
    let candIndex = jsonBody.candSelected - 1

    //Add some sort of better error check here to handle unsafe return from backend
    if (candIndex < 0 || candIndex > 8 ) {
        candIndex = 1
        console.log("ERROR: candSelected was outside the range of 1-9")
    } 

    //Populate HR fields
    document.getElementById(`pick-name-${i}`).innerText = `${cand.name} selected ${profileCandidates[candIndex].name}`
    document.getElementById(`pick-desc-${i}`).innerText = jsonBody.reason
}

function expandHR(i) {
    /*
     * Expand profile of HR Manager
     */
    //Add event listner for off hover
    document.getElementById(`pick-cont-${i}`).addEventListener('mouseleave', () => populateHR(i, hrSelections[i-1]))

    let cand = HR_PROFILES[i-1]
    let content = `<p><strong>Name: </strong>${cand.name}</br>`
    content += `<strong>Age: </strong>${cand.age}</br>`
    content += `<strong>Description: </strong>${cand.desc}</p>`

    //Populate HR fields
    document.getElementById(`pick-desc-${i}`).innerHTML = content
    document.getElementById(`pick-name-${i}`).innerText = `${cand.name}'s Profile`
}

function condenseHR(i) {
    /*
     * Revert to reason why HR would hire candidate
     */
    //Add event listner for on hover
    document.getElementById(`pick-cont-${i}`).removeEventListener('mouseleave', () => populateHR(i, hrSelections[i-1]))

    //Populate HR fields
    populateHR(i, hrSelections[i-1])
}

/*############################################ CANDIDATE FUNCTIONS ############################################*/
async function populateCandidateContainers() {
    /*
     * Populate candidate fields
     */
    //Set up array of candidates selected
    for (let i=0; i < candidatesSelected.length; i++) {
        if (candidatesSelected[i]) {
            candidatesArray.push(profileCandidates[i])
        }
    }
    candCount = candidatesArray.length

    //Set number of profiles necessary to display candidates
    for (let i=1; i < divList.length + 1; i++) {
        if (i < candCount + 1) {
            document.getElementById(`can-name-${i}`).innerText = candidatesArray[i-1].name
            document.getElementById(`can-photo-${i}`).src = candidatesArray[i-1].image
            divList[i-1].addEventListener('mouseenter', (event) => scheduleExpand(event, i, "CANDIDATE"))
            divList[i-1].addEventListener('mouseleave', cancelExpand)
        } else if (i == candCount) {
            //populate document.getElementById("cand-div-"+candCount) with AI genereated candidate
            //only for last page
        } else {
            divList[i-1].style.display = "none"
        }
    }
}

function expandCand(i) {
    /*
     * Expand candidate element and display profile
     */

    //Populate individual candidate profile
    populateCandidate(i, candidatesArray[i-1])

    //Resize element
    document.getElementById(`cand-div-${i}`).style.width = CAND_CONT_WIDTH + 'px'

    //Remove all other elements from view
    for (let j=0; j < candCount; j++) {
        if (j != i-1) {
            console.log(j)
            divList[j].style.display = "none"                                        
        }
    }

    //Add event listener to parent container
    if (!elementExpanded){
        for (let j=0; j<divList.length; j++) {
            if (divList[j]) {
                document.getElementById("cand-cont").removeEventListener('mouseleave', () =>condenseCand(j))
            }
        }
        document.getElementById("cand-cont").addEventListener('mouseleave', () => condenseCand(i));
        elementExpanded = !elementExpanded
    }
}

function condenseCand(i) {
    /*
     * Condense candidate element back to small version
     */
    //Show all elements in view
    for (let j=0; j < candCount; j++) {
        divList[j].style.display = "block"                                        
    }
    //Reset size and remove text
    document.getElementById(`can-desc-${i}`).innerText = ""
    document.getElementById(`cand-div-${i}`).style.width = CAND_PROFILE_WIDTH + 'px'

    if (elementExpanded) {
        document.getElementById("cand-cont").removeEventListener('mouseleave', () => condenseCand(i));
        elementExpanded = !elementExpanded
    }
}

function populateCandidate(i, jsonObject){
    /*
     * Populate individual candidate
     */
    console.log(i,jsonObject)
    let content = `<p><strong>Languages: </strong>${jsonObject.langs}</br>`

    content += `<strong>Graduated: </strong>${jsonObject.grad}</br>`
    content += `<strong>Gender: </strong>${jsonObject.gender}</br>`
    content += `<strong>Experience: </strong>${jsonObject.exp}</br>`
    content += `<strong>Training: </strong>${jsonObject.training}</br>`
    content += `<strong>Skills: </strong>${jsonObject.skills}</br>`
    content += `<strong>Hobbies: </strong>${jsonObject.hobbies}</br></p>`
    // content += `<strong>Soft Skills: </strong>${jsonObject.grad}</br></p>`

    document.getElementById(`can-desc-${i}`).innerHTML = content
}

/*############################################# SCHEDULE FUNCTIONS ############################################*/
function scheduleExpand(event, i, type) {
    const target = event.currentTarget
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

    hoverTimeouts[target.id] = hoverTimeout
}

function cancelExpand(event) {
    const target = event.currentTarget
    if (hoverTimeouts[target.id]) {
        clearTimeout(hoverTimeouts[target.id])
        delete hoverTimeouts[target.id]
    }
}

function nxtPage() {
    window.location.href = 'ai-hr-manager.html'
}

document.addEventListener("DOMContentLoaded", function(event){
    main()
});