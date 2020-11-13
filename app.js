const { SSL_OP_NO_QUERY_MTU } = require('constants');
let express = require('express');
let app = express();
let server = require('http').Server(app);
const PORT = 2000;

//Sends the website to the client.
app.get('/', (req,res) => res.sendFile(__dirname + '/client/index.html'));
app.use('/client',express.static(__dirname + '/client'));
var sock = {};
var players = {};
var sockets = {};
var inputs = {};
server.listen(PORT);

let io = require("socket.io")(server,{});
io.sockets.on('connection', (socket) => {
    socket.on("join-request",(data) => {
        if(data.id == "" || players[data.id]){
            socket.emit("invalid-id");
        } else {
            let cplr = {};
            cplr = data;
            socket.emit("joined");
            socket.id = data.id;
            sockets[data.id] = socket;
            players[data.id] = cplr;
            inputs[data.id] = {
                id:data.id,
                up:false,
                down:false,
                left:false,
                right:false
            };

        }
    });

    socket.on("step",(data) => {
        inputs[socket.id] = data;
    });

    socket.on("disconnect", () => {
        delete sockets[socket.id];
        delete players[socket.id];
        delete inputs[socket.id];
    });
});



let gravity = 0.1;
let max_speed = 5;

function dist(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
}

function collied(plr1,plr2){
    let phi = Math.atan2(plr2.y - plr1.y, plr2.x - plr1.x);

    let v1 = dist(plr1.x, plr1.y, plr1.x-plr1.xvel,plr1.y-plr1.yvel);
    let ang1 = Math.atan2(plr1.yvel, plr1.xvel);
    let v2 = dist(plr2.x, plr2.y, plr2.x-plr2.xvel,plr2.y-plr2.yvel);
    let ang2 = Math.atan2(plr2.yvel, plr2.xvel);

    let xvel = (v2*Math.cos(ang2-phi)*Math.cos(phi)+v1*Math.sin(ang1-phi)*Math.cos(phi+Math.PI/2));
    let yvel = (v2*Math.cos(ang2-phi)*Math.sin(phi)+v1*Math.sin(ang1-phi)*Math.sin(phi+Math.PI/2));
    let new_vels = {
        x:xvel,
        y:yvel,
    };
    return new_vels;
}

function collision_check(plr1,plr2){
    if(dist(plr1.x,plr1.y,plr2.x,plr2.y) <= plr1.s/2 + plr2.s/2){
        return true;
    }
    return false;
}

setInterval(function(){
    var data = [];
    for(let i in players){
        if(inputs[i].up){
            players[i].yvel -= gravity*0.75;
        } else if(inputs[i].down){
            players[i].yvel += gravity*0.75;
        }
        if(inputs[i].left){
            players[i].xvel -= 0.1;
            if(players[i].xvel < -max_speed){
                players[i].xvel = -max_speed;
            }
        } else if(inputs[i].right){
            players[i].xvel += 0.1;
            if(players[i].xvel > max_speed){
                players[i].xvel = max_speed;
            }
        } else {
            players[i].xvel *= .99;
        }
        players[i].x += players[i].xvel;
        players[i].y += players[i].yvel;
        players[i].yvel += gravity;
        if(players[i].y + players[i].s/2 > players[i].floor){
            players[i].y = players[i].floor - players[i].s/2;
            players[i].yvel *= -.93;
        }
        for(let j in players){
            if(players[i].id != players[j].id){
                if(collision_check(players[i],players[j])){
                    let new_vels = collied(players[i],players[j]);
                    let new_vels2 = collied(players[j],players[i]);
                    players[i].xvel = new_vels.x;
                    players[i].yvel = new_vels.y;
                    players[j].xvel = new_vels2.x;
                    players[j].yvel = new_vels2.y;
                    while(collision_check(players[i],players[j])){
                        players[i].x += players[i].xvel/2;
                        players[i].y += players[i].yvel/2;
                        players[j].x += players[j].xvel/2;
                        players[j].y += players[j].yvel/2;
                    }
                }
            }
        }
        data.push(players[i]);
    }
    for(let i in sockets){
        sockets[i].emit('step',data);
    }
}, 1000/60);