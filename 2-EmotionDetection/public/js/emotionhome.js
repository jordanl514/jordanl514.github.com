function main(){
    let btn = document.getElementById("submit-btn")
    btn.addEventListener('click', () => nxtPage());
}

function nxtPage() {
    window.location.href = 'emotion-recording.html'
}

main()