const ship = document.getElementById("ship");
const game = document.getElementById("game");
const sky = document.getElementById("sky");
const ground = document.getElementById("ground");
let timer;
let updateBeat = 10;
let positionX = 0;
let positionY = 0;
let skyPositionX = 0;
let groundPositionX = 0;
const skySpeed = 1;
const groundSpeed = 2;
const speed = 6;
const bulletSpeed = 10;
let right;
let left;
let up;
let down;
let shoot;
let bullets = [];
let bulletCounter = 0;
let enemies = [];
let enemyCounter = 0;

function startGame(){
    console.log("start Game");
    timer = setInterval(draw,updateBeat);
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
    if(e.keyCode === 32 ) {
        shoot = false;
        bulletCounter = 0;
    }
};

function draw() {
    collisionBulletsEnemies();
    bullets.forEach(moveBullets);
    enemies.forEach(moveEnemies);
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
        if (bulletCounter % 10 === 0){
            createBullet();
        }
        bulletCounter ++;
    }
    if (enemyCounter % 50 === 0){
        createEnemy();
    }
    enemyCounter++;

    ship.style.transform = `translateX(${positionX}px) translateY(${positionY}px)`;
    moveBackground()
//    console.log("Left: " + positionX + " Top: "+ positionY);
//    console.log(bullets)
}

function collisionBulletsEnemies() {
    enemies.forEach((enemy)=>{
        bullets.forEach((bullet) => {
            if (bullet.mydata.positionX > enemy.mydata.positionX - enemy.offsetWidth &&
                bullet.mydata.positionY < enemy.mydata.positionY + enemy.offsetHeight &&
                bullet.mydata.positionY + bullet.offsetHeight >  enemy.mydata.positionY) {
                let index = bullets.indexOf(bullet);
                if (index > -1) {
                    bullets.splice(index, 1);
                    game.removeChild(bullet);
                }
                index = enemies.indexOf(enemy);
                if (index > -1) {
                    enemies.splice(index, 1);
                    game.removeChild(enemy);
                }
            }
        });
    });
}

function createBullet() {
    let bullet = document.createElement("div");
    bullet.mydata = {};
    bullet.mydata.positionX = positionX + ship.offsetWidth;
    bullet.mydata.positionY = positionY + ship.offsetHeight/2;
    bullet.className = "bullet";
    bullet.style.transform = `translateX(${bullet.mydata.positionX}px) translateY(${bullet.mydata.positionY}px)`;
    game.appendChild(bullet);
    bullets.push(bullet);

}

function moveBullets(bullet) {
    bullet.mydata.positionX += bulletSpeed;
    if (bullet.mydata.positionX - bullet.style.width > game.offsetWidth/2) {
        let index = bullets.indexOf(bullet);
        if (index > -1) {
            bullets.splice(index, 1);
            game.removeChild(bullet);
        }
    } else {
        bullet.style.transform = `translateX(${bullet.mydata.positionX}px) translateY(${bullet.mydata.positionY}px)`
    }

}

function createEnemy() {
    let enemy = document.createElement("img");
    enemy.src = "img/enemy.png";
    enemy.className = "enemy";
    enemy.mydata = {};
    enemy.mydata.positionX = game.offsetWidth/2 + (Math.floor(Math.random() * 400 ) + enemy.offsetWidth);
    enemy.mydata.positionY = Math.floor((Math.random() * -game.offsetHeight)) + game.offsetHeight/2;
    enemy.style.transform = `translateX(${enemy.mydata.positionX}px) translateY(${enemy.mydata.positionY}px)`;
    game.appendChild(enemy);
    enemies.push(enemy);

}

function moveEnemies(enemy) {
    enemy.mydata.positionX -= speed;
    if (enemy.mydata.positionX - enemy.style.width < -game.offsetWidth/2) {
        let index = enemies.indexOf(enemy);
        if (index > -1) {
            enemies.splice(index, 1);
            game.removeChild(enemy);
        }
    } else {
        enemy.style.transform = `translateX(${enemy.mydata.positionX}px) translateY(${enemy.mydata.positionY}px)`
    }
}

function moveBackground() {
    if (skyPositionX > 19000){
        skyPositionX = 0;
    }
    if (groundPositionX > 19000){
        groundPositionX = 0;
    }
    skyPositionX += skySpeed;
    groundPositionX += groundSpeed;
    sky.style.transform = `translateX(${-skyPositionX}px)`
    ground.style.transform = `translateX(${-groundPositionX}px)`
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

