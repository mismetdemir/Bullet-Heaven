import { keys,consumeKey } from "./input.js";
import { createPlayer, updatePlayer, drawPlayer } from "./player.js";
import { enemies, resetEnemies, updateEnemySpawn, updateEnemies, drawEnemies } from "./enemy.js";
import { drawStartScreen, getStartButtons, drawPauseScreen, drawLevelUpScreen, drawGameOverScreen, drawHUD, drawWinScreen } from "./ui.js";
import { getUpgradeOptions, applyUpgrade } from "./upgrade.js";
import { resetBullets, updatePlayerFiring, updateBullets, handleBulletCollisions, drawBullets } from "./bullet.js";
import { resetXP, createXPOrb, updateXPOrbs, drawXPOrbs } from "./xp.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const GAME_STATE = {
    START: "start",
    PLAYING: "playing",
    LEVEL_UP: "levelUp",
    PAUSED: "paused",
    GAME_OVER: "gameOver",
    WIN: "win"
}

let currentState = GAME_STATE.START;
let lastTime = performance.now();
let player = createPlayer(canvas);

const game = {
    elapsedTime: 0,
    upgradeOptions: [],
    killCount: 0
}

canvas.addEventListener("click", (event) => {
    if (currentState !== GAME_STATE.START) return;

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

function resetGame() {
    player = createPlayer(canvas);
    resetEnemies();
    resetBullets();
    resetXP();
    game.elapsedTime = 0;
    game.upgradeOptions = [];
    game.killCount = 0;
}

function update(deltaTime) {
    game.elapsedTime += deltaTime;

    updatePlayer(player, keys, canvas, deltaTime);
    updateEnemySpawn(canvas, game.elapsedTime, deltaTime);
    updateEnemies(player, deltaTime);
    updatePlayerFiring(player, deltaTime);
    updateBullets(canvas, deltaTime);

    const result = handleBulletCollisions(enemies, createXPOrb);
    game.killCount += result.killedEnemies;

    if (result.bossKilled) {
        currentState = GAME_STATE.WIN;
        return;
    }

    const leveledUp = updateXPOrbs(player, deltaTime);

    if (leveledUp) {
        game.upgradeOptions = getUpgradeOptions(player);
        currentState = GAME_STATE.LEVEL_UP;
    }

    if (player.health <= 0) {
        currentState = GAME_STATE.GAME_OVER;
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawXPOrbs(ctx);
    drawPlayer(ctx, player);
    drawEnemies(ctx);
    drawBullets(ctx);
    drawHUD(ctx, canvas, player, game.elapsedTime);
}

function chooseUpgrade(index) {
    const upgradeKey = game.upgradeOptions[index];
    if (!upgradeKey) return;

    applyUpgrade(player, upgradeKey);
    game.upgradeOptions = [];
    currentState = GAME_STATE.PLAYING;
}

function gameLoop(currentTime) {
    let deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (deltaTime > 0.05) deltaTime = 0.05;

    if (currentState === GAME_STATE.START) {
        drawStartScreen(ctx, canvas);
    } else if (currentState === GAME_STATE.PLAYING) {
        if (consumeKey("escape")) currentState = GAME_STATE.PAUSED;

        update(deltaTime);
        drawGame();
    } else if (currentState === GAME_STATE.PAUSED) {
        if (consumeKey("escape")) currentState = GAME_STATE.PLAYING;

        drawGame();
        drawPauseScreen(ctx, canvas, player);
    } else if (currentState === GAME_STATE.LEVEL_UP) {
        if (consumeKey("one")) chooseUpgrade(0);
        if (consumeKey("two")) chooseUpgrade(1);
        if (consumeKey("three")) chooseUpgrade(2);

        drawGame();
        drawLevelUpScreen(ctx, canvas, game.upgradeOptions);
    } else if (currentState === GAME_STATE.GAME_OVER) {
        if (consumeKey("space")) startGame();
        if (consumeKey("escape")) currentState = GAME_STATE.START;
        
        drawGame();
        drawGameOverScreen(ctx, canvas, game.elapsedTime, game.killCount);
    } else if (currentState === GAME_STATE.WIN) {
        if (consumeKey("space")) startGame();
        if (consumeKey("escape")) currentState = GAME_STATE.START;

        drawGame();
        drawWinScreen(ctx, canvas, game.elapsedTime, game.killCount);
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);