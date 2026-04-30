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

function update(){
    updatePlayer();
}

function drawPlayer(){
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function draw(){
    drawPlayer();
}

function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();