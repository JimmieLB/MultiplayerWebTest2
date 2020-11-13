let playerSize = 50;
let gravity = 0.2;
let player;
let inputs;
let players = [];
let id;
let send_rate = 2;
const [W,A,S,D] = [87,65,83,68];
function setup(){
    createCanvas(windowWidth,windowHeight);
    frameRate(60);
    player = {
        id:"",
        x:width/2,
        y:height/2,
        xvel:0,
        yvel:0,
        floor:height,
        s: 40
    };
    inputs = {
        id:"",
        up:false,
        down:false,
        left:false,
        right:false
    };
}

function draw(){
    background(0);
    generate_inputs();
    for(i in players){
        drawPlayer(players[i]);
    }
    if(frameCount%send_rate == 0 && joined){
        sendData();
    }
    if(player.y + playerSize/2 > height){
        player.y = height - playerSize/2;
        player.yvel *= -1;
    }
}

function drawPlayer(plr){
    fill(255);
    ellipse(plr.x,height - plr.y,plr.s);
    players[i].x += players[i].xvel;
    players[i].y += players[i].yvel;
    players[i].yvel -= gravity;
    if(players[i].y < players[i].s/2){
        players[i].y = players[i].s/2;
        players[i].yvel *= -.93;
    }
    fill(100,100,255);
    if(plr.id == player.id){
        fill(100,255,100);
    }
    textSize(playerSize * 0.5);
    textAlign(CENTER);
    text(plr.id,plr.x,height - plr.y - playerSize*0.75);
}

function generate_inputs(){
    if(keyIsDown(UP_ARROW) || keyIsDown(W)){
        inputs.up = true;
    } else {
        inputs.up = false;
    }
    if(keyIsDown(DOWN_ARROW) || keyIsDown(S)){
        inputs.down = true;
    } else {
        inputs.down = false;
    }
    if(keyIsDown(LEFT_ARROW) || keyIsDown(A)){
        inputs.left = true;
    } else {
        inputs.left = false;
    }
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(D)){
        inputs.right = true;
    } else {
        inputs.right = false;
    }
}