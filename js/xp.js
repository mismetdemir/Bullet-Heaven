import { normalizeVector, isColliding, getDistance } from "./utils.js";

export const xpOrbs = [];

export function resetXP() {
    xpOrbs.length = 0;
}

export function createXPOrb(x, y, value) {
    xpOrbs.push({
        x: x,
        y: y,
        width: 10,
        height: 10,
        hitboxRadius: 10,
        value: value,
        color: "lightblue"
    });
}

export function updateXPOrbs(player, deltaTime) {
    let leveledUp = false;

    for (let i = xpOrbs.length - 1; i >= 0; i--) {
        const orb = xpOrbs[i];
        const distanceToPlayer = getDistance(orb, player);

        if (distanceToPlayer < 100) {
            const distanceX = player.x - orb.x;
            const distanceY = player.y - orb.y;
            const direction = normalizeVector(distanceX, distanceY);

            orb.x += direction.x * 250 * deltaTime;
            orb.y += direction.y * 250 * deltaTime;
        }

        if (isColliding(orb, player)) {
            player.xp += orb.value * player.growth;
            xpOrbs.splice(i, 1);

            if (handlePlayerLevelUp(player)) {
                leveledUp = true;
            }
        }
    }

    return leveledUp;
}

function handlePlayerLevelUp(player) {
    let leveledUp = false;

    while (player.xp >= player.xpToNextLevel) {
        player.xp -= player.xpToNextLevel;
        player.level++;
        player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.2);

        if (player.level % 5 === 0) {
            player.weaponLevel++;
        }

        leveledUp = true;
    }

    return leveledUp;
}

export function drawXPOrbs(ctx) {
    for (let i = 0; i < xpOrbs.length; i++) {
        const orb = xpOrbs[i];

        ctx.fillStyle = orb.color;
        ctx.fillRect(orb.x - orb.width / 2, orb.y - orb.height / 2, orb.width, orb.height);
    }
}