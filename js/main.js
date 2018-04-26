const ship = document.getElementById("ship");
const game = document.getElementById("game");
let timer;
let updateBeat = 10;
let positionX = 0;
let positionY = 0;
const speed = 6;
const bulletSpeed = 10;
let right;
let left;
let up;
let down;
let shoot;
let bullets = [];

function startGame(){
    console.log("start Game");
    timer = setInterval(draw,updateBeat);
    console.log(game.offsetWidth);
    console.log(game.offsetHeight);
}

document.onkeydown = function(e) {
    if(e.keyCode === 37 || e.keyCode === 65) left = true;
    if(e.keyCode === 39 || e.keyCode === 68) right = true;
    if(e.keyCode === 38 || e.keyCode === 87) up = true;
    if(e.keyCode === 40 || e.keyCode === 83) down = true;
    if(e.keyCode === 32 ) shoot = true;
};


document.onkeyup = function(e) {
    if(e.keyCode === 37 || e.keyCode === 65) left = false;
    if(e.keyCode === 39 || e.keyCode === 68) right = false;
    if(e.keyCode === 38 || e.keyCode === 87) up = false;
    if(e.keyCode === 40 || e.keyCode === 83) down = false;
    if(e.keyCode === 32 ) shoot = false;
};

function draw() {
    bullets.forEach(moveBullets);
    if (down) {
        moveDown()
    }
    if (up) {
        moveUp()
    }
    if (left) {
        moveLeft()
    }
    if (right) {
        moveRight()
    }
    if (shoot) {
        createBullets();
    }
    ship.style.transform = `translateX(${positionX}px) translateY(${positionY}px)`;
    console.log("Left: " + positionX + " Top: "+ positionY);
    console.log(bullets)
}

function createBullets() {
    let bullet = document.createElement("div");
    bullet.className = "bullet";
    let bulletPositionX = positionX + ship.offsetWidth;
    let bulletPositionY = positionY + ship.offsetHeight/2;
    bullet.style.transform = `translateX(${bulletPositionX}px) translateY(${bulletPositionY}px)`
    game.appendChild(bullet);
    bullets.push(bullet);

}

function moveBullets(bullet) {
    let matrix = getTranslate(bullet);
    let bulletPositionX = matrix.m41 + bulletSpeed;
    let bulletPositionY = matrix.m42;
    if (bulletPositionX - bullet.style.width > game.offsetWidth/2) {
        let index = bullets.indexOf(bullet);
        if (index > -1) {
            bullets.splice(index, 1);
            game.removeChild(bullet);
        }
    } else {
        bullet.style.transform = `translateX(${bulletPositionX}px) translateY(${bulletPositionY}px)`
    }

}

function getTranslate(object) {
    let style = window.getComputedStyle(object);
    return new WebKitCSSMatrix(style.webkitTransform);
}


function moveLeft() {
    if (positionX > (-game.offsetWidth/2)) {
        positionX -= speed;
    }
}

function moveRight(){
    if (positionX + ship.offsetWidth < (game.offsetWidth/2)) {
        positionX += speed;
    }
}

function moveUp() {
    if (positionY > (-game.offsetHeight/2)) {
        positionY -= speed;
    }
}

function moveDown() {
    if (positionY + ship.offsetHeight < (game.offsetHeight/2)) {
        positionY += speed;
    }
}

