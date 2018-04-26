const ship = document.getElementById("ship");
const game = document.getElementById("game");
let timer;
let updateBeat = 30;
let positionX = 0;
let positionY = 0;
let speed = 8;
let topSpeed = 15;
let right;
let left;
let up;
let down;

function startGame(){
    console.log("start Game");
    timer = setInterval(draw,updateBeat);
}

document.onkeydown = function(e) {
    if(e.keyCode === 37 || e.keyCode === 65) left = true;
    if(e.keyCode === 39 || e.keyCode === 68) right = true;
    if(e.keyCode === 38 || e.keyCode === 87) up = true;
    if(e.keyCode === 40 || e.keyCode === 83) down = true;
    if(e.keyCode === 32 ) shoot();
};


document.onkeyup = function(e) {
    if(e.keyCode === 37 || e.keyCode === 65) left = false;
    if(e.keyCode === 39 || e.keyCode === 68) right = false;
    if(e.keyCode === 38 || e.keyCode === 87) up = false;
    if(e.keyCode === 40 || e.keyCode === 83) down = false;
};

function draw() {
    if (left) {
        if (positionY < 0) {
            positionY += speed;
        }

    }
    if (right) {
        if ((positionY *-1) + ship.offsetWidth < game.offsetWidth) {
            positionY -= speed;
        }

    }
    if (up) {
        if (positionX > (-game.offsetHeight/2)) {
            positionX -= speed;
        }
    }
    if (down) {
        if (positionX + ship.offsetHeight < (game.offsetHeight/2)) {
            positionX += speed;
        }
    }
    ship.style.transform = `rotate(90deg) translateX(${positionX}px) translateY(${positionY}px)`;
    console.log("Left: " + positionY + " Top: "+ positionX);
}

function shoot() {
    let bullet = document.createElement("div");
    bullet.className = "bullet";
    ship.appendChild(bullet);


}

function moveLeft() {
    positionY += speed;
    console.log("move right" + positionY);
}

function moveRight(){
   positionY -= speed;
   console.log("move right" + positionY);
}

function moveUp() {
    positionX -= speed;
    console.log("move right" + positionX);
}

function moveDown() {
    positionX += speed;
    console.log("move right" + positionX);
}

