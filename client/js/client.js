let socket;
let joined = false;
let input = document.getElementById("input");
let button = document.getElementById("button");
socket = io();

function sendData(){
    socket.emit("step", inputs);
}

button.onclick = () => {
    player.id = input.value;
    inputs.id = input.value;
    socket.emit("join-request",player);
}

socket.on("invalid-id", () => {
    button.style.background = "red";
    button.innerHTML = "Invalid Name";
    setTimeout(function(){
        button.style.background = "#92FA4F";
        button.innerHTML = "JOIN";
    },2000);
});

socket.on("joined", () => {
    joined = true;
    input.style.display = "none";
    button.style.display = "none";
});

socket.on("step", (data) => {
    players = data;
});