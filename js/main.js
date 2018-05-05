const ship = document.getElementById("ship");
const game = document.getElementById("game");
const sky = document.getElementById("sky");
const ground = document.getElementById("ground");
const startButton = document.getElementById("start");
const gameOverText = document.getElementById("gameOver");
let timer;
let updateBeat = 10;
ship.mydata = {};
ship.mydata.positionX = 0;
ship.mydata.positionY = 0;
ship.mydata.lives = 3;
let skyPositionX = 0;
let groundPositionX = 0;
const skySpeed = 1;
const groundSpeed = 2;
const speed = 6;
const bulletSpeed = 6;
let right;
let left;
let up;
let down;
let shoot;
let bullets = [];
let bulletCounter = 0;
let enemies = [];
let enemyCounter = 0;
let lives  = [];
let isGameOver = true;


function startGame(){
    console.log("start Game");
    ship.style.display = "block";
    ship.mydata.positionX = 0;
    ship.mydata.positionY = 0;
    startButton.style.display = "none";
    gameOverText.style.display = "none";

    if (bullets.length !== 0){
        bullets.forEach(bullet => {
            game.removeChild(bullet);
        });
        bullets = [];
    }
    if (enemies.length !== 0){
        enemies.forEach(enemy => {
            game.removeChild(enemy);
        });
        enemies = [];
    }

    createLives();
    timer = setInterval(draw,updateBeat);

    isGameOver = false;
}


function gameOver() {
    ship.style.display = "none";
    gameOverText.style.display = "block";
    startButton.style.display = "block";
    isGameOver = true;
    clearInterval(timer);
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
    if (!isGameOver) {
        collisionBulletsEnemies();
        collisionPlayerEnemies();
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
            if (bulletCounter % 10 === 0) {
                createBullet();
            }
            bulletCounter++;
        }
        bullets.forEach(moveBullets);
        enemies.forEach(moveEnemies);

        if (enemyCounter % 50 === 0) {
            createEnemy();
        }
        enemyCounter++;

        ship.style.transform = `translateX(${ship.mydata.positionX}px) translateY(${ship.mydata.positionY}px)`;
        moveBackground()
    }
}

function collisionBulletsEnemies() {
    enemies.forEach((enemy)=>{
        bullets.forEach((bullet) => {
            if (collision(bullet, enemy)) {
                enemy.mydata.lives -= 1;

                let index = bullets.indexOf(bullet);
                if (index > -1) {
                    bullets.splice(index, 1);
                    game.removeChild(bullet);
                }
                if (enemy.mydata.lives === 0) {
                    let index = enemies.indexOf(enemy);
                    if (index > -1) {
                        enemies.splice(index, 1);
                        game.removeChild(enemy);
                    }
                }
            }
        });
    });
}


function collisionPlayerEnemies() {
    enemies.forEach((enemy) => {
        if (collision(ship, enemy)) {
            enemy.mydata.lives = 0;
            let live = lives.pop();
            game.removeChild(live);
            ship.className = "blink";
            ship.
            let index = enemies.indexOf(enemy);
            if (index > -1) {
                enemies.splice(index, 1);
                game.removeChild(enemy);
            }
            if (lives.length === 0) {
               gameOver();
            }
        }
    })
}

function collision(obj1, obj2) {
    return (obj1.mydata.positionX < obj2.mydata.positionX + obj2.offsetWidth &&
        obj1.mydata.positionX + obj1.offsetWidth > obj2.mydata.positionX &&
        obj1.mydata.positionY < obj2.mydata.positionY + obj2.offsetHeight &&
        obj1.mydata.positionY + obj1.offsetHeight >  obj2.mydata.positionY)
}

function createLives() {
    let left = 0;
    for (let i = 0; i < ship.mydata.lives; i++) {
        let live = document.createElement("img");
        live.src = "img/lives.png";
        live.className = "lives";
        live.style.left = left + "px";
        lives.push(live);
        left += 40;
    }

    lives.forEach(live => {
        game.appendChild(live);
    });
}

function createBullet() {
    let bullet = document.createElement("div");
    bullet.mydata = {};
    bullet.mydata.positionX = ship.mydata.positionX + ship.offsetWidth;
    bullet.mydata.positionY = ship.mydata.positionY + ship.offsetHeight/2;
    bullet.className = "bullet";
    bullet.style.transform = `translateX(${bullet.mydata.positionX}px) translateY(${bullet.mydata.positionY}px)`;
    game.appendChild(bullet);
    bullets.push(bullet);

}

function moveBullets(bullet) {
    if (bullet.mydata.positionX - bullet.style.width > game.offsetWidth/2) {
        let index = bullets.indexOf(bullet);
        if (index > -1) {
            bullets.splice(index, 1);
            game.removeChild(bullet);
        }
    } else {
        bullet.mydata.positionX += bulletSpeed;
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
    enemy.mydata.lives = 2;
    enemy.style.transform = `translateX(${enemy.mydata.positionX}px) translateY(${enemy.mydata.positionY}px)`;
    game.appendChild(enemy);
    enemies.push(enemy);

}

function moveEnemies(enemy) {
    if (enemy.mydata.positionX - enemy.style.width < -game.offsetWidth/2) {
        let index = enemies.indexOf(enemy);
        if (index > -1) {
            enemies.splice(index, 1);
            game.removeChild(enemy);
        }
    } else {
        enemy.mydata.positionX -= speed;
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
    sky.style.transform = `translateX(${-skyPositionX}px)`;
    ground.style.transform = `translateX(${-groundPositionX}px)`;
}

function moveLeft() {
    if (ship.mydata.positionX > (-game.offsetWidth/2)) {
        ship.mydata.positionX -= speed;
    }
}

function moveRight(){
    if (ship.mydata.positionX + ship.offsetWidth < (game.offsetWidth/2)) {
        ship.mydata.positionX += speed;
    }
}

function moveUp() {
    if (ship.mydata.positionY > (-game.offsetHeight/2)) {
        ship.mydata.positionY -= speed;
    }
}

function moveDown() {
    if (ship.mydata.positionY + ship.offsetHeight < (game.offsetHeight/2)) {
        ship.mydata.positionY += speed;
    }
}

