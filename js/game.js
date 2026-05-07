import { keys } from "./input.js";
import { createPlayer, updatePlayer, drawPlayer } from "./player.js";
import { enemies, resetEnemies, updateEnemySpawn, updateEnemies, drawEnemies } from "./enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = createPlayer(canvas);

const game = {
    elapsedTime: 0
}

function update(deltaTime) {
    game.elapsedTime += deltaTime;


    updatePlayer(player, keys, canvas, deltaTime);
    updateEnemySpawn(canvas, game.elapsedTime, deltaTime);
    updateEnemies(player, deltaTime);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "limegreen";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPlayer(ctx, player);
    drawEnemies(ctx);
}

let lastTime = performance.now();

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    update(deltaTime);
    drawGame();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);