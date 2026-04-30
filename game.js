const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: (canvas.width / 2) - 20,
    y: (canvas.height / 2) - 20,
    width: 40,
    height: 40,
    speed: 1
};

const enemies = [];

let enemySpawnTimer = 0;
let enemySpawnInterval = 120;

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

document.addEventListener("keydown", (event) => {
    if (event.key === "w") keys.up = true;
    if (event.key === "s") keys.down = true;
    if (event.key === "a") keys.left = true;
    if (event.key === "d") keys.right = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w") keys.up = false;
    if (event.key === "s") keys.down = false;
    if (event.key === "a") keys.left = false;
    if (event.key === "d") keys.right = false;
});

function updatePlayer(){
    if (keys.up) player.y -= player.speed;
    if (keys.down) player.y += player.speed;
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;

    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height; 
}

function spawnEnemy(){
    let size = 30;
    let speed = 0.5;
    let x;
    let y;

    const side = Math.floor(Math.random() * 4);
    if (side === 0) {
        x = Math.random() * canvas.width;
        y = -size;
    } else if (side === 1) {
        x = canvas.width + size;
        y = Math.random() * canvas.height;
    } else if (side === 2) {
        x = Math.random() * canvas.width;
        y = canvas.height + size;
    } else {
        x = -size;
        y = Math.random() * canvas.height;
    }

    enemies.push({
        x: x,
        y: y,
        width: size,
        height: size,
        speed: speed
    });
}

function updateEnemySpawn(){
    enemySpawnTimer++;
    
    if (enemySpawnTimer >= enemySpawnInterval) {
        spawnEnemy();
        enemySpawnTimer = 0;
    }
}

function updateEnemies(){
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        const enemyCenterX = enemy.x + (enemy.width / 2);
        const enemyCenterY = enemy.y + (enemy.height / 2);

        const playerCenterX = player.x + (player.width / 2);
        const playerCenterY = player.y + (player.height / 2);

        const distanceX = playerCenterX - enemyCenterX;
        const distanceY = playerCenterY - enemyCenterY;

        const distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

        if (distance > 0) {
            enemy.x += (distanceX / distance) * enemy.speed;
            enemy.y += (distanceY / distance) * enemy.speed;
        }
    }
}

function update(){
    updatePlayer();
    updateEnemySpawn();
    updateEnemies();
}

function drawPlayer(){
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies(){
    ctx.fillStyle = "red";
    
    for (let i = 0; i < enemies.length; i++){
        const enemy = enemies[i];

        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

function draw(){
    drawPlayer();
    drawEnemies();
}

function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();