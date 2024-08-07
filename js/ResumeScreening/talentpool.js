const CANDIDATE_LIMIT = [2,5]                                               //Min and Max limit for candidates selected
const INPUT_DELAY = 400                                                     //delay onHover by INPUT_DELAY ms
const PROFILE_WIDTH = document.getElementById("cand-div-1").offsetWidth
const CONT_WIDTH = document.getElementById("cand-cont").offsetWidth
const UNSELECTED_COLOUR = "#a4d3c5"
const SELECTED_COLOUR = "#DDBBC2"

var hoverTimeouts = [];
var candidateSelectedList = Array(9).fill(false)
var divList = Array(9).fill(null);
var jsonBody = ""
var elementExpanded = false

function main() {
    /* From Dylan's code, populate jsonBody element */

    /* TESTING */
    jsonBody = JSON.parse(
        '[{"name": "Anika Kumari", "langs": "Hindi, English", "grad": "High School, 2006", "gender": "Female", "exp": "Anika has 8 years of experience in retail management, overseeing daily operations, staff management, and customer service in large retail stores.", "training": "Anika holds a Bachelor\'s degree in Business Administration from a university in Mumbai.", "skills": "Proficient in inventory management, team leadership, sales analysis, and customer relationship management.", "hobbies": "cooking", "softskills": " Strong leadership and motivational skills, excellent problem-solving abilities, effective communication with staff and customers."},{"name": "Anika Kumari", "langs": "Hindi, English", "grad": "High School, 2006", "gender": "Female", "exp": "Anika has 8 years of experience in retail management, overseeing daily operations, staff management, and customer service in large retail stores.", "training": "Anika holds a Bachelor\'s degree in Business Administration from a university in Mumbai.", "skills": "Proficient in inventory management, team leadership, sales analysis, and customer relationship management.", "hobbies": "cooking", "softskills": " Strong leadership and motivational skills, excellent problem-solving abilities, effective communication with staff and customers."},{"name": "Anika Kumari", "langs": "Hindi, English", "grad": "High School, 2006", "gender": "Female", "exp": "Anika has 8 years of experience in retail management, overseeing daily operations, staff management, and customer service in large retail stores.", "training": "Anika holds a Bachelor\'s degree in Business Administration from a university in Mumbai.", "skills": "Proficient in inventory management, team leadership, sales analysis, and customer relationship management.", "hobbies": "cooking", "softskills": " Strong leadership and motivational skills, excellent problem-solving abilities, effective communication with staff and customers.", "image": "../images/test_profile.png"}]');
    /*         */

    for (let i=1; i<10; i++) {
        //Populate name and picture for all profiles
        document.getElementById("can-name-"+i).innerText = i + ". " + jsonBody[0].name          //TESTING
        // document.getElementById("can-name-"+i).innerText = i + ". " + jsonBody[i-1].name     //UNCOMMENT FOR ACTUAL
        // document.getElementById("can-img-1").src = jsonBody[i-1].image                       //UNCOMMENT FOR ACTUAL

        //Add event listeners to all profiles
        divList[i-1] = document.getElementById("cand-div-"+i);
        divList[i-1].addEventListener('click', () => selectCandidate(i-1));
        divList[i-1].addEventListener('mouseenter', (event) => scheduleExpand(event, i));
        divList[i-1].addEventListener('mouseleave', cancelExpand);
    }
    document.getElementById("submit-btn").addEventListener('click', () => nxtPage())

} 

function expand(i) {
    console.log("expand triggered by " + i)
    populateCandidate(i, jsonBody[0])

    //Remove all other elements from view
    for (let j=0; j < divList.length; j++) {
        if (j != i-1) {
            divList[j].style.display = "none"                                        
        }
    }
    // let parentElement = document.getElementById("cand-div-"+i).parentElement;
    document.getElementById("cand-div-"+i).style.width = CONT_WIDTH + 'px'
    
    //ADD EVENT LISTENER TO BIG CONTAINER
    if (!elementExpanded){
        document.getElementById("cand-cont").addEventListener('mouseleave', () => condense(i));
        elementExpanded = !elementExpanded
    }
}

function condense(i) {
    console.log("condense triggered from " + i)
    document.getElementById("can-desc-"+i).innerText = ""
    document.getElementById("cand-div-"+i).style.width = PROFILE_WIDTH + 'px'

    for (let j=0; j < divList.length; j++) {
        divList[j].style.display = "block"                                        
    }

    if (elementExpanded) {
        document.getElementById("cand-cont").removeEventListener('mouseleave', () => condense(i));
        elementExpanded = !elementExpanded
    }
}

function selectCandidate(iDiv) {
    if (candidateSelectedList[iDiv] == true) {
        console.log(iDiv+1, "deselected!")
        candidateSelectedList[iDiv] = false
        divList[iDiv].style.outline = 'none'
        divList[iDiv].style.backgroundColor = UNSELECTED_COLOUR
    } else {
        let count = countSelected()

        if (count < CANDIDATE_LIMIT[1]) {
            console.log(iDiv+1, "selected!")
            candidateSelectedList[iDiv] = true
            divList[iDiv].style.outline = 'thick solid #af334a'
            divList[iDiv].style.backgroundColor = SELECTED_COLOUR
        }
    }
}

function populateCandidate(i, jsonObject){
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

function nxtPage() {
    console.log("nxtPage() triggered")
    var count = countSelected()
    if (count < CANDIDATE_LIMIT[0]) {
        console.log("Did not progress - Not enough candidates selected")
        alert("You must select at least two candidates to continue!")
        return
    } else {
        sessionStorage.setItem('selectedCandidates', JSON.stringify(candidateSelectedList));
        sessionStorage.setItem('candidateDetails', JSON.stringify(jsonBody));
        window.location.href = 'aipick.html'
    }
}

function countSelected() {
    let count = 0
    for (let i=0; i < candidateSelectedList.length; i++) {
        if (candidateSelectedList[i] == true) {
            count++
        }
    }
    return count
}

function scheduleExpand(event, i) {
    const target = event.currentTarget
    expandTarget = target
    const hoverTimeout = setTimeout(() => {
        expand(i);
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

main()