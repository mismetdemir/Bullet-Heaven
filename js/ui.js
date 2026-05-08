import { clamp, wrapText, formatTime } from "./utils.js";
import { upgradeDefinitions } from "./upgrade.js";

export function getStartButtons(canvas) {
    const buttonWidth = 250;
    const buttonHeight = 50;
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
    ctx.font = "bold 80px Arial";
    ctx.fillText("Bullet Heaven", canvas.width / 2, canvas.height / 2 - 130);

    const buttons = getStartButtons(canvas);

    for (let i = 0; i < buttons.length; i++) {
        drawStartButton(ctx, buttons[i]);
    }

    ctx.restore();
}

function drawStartButton(ctx, button) {
    ctx.fillStyle = "white";
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2 + 7);
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
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(formatTime(elapsedTime), canvas.width / 2, 30);
    ctx.restore();
}

function drawUpgradeSlots(ctx, player) {
    const slotSize = 30;
    const gap = 6;
    const startX = 6;
    const startY = 6;

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
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";
    ctx.fillText(upgrade.symbol, x + size / 2, y + size / 2 + 5);
    ctx.restore();
}

function drawXPBar(ctx, canvas, player) {
    const barHeight = 15;
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
    const barWidth = player.width;
    const barHeight = 7;
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
    const level = player.level;

    ctx.fillStyle = "white";
    ctx.font = "bold 25px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Level ${level}`, canvas.width - 10, 30);
    ctx.restore();
}

export function drawPauseScreen(ctx, canvas, player) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWeaponLevelPanel(ctx, player);
    drawPauseUpgradeList(ctx, player);
}

function drawWeaponLevelPanel(ctx, player) {
    const x = 10;
    const y = 50;
    const width = 190;
    const height = 60;

    ctx.fillStyle = "#121212";
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Weapon Level: ${player.weaponLevel}`, x + 30, y + 35);
}

function drawPauseUpgradeList(ctx, player){
    const startX = 10;
    const startY = 120;
    const gap = 8;

    for (let i = 0; i < player.selectedUpgrades.length; i++) {
        const upgradeKey = player.selectedUpgrades[i];
        const level = player.upgradeLevels[upgradeKey];

        drawPauseUpgradeCard(ctx, startX, startY + i * (58 + gap), upgradeKey, level);
    }
}

function drawPauseUpgradeCard(ctx, x, y, upgradeKey, level) {
    const upgrade = upgradeDefinitions[upgradeKey];
    const width = 190;
    const height = 60;
    const iconSize = 40;

    ctx.fillStyle = upgrade.color;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "black";
    ctx.fillRect(x + 8, y + 10, iconSize, iconSize);

    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(upgrade.symbol, x + 8 + iconSize / 2, y + 35);

    ctx.fillStyle = "black";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "left";
    ctx.fillText(upgrade.name, x + 56, y + 24);

    ctx.font = "bold 14px Arial";
    ctx.fillText(`Level ${level}`, x + 56, y + 43);
}

export function drawLevelUpScreen(ctx, canvas, upgradeOptions) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "bold 50px Arial";
    ctx.fillText("Choose Upgrade", canvas.width / 2, canvas.height / 2 - 190);

    ctx.font = "20px Arial";
    ctx.fillText("Press 1 / 2 / 3", canvas.width / 2, canvas.height / 2 - 150);

    const cardWidth = 230;
    const cardHeight = 190;
    const gap = 34;
    const totalWidth = cardWidth * 3 + gap * 2;
    const startX = canvas.width / 2 - totalWidth / 2;
    const startY = canvas.height / 2 - 80;

    for (let i = 0; i < upgradeOptions.length; i++) {
        const upgradeKey = upgradeOptions[i];
        drawUpgradeSelectionCard(ctx, startX + i * (cardWidth + gap), startY, cardWidth, cardHeight, upgradeKey, i + 1);
    }

    ctx.restore();
}

function drawUpgradeSelectionCard(ctx, x, y, width, height, upgradeKey, number) {
    const upgrade = upgradeDefinitions[upgradeKey];
    
    ctx.fillStyle = upgrade.color;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = "black";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(number, x + 25, y + 35);

    const iconSize = 58;
    const iconX = x + width / 2 - iconSize / 2;
    const iconY = y + 26;

    ctx.fillStyle = "black";
    ctx.fillRect(iconX, iconY, iconSize, iconSize);

    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.fillText(upgrade.symbol, x + width / 2, iconY + 39);

    ctx.fillStyle = "black";
    ctx.font = "bold 22px Arial";
    ctx.fillText(upgrade.name, x + width / 2, y + 118);

    ctx.font = "15px Arial";
    wrapText(ctx, upgrade.description, x + width / 2, y + 146, width - 26, 19);
    ctx.textAlign = "left";
}

export function drawGameOverScreen(ctx, canvas, elapsedTime, killCount) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.76)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "bold 54px Arial";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 80);

    ctx.font = "26px Arial";
    ctx.fillText(`Time: ${formatTime(elapsedTime)}`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(`Kill Count: ${killCount}`, canvas.width / 2, canvas.height / 2 + 20);

    ctx.font = "20px Arial";
    ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 75);
    ctx.textAlign = "left";
}