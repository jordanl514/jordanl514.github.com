function main() {
    console.log("main executed")
    for (let i=1; i<4; i++) {
        let btn = document.getElementById("submit-btn-"+i)
        btn.addEventListener('click', () => nxtPage(i))
    }
}

function nxtPage(i) {
    console.log("nxtPage triggered by", i);

    switch(i) {
        case 1:
            console.log("case 1");
            window.location.href = 'ResumeScreening/resumehome.html';
            break;
        case 2:
            console.log("case 2");
            window.location.href = 'EmotionDetection/emotionhome.html';
            break;
        case 3:
            console.log("case 3");
            window.location.href = 'ResumeScreening/saicreation.html';
            break;
        default:
            console.log("did not progress");
    }
}

document.addEventListener("DOMContentLoaded", function(event){
    main()
});
