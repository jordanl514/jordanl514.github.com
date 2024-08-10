const MODULE_COUNT = 3

function main() {
    console.log("main executed")
    // Disabling lesson 2 and 3 for first delivery
    let btn2 = document.getElementById('submit-btn-2')
    btn2.disabled = true
    document.getElementById('submit-btn-3').disabled = true

    for (let i=1; i < MODULE_COUNT + 1; i++) {
        document.getElementById(`submit-btn-${i}`).addEventListener('click', () => nxtPage(i))
    }
}

function nxtPage(i) {
    switch(i) {
        case 1:
            console.log("case 1");
            window.location.href = '1-ResumeScreening/public/html/resumehome.html';
            break;
        case 2:
            console.log("case 2");
            window.location.href = '2-EmotionDetection/public/html/emotionhome.html';
            break;
        case 3:
            console.log("case 3");
            window.location.href = '3-ResumeScreening/public/html/aicreation.html';
            break;
        default:
            error.log("did not progress");
    }
}

document.addEventListener("DOMContentLoaded", function(event){
    main()
});
