//  import { selectCandidate } from "../ai-persona/index.js";


function main() {
    //Populate Candidates
    var profileCandidates = JSON.parse(sessionStorage.getItem("candidateDetails"));
    var candidatesSelected = JSON.parse(sessionStorage.getItem("selectedCandidates"));

    var countCand = candidatesSelected.filter(x => x=true).length 
    /* UNCOMMENT FOR FINAL */
    // document.getElementById("profile-cont").style.columnCount = countCand
    // var indexCol = 0
    // for (let i=0; i < candidatesSelected.length; i++) {
    //     if (candidatesSelected[i]) {
    //         var colElement = colCont.children[indexCol]
    //         //STYLE COLUMN ELEMENT
    //         colElement.innerHTML = pass //SET HTML DYNAMICALLY
    //         indexCol++
    //     }
    // }
    /*                     */

    // Populate Reason
    /* From Dylan's function, give input of candidates and receive output as JSON Array
    candSelected needs to be in reference to the index of the full candidate list.
    */


    // const candidateOutput = selectCandidate(candidatesSelected)                      //UNCOMMENT FOR FINAL

    /* TESTING */
    var candidateOutput = JSON.parse('[{"candSelected": 2, "reason": "HR 1 selected candidate 2 because...", "hrDesc": null}, {"candSelected": 0, "reason": "HR selected candidate 0 because...", "hrDesc": null}, {"candSelected": 1, "reason": "HR 3 selected candidate 1 because...", "hrDesc": {"name": "John", "age": 30, "comp": "New York", "desc": "some desc for the AI generated HR person"}}]')
    /*        */

    for (let i=1; i<candidateOutput.length+1; i++) {
        var candidateName = profileCandidates[candidateOutput[i-1].candSelected].name
        document.getElementById("reason-"+i).innerHTML = candidateOutput[i-1].reason        
    }

    // Populate HR field
    var hr1 = JSON.parse(sessionStorage.getItem("hrOutput1"));
    var hr2 = JSON.parse(sessionStorage.getItem("hrOutput2"));
    populateHR(1, hr1)
    populateHR(2, hr2)
    populateHR(3, candidateOutput[2].hrDesc)
}

function populateHR(i, jsonObject){
    /* This function is for populating the candidate fields using a JSON object. */
    var content = "<p>"
    content = content + "<strong>Name: </strong>" + jsonObject.name + "</br>"
    content = content + "<strong>Age: </strong>" + jsonObject.age + "</br>"
    content = content + "<strong>Company: </strong>" + jsonObject.comp + "</br></br>"
    content = content + jsonObject.desc + "</p>"
    document.getElementById("hr-info-"+i).innerHTML = content

}

main()