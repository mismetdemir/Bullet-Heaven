import { keys } from "./input.js";
import { createPlayer, updatePlayer, drawPlayer } from "./player.js";
import { enemies, resetEnemies, updateEnemySpawn, updateEnemies, drawEnemies } from "./enemy.js";


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = createPlayer(canvas);

const GAME_STATE = {
    START: "start",
    PLAYING: "playing",
    LEVEL_UP: "levelUp",
    PAUSED: "paused",
    GAME_OVER: "gameOver"
}

let currentState = GAME_STATE.START;
let lastTime = performance.now();
let player = createPlayer(canvas);

const game = {
    elapsedTime: 0
}

canvas.addEventListener("click", (event) => {
    if (currentState === GAME_STATE.START) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const buttons = getStartButtons(canvas);

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const isInside = clickX >= button.x &&
                        clickX <= button.x + button.width &&
                        clickY >= button.y &&
                        clickY <= button.y + button.height;
        
        if (isInside && button.id === "classic") {
            startGame();
        }
    }
})

function startGame() {
    resetGame();
    currentState = GAME_STATE.PLAYING;
}

function resetGame() {{
    player = createPlayer(canvas);
    resetEnemies();
    game.elapsedTime = 0;
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

function gameLoop(currentTime) {
    let deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (deltaTime > 0.05) deltaTime = 0.05;

    if (currentState === GAME_STATE.START) {
        drawStartScreen(ctx, canvas);
    } else if (currentState === GAME_STATE.PLAYING) {
        update(deltaTime);
        drawGame();
    } else if (currentState === GAME_STATE.PAUSED) {
        drawGame();
        drawPauseScreen(ctx, canvas, player);
    } else if (currentState === GAME_STATE.LEVEL_UP) {
        drawGame();
        drawLevelUpScreen(ctx, canvas, player);
    } else if (currentState === GAME_STATE.GAME_OVER) {
        drawGame();
        drawGameOverScreen(ctx, canvas, game.elapsedTime);
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);