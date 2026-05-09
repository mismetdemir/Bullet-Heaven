import { normalizeVector, isColliding, getDistance } from "./utils.js";

const orbImage = new Image();
orbImage.src = "assets/images/xpOrb.png";

export const xpOrbs = [];

export function resetXP() {
    xpOrbs.length = 0;
}

export function createXPOrb(x, y, value) {
    xpOrbs.push({
        x: x,
        y: y,
        width: 5,
        height: 5,
        hitboxRadius: 5,
        value: value,
        color: "#00eeff"
    });
}

export function updateXPOrbs(player, deltaTime) {
    let leveledUp = false;

    for (let i = xpOrbs.length - 1; i >= 0; i--) {
        const orb = xpOrbs[i];
        const distanceToPlayer = getDistance(orb, player);

        if (distanceToPlayer < player.magnet) {
            const distanceX = player.x - orb.x;
            const distanceY = player.y - orb.y;
            const direction = normalizeVector(distanceX, distanceY);

            orb.x += direction.x * 125 * deltaTime;
            orb.y += direction.y * 125 * deltaTime;
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

        ctx.imageSmoothingEnabled = false;

        if (orbImage.complete && orbImage.naturalWidth !== 0) {
            ctx.drawImage(orbImage, orb.x - orb.hitboxRadius, orb.y - orb.hitboxRadius, orb.hitboxRadius * 2, orb.hitboxRadius * 2);
        } else {
            ctx.fillStyle = orb.color;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.hitboxRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}