import { keys } from "./input.js";
import { createPlayer, updatePlayer, drawPlayer } from "./player.js";
import { updateEnemySpawn, updateEnemies, drawEnemies } from "./enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = createPlayer(canvas);

function update() {
    updatePlayer(player, keys, canvas);
    updateEnemySpawn(canvas);
    updateEnemies(player);
}

function draw() {
    drawPlayer(ctx, player);
    drawEnemies(ctx);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();