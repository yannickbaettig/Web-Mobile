const ship = document.getElementById("ship");
const game = document.getElementById("game");
const sky = document.getElementById("sky");
const ground = document.getElementById("ground");
const startButton = document.getElementById("start");
const gameOverText = document.getElementById("gameOver");
const score = document.getElementById("score");
const saveScore = document.getElementById("saveScore");
const name = document.getElementById("name");
const highscore = document.getElementById("highscore");
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
const bulletSpeed = 8;
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
const timestamp = () => new Date().getTime();
let lasthit = 0;
let countScore;
let counti;
let enemySpawnTime;
let boss;
let bossSpeed = speed;
let bossBullets = [];

function startGame(){
    console.log("start Game");
    ship.mydata.positionX = 0;
    ship.mydata.positionY = 0;
    startButton.style.display = "none";
    gameOverText.style.display = "none";
    saveScore.style.display = "none";
    saveScore.value="";
    highscore.style.display = "none";
    highscore.innerHTML = "";
    countScore = 0;
    enemySpawnTime = 400;
    counti = 0;
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
    if (boss != null) {
        game.removeChild(boss);
        boss = null;
    }

    createLives();
    timer = setInterval(draw,updateBeat);
    isGameOver = false;
}

function updateHighscore() {
    let requestURL = 'http://localhost:8080/highscore?name='+name.value+'&score='+countScore;
    fetch(requestURL)
        .then((response) =>{
            return response.json();
        })
        .then((players) =>{
            players.forEach((player, index) => {
                let li = document.createElement("li");
                li.value = index + 1;
                li.innerHTML = player.name + " " + player.score;
                highscore.appendChild(li);
            });
            console.log(players);
        }).catch((reject) =>{
            console.log(reject)
    });
    highscore.style.display = "block";
    saveScore.style.display = "none";
}

function gameOver() {
    gameOverText.style.display = "block";
    startButton.style.display = "block";
    saveScore.style.display = "block";
    ship.classList.remove("blink");
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

        if(lasthit+1000 < timestamp()){
            ship.classList.remove("blink");
            if (boss != null) {
                collisionPlayerBoss();
            }
            collisionPlayerEnemies();
        }
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
            if (bulletCounter % 7 === 0) {
                createBullet();
            }
            bulletCounter++;
        }
        bullets.forEach(moveBullets);
        enemies.forEach(moveEnemies);
        bossBullets.forEach(moveBossBullets);
        if (boss != null) {
            moveBoss();
            collisionBulletsBoss();
            if (counti % 50 === 0) {
                createBossBullet();
            }
        }
        if (enemyCounter % enemySpawnTime === 0) {
            createEnemy();
        }
        enemyCounter++;

        if (counti === 500) {
            createBoss();
        }


        if (counti % 10 === 0) {
            countScore += 1;
            enemySpawnTime -= 1;
            enemySpawnTime = clump(enemySpawnTime,50,500)
        }
        score.innerHTML = countScore;

        ship.style.transform = `translateX(${ship.mydata.positionX}px) translateY(${ship.mydata.positionY}px)`;
        moveBackground();
        counti += 1;
    }
}

function clump(value, lower, upper) {
    if (value < lower){
        value = lower;
    } else if (value > upper) {
        value = upper;
    }
    return value;
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
                        countScore += 10;
                    }
                }
            }
        });
    });
}

function collisionBulletsBoss() {
    bullets.forEach((bullet) => {
        if (collision(bullet, boss)) {
            boss.mydata.lives -= 1;
            let index = bullets.indexOf(bullet);
            if (index > -1) {
                bullets.splice(index, 1);
                game.removeChild(bullet);
            }
            if (boss.mydata.lives === 0) {
                    game.removeChild(boss);
                    boss = null;
                    countScore += 100;
                }
            }
        })
}

function collisionPlayerBoss(){
    if (collision(ship, boss)){
        let live = lives.pop();
        game.removeChild(live);
        ship.className = "blink";
        lasthit = timestamp();
        if (lives.length === 0) {
            gameOver();
        }
    }
}

function collisionPlayerEnemies() {
    enemies.forEach((enemy) => {
        if (collision(ship, enemy)) {
            enemy.mydata.lives = 0;
            let live = lives.pop();
            game.removeChild(live);
            ship.className = "blink";
            lasthit = timestamp();
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
    if (bulletCounter % 2 === 0) {
        bullet.mydata.positionY = ship.mydata.positionY + ship.offsetHeight/8;
    } else {
        bullet.mydata.positionY = ship.mydata.positionY + ship.offsetHeight/2 + ship.offsetHeight/8;
    }

    bullet.className = "bullet";
    bullet.style.transform = `translateX(${bullet.mydata.positionX}px) translateY(${bullet.mydata.positionY}px)`;
    game.appendChild(bullet);
    bullets.push(bullet);
    let soundShoot = document.createElement("audio");
    soundShoot.src = "sound/shoot.wav";
    soundShoot.type = "audio/wav";
    soundShoot.play();

}

function createBossBullet() {
    let bullet = document.createElement("div");
    bullet.mydata = {};
    bullet.mydata.positionX = boss.mydata.positionX;
    bullet.mydata.positionY = boss.mydata.positionY + boss.offsetHeight/2;

    bullet.className = "bossBullet";
    bullet.style.transform = `translateX(${bullet.mydata.positionX}px) translateY(${bullet.mydata.positionY}px)`;
    game.appendChild(bullet);
    bossBullets.push(bullet);
    //let soundShoot = document.createElement("audio");
    //soundShoot.src = "sound/shoot.wav";
    //soundShoot.type = "audio/wav";
    //soundShoot.play();
}

function moveBossBullets(bullet) {
    if (bullet.mydata.positionX + bullet.offsetWidth < game.offsetWidth/2) {
        let index = bossBullets.indexOf(bullet);
        if (index > -1) {
            bossBullets.splice(index, 1);
            game.removeChild(bullet);
        }
    } else {
        bullet.mydata.positionX -= bulletSpeed;
        bullet.style.transform = `translateX(${bullet.mydata.positionX}px) translateY(${bullet.mydata.positionY}px)`
    }
}

function moveBullets(bullet) {
    if (bullet.mydata.positionX - bullet.offsetWidth < -game.offsetWidth/2) {
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
    enemy.mydata.lives = 3;
    enemy.style.transform = `translateX(${enemy.mydata.positionX}px) translateY(${enemy.mydata.positionY}px)`;
    game.appendChild(enemy);
    enemies.push(enemy);

}

function createBoss(){
    let bossi = document.createElement("img");
    bossi.src = "img/boss.png";
    bossi.className = "boss";
    bossi.mydata = {};
    bossi.mydata.positionX = game.offsetWidth/2 + (Math.floor(Math.random() * 400 ) + bossi.offsetWidth);
    bossi.mydata.positionY = 0;
    bossi.mydata.lives = 100;
    bossi.style.transform = `translateX(${bossi.mydata.positionX}px) translateY(${bossi.mydata.positionY}px)`;
    game.appendChild(bossi);
    boss = bossi;
}

function moveBoss() {
    if (boss.mydata.positionX + boss.offsetWidth < game.offsetWidth/2 ) {
        if (boss.mydata.positionY <= (-game.offsetHeight/2) || boss.mydata.positionY + boss.offsetHeight >=(game.offsetHeight/2)) {
            bossSpeed = bossSpeed * -1;
        }
        boss.mydata.positionY += bossSpeed;

    } else {
        boss.mydata.positionX -= speed;
    }
    boss.style.transform = `translateX(${boss.mydata.positionX}px) translateY(${boss.mydata.positionY}px)`
}


function moveEnemies(enemy) {
    if (enemy.mydata.positionX + enemy.offsetWidth < -game.offsetWidth/2) {
        let index = enemies.indexOf(enemy);
        if (index > -1) {
            enemies.splice(index, 1);
            game.removeChild(enemy);
        }
    } else {
        enemy.mydata.positionX -= speed;
        enemy.mydata.positionY -= 4 * Math.sin(enemy.mydata.positionX/100);
        enemy.style.transform = `translateX(${enemy.mydata.positionX}px) translateY(${enemy.mydata.positionY}px)`
    }
}

function moveBackground() {
    if (sky.offsetWidth - skyPositionX <= game.offsetWidth){
        skyPositionX = 0;
    }
    if (ground.offsetWidth - groundPositionX  <= game.offsetWidth){
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

