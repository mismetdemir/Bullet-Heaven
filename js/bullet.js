import { isColliding } from "./utils.js";
import { createXPOrb } from "./xp.js";
import { playSound } from "./audio.js";

export const bullets = [];

export function resetBullets() {
    bullets.length = 0;
}

export function updatePlayerFiring(player, deltaTime) {
    player.fireTimer += deltaTime;

    if (player.fireTimer >= player.fireInterval) {
        fireBullets(player);
        playSound("fire");
        player.fireTimer = 0;
    }
}

function fireBullets(player) {
    const directionCount = player.weaponLevel;
    const baseAngle = Math.atan2(player.lastDirectionY, player.lastDirectionX);
    const angleStep = (Math.PI * 2) / directionCount;

    for (let i = 0; i < directionCount; i++) {
        const angle = baseAngle + i * angleStep;
        
        const directionX = Math.cos(angle);
        const directionY = Math.sin(angle);

        bullets.push({
            x: player.x,
            y: player.y,

            hitboxRadius: 2.5,

            velocityX: directionX * player.bulletSpeed,
            velocityY: directionY * player.bulletSpeed,

            damage: player.damage,

            color: "white"
        });
    }
}

export function updateBullets(canvas, deltaTime) {
    for (let i = bullets.length -1; i >= 0; i--){
        const bullet = bullets[i];

        bullet.x += bullet.velocityX * deltaTime;
        bullet.y += bullet.velocityY * deltaTime;

        const isOutCanvas = bullet.x < -25 ||
                              bullet.x > canvas.width + 25 ||
                              bullet.y < -25 ||
                              bullet.y > canvas.height + 25;

        if (isOutCanvas) {
            bullets.splice(i, 1);
        }
    }
}

export function handleBulletCollisions(enemies) {
    let killedEnemies = 0;
    let bossKilled = false;

    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        for (let j = enemies.length - 1; j >= 0; j--){
            const enemy = enemies[j];

            if (isColliding(bullet, enemy)) {
                enemy.health -= bullet.damage;
                enemy.damageFlashTimer = enemy.damageFlashDuration;
                
                bullets.splice(i, 1);

                if (enemy.health <= 0) {
                    if (enemy.typeName === "boss") {
                        bossKilled = true;
                    }

                    createXPOrb(enemy.x, enemy.y, enemy.xpValue)
                    enemies.splice(j, 1);
                    killedEnemies++;
                }

                break;
            }
        }
    }

    return {killedEnemies, bossKilled};
}

export function drawBullets(ctx) {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];

        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.hitboxRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}