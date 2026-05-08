import { clamp, normalizeVector } from "./utils.js";

export function createPlayer(canvas) {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,

        width: 60,
        height: 60,

        speed: 100,

        maxHealth: 100,
        health: 100,
        armor: 0,
        regen: 2,

        lastDirectionX: 1,
        lastDirectionY:0,

        fireTimer: 0,
        fireInterval: 0.5,
        bulletSpeed: 500,
        damage: 10,

        growth: 1,
        level: 1,
        xp: 0,
        xpToNextLevel: 5,
        magnet: 100,

        selectedUpgrades: [],
        upgradeLevels: {},
        maxUpgradeSlots: 4,

        weaponLevel: 1,

        damageFlashTimer: 0,
        damageFlashDuration: 0.12,

        color: "white"
    };
}


export function updatePlayer(player, keys, canvas, deltaTime) {
    updatePlayerMovement(player, keys, canvas, deltaTime);
    updatePlayerRegeneration(player, deltaTime);
    updatePlayerDamageFlash(player, deltaTime);
}

function updatePlayerMovement(player, keys, canvas, deltaTime) {
    let moveX = 0;
    let moveY = 0;

    if (keys.up) moveY -= 1;
    if (keys.down) moveY += 1;
    if (keys.left) moveX -= 1;
    if (keys.right) moveX += 1;

    const direction = normalizeVector(moveX, moveY);

    player.x += direction.x * player.speed * deltaTime;
    player.y += direction.y * player.speed * deltaTime;

    if (direction.x !== 0 || direction.y !== 0) {
        player.lastDirectionX = direction.x;
        player.lastDirectionY = direction.y;
    }

    player.x = clamp(player.x, player.width / 2, canvas.width - player.width / 2);
    player.y = clamp(player.y, player.height / 2, canvas.height - player.height / 2);
}

function updatePlayerRegeneration(player, deltaTime) {
    if (player.health < player.maxHealth) {
        player.health += player.regen * deltaTime;
    }
    
    if (player.health > player.maxHealth) {
        player.health = player.maxHealth;
    }
}

function updatePlayerDamageFlash(player, deltaTime) {
    if (player.damageFlashTimer > 0) {
        player.damageFlashTimer -= deltaTime;
    }

    if (player.damageFlashTimer < 0) {
        player.damageFlashTimer = 0;
    }
}

export function drawPlayer(ctx, player) {
    if (player.damageFlashTimer > 0) {
        ctx.fillStyle = "#ff1b1b"
    } else {
        ctx.fillStyle = player.color;
    }

    ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}