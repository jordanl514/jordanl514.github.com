var firstPerson = true;
var textFields = [document.getElementById('Text-Area-1'), document.getElementById('Text-Area-2')];

function main() {
    textFields[0].style.display = "block"                                       
    textFields[1].style.display = "none"       
    document.getElementById("nxt-person-btn").addEventListener('click', () => togglePerson());
    document.getElementById("submit-btn").addEventListener('click', () => nxtPage());
}

function togglePerson() {
    firstPerson = !firstPerson;
    console.log("firstPerson:", firstPerson)

    if (firstPerson) {
        document.getElementById("person-hdr").innerHTML = "Person One of Two";
        document.getElementById("nxt-person-btn").innerHTML = "Next";
        textFields[0].style.display = "block"
        textFields[1].style.display = "none"
    } else {
        document.getElementById("person-hdr").innerHTML = "Person Two of Two";
        document.getElementById("nxt-person-btn").innerHTML = "Prev";
        textFields[0].style.display = "none"
        textFields[1].style.display = "block"
    }
}

function fetchDescription() {
    let desc1 = document.getElementById('Text-Area-1').value;
    let desc2 = document.getElementById('Text-Area-2').value;

    if ((desc1 === "") || (desc2 == "")) {
        const nullError = "Null value passed"
        return [false, nullError]
    } else {
        const successMessage = "Success"
        sessionStorage.setItem('hrInput', JSON.stringify([desc1,desc2]));
        return [true, successMessage]
    }
} 

function nxtPage() {
    let funcStatus = fetchDescription()
    console.log(funcStatus[1], funcStatus[0])
    if (funcStatus[0]) {
        window.location.href = 'aicreationresult.html'
    } else {
        console.log("Did not progress", funcStatus[1])
        alert("Ensure both descriptions are filled in before continuing!");
    }
}

main()