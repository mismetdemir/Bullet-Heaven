import { clamp, wrapText, formatTime } from "./utils.js";
import { upgradeDefinitions } from "./upgrade.js";

export function getStartButtons(canvas) {
    const buttonWidth = 500;
    const buttonHeight = 150;
    const gap = 20;
    const x = canvas.width / 2 - buttonWidth / 2;
    const y = canvas.height / 2 - 20;

    return [
        {
            id: "classic",
            text: "Classic Mode",
            x: x,
            y: y,
            width: buttonWidth,
            height: buttonHeight
        },

        {   id: "boss",
            text: "Boss Fight Mode",
            x: x,
            y: y + buttonHeight + gap,
            width: buttonWidth,
            height: buttonHeight,
        }
    ];
}

export function drawStartScreen(ctx, canvas) {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 200px Arial";
    ctx.fillText("Bullet Heaven", canvas.width / 2, canvas.height / 2 - 130);

    const buttons = getStartButtons(canvas);

    for (let i = 0; i < buttons.length; i++) {
        drawStartButton(ctx, buttons[i]);
    }
}

function drawStartButton(ctx, button) {
    ctx.fillStyle = "white";
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = "black";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2 + 15);
}

export function drawHUD(ctx, canvas, player, elapsedTime) {
    drawTimer(ctx, canvas, elapsedTime);
    drawUpgradeSlots(ctx, player);
    drawXPBar(ctx, canvas, player);
    drawPlayerHealthBar(ctx, player);
    drawPlayerLevel(ctx, canvas, player);
}

function drawTimer(ctx, canvas, elapsedTime) {
    ctx.fillStyle = "white";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(formatTime(elapsedTime), canvas.width / 2, 50);
}

function drawUpgradeSlots(ctx, player) {
    const slotSize = 50;
    const gap = 10;
    const startX = 10;
    const startY = 10;

    for (let i = 0; i < player.maxUpgradeSlots; i++) {
        const x = startX + i * (slotSize + gap);
        const y = startY;

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(x, y, slotSize, slotSize);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, slotSize, slotSize);

        const upgradeKey = player.selectedUpgrades[i];

        if (upgradeKey) {
            drawUpgradeIcon(ctx, x + 5, y + 5, slotSize - 10, upgradeKey);
        }
    }
}

function drawUpgradeIcon(ctx, x, y, size, upgradeKey) {
    const upgrade = upgradeDefinitions[upgradeKey];

    ctx.fillStyle = upgrade.color;
    ctx.fillRect(x, y, size, size);

    ctx.fillStyle = "black";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(upgrade.symbol, x + size / 2, y + size / 2 + 10);
}

function drawXPBar(ctx, canvas, player) {
    const barHeight = 20;
    const barX = 0;
    const barY = canvas.height - barHeight;
    const xpRatio = clamp(player.xp / player.xpToNextLevel, 0, 1);
    const filledWidth = xpRatio * canvas.width;

    ctx.fillStyle = "grey";
    ctx.fillRect(barX, barY, canvas.width, barHeight);

    ctx.fillStyle = "#00eeff";
    ctx.fillRect(barX, barY, filledWidth, barHeight);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, canvas.width, barHeight);
}

function drawPlayerHealthBar(ctx, player) {
    const barWidth = player.width + 10;
    const barHeight = 10;
    const x = player.x - barWidth / 2;
    const y = player.y + player.height / 2 + 8;
    const healthRatio = clamp(player.health / player.maxHealth, 0, 1);

    ctx.fillStyle = "#550404";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#dd0000"
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
}

function drawPlayerLevel(ctx, canvas, player) {
    ctx.fillStyle = "white";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Level ${player.level}`, canvas.width - 10, 50);
}

export function drawPauseScreen(ctx, canvas, player) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWeaponLevelPanel(ctx, player);
    drawPauseUpgradeList(ctx, player);
}

function drawWeaponLevelPanel(ctx, player) {
    const x = 10;
    const y = 70;
    const width = 300;
    const height = 100;

    ctx.fillStyle = "#121212";
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Weapon Level: ${player.weaponLevel}`, x + 30, y + 60);
}

function drawPauseUpgradeList(ctx, player){
    const startX = 10;
    const startY = 180;
    const gap = 10;

    for (let i = 0; i < player.selectedUpgrades.length; i++) {
        const upgradeKey = player.selectedUpgrades[i];
        const level = player.upgradeLevels[upgradeKey];

        drawPauseUpgradeCard(ctx, startX, startY + i * (80 + gap), upgradeKey, level);
    }
}

function drawPauseUpgradeCard(ctx, x, y, upgradeKey, level) {
    const upgrade = upgradeDefinitions[upgradeKey];
    const width = 300;
    const height = 80;
    const iconSize = 60;

    ctx.fillStyle = upgrade.color;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "black";
    ctx.fillRect(x + 8, y + 10, iconSize, iconSize);

    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(upgrade.symbol, x + 9 + iconSize / 2, y + 53);

    ctx.fillStyle = "black";
    ctx.font = "bold 35px Arial";
    ctx.textAlign = "left";
    ctx.fillText(upgrade.name, x + 75, y + 35);

    ctx.font = "30px Arial";
    ctx.fillText(`Level ${level}`, x + 75, y + 70);
}

export function drawLevelUpScreen(ctx, canvas, upgradeOptions) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "bold 100px Arial";
    ctx.fillText("Choose Upgrade", canvas.width / 2, canvas.height / 2 - 400);

    ctx.font = "60px Arial";
    ctx.fillText("Press 1 / 2 / 3", canvas.width / 2, canvas.height / 2 - 300);

    const cardWidth = 460;
    const cardHeight = 380;
    const gap = 70;
    const totalWidth = cardWidth * 3 + gap * 2;
    const startX = canvas.width / 2 - totalWidth / 2;
    const startY = canvas.height / 2 - 160;

    for (let i = 0; i < upgradeOptions.length; i++) {
        const upgradeKey = upgradeOptions[i];

        drawUpgradeSelectionCard(ctx, startX + i * (cardWidth + gap), startY, cardWidth, cardHeight, upgradeKey, i + 1);
    }
}

function drawUpgradeSelectionCard(ctx, x, y, width, height, upgradeKey, number) {
    const upgrade = upgradeDefinitions[upgradeKey];

    ctx.fillStyle = upgrade.color;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "black";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(number, x + 50, y + 70);

    const iconSize = 116;
    const iconX = x + width / 2 - iconSize / 2;
    const iconY = y + 52;

    ctx.fillStyle = "black";
    ctx.fillRect(iconX, iconY, iconSize, iconSize);

    ctx.fillStyle = "white";
    ctx.font = "bold 60px Arial";
    ctx.fillText(upgrade.symbol, x + width / 2, iconY + 78);

    ctx.fillStyle = "black";
    ctx.font = "bold 44px Arial";
    ctx.fillText(upgrade.name, x + width / 2, y + 236);

    ctx.font = "30px Arial";
    wrapText(ctx, upgrade.description, x + width / 2, y + 292, width - 52, 38);
}

export function drawGameOverScreen(ctx, canvas, elapsedTime, killCount) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "bold 110px Arial";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 160);

    ctx.font = "50px Arial";
    ctx.fillText(`Time Survived: ${formatTime(elapsedTime)}`, canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText(`Kill Count: ${killCount}`, canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = "40px Arial";
    ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 150);
}

export function drawWinScreen(ctx, canvas, elapsedTime, killCount) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    
    ctx.font = "bold 110px Arial";
    ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2 - 160);

    ctx.font = "50px Arial";
    ctx.fillText(`Time: ${formatTime(elapsedTime)}`, canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText(`Kill Count: ${killCount}`, canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = "40px Arial";
    ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 150);
}