function main(){
    document.getElementById("submit-btn").addEventListener('click', () => nxtPage());
}

function nxtPage() {
    window.location.href = 'aicreation.html'
}

document.addEventListener("DOMContentLoaded", function(event){
    main()
});