import { normalizeVector, getRadius, getCenter, isColliding } from "./utils.js";
 
export const enemies = [];

let enemySpawnTimer = 0;
let enemySpawnInterval = 2;
let minimumSpawnInterval = 0.05;
let enemySpawnAccelerationTimer = 0;
let enemySpawnAccelerationInterval = 3;
let enemySpawnAcceleration = 0.05;

const BOSS_SPAWN_TIME = 180;
let bossSpawned = false;

const bossModeSpawnInterval = 2;
let bossModeEnemyTimer = 0;

const enemyTypes = {
    smallFast: {
        width: 30,
        height: 30,
        speed: 80,
        health: 5,
        damage: 15,
        xpValue: 4,
        color: "orange"
    },

    normal: {
        width: 50,
        height: 50,
        speed: 60,
        health: 20,
        damage: 20,
        xpValue: 10,
        color: "purple"
    },

    tank: { 
        width: 80,
        height: 80,
        speed: 40,
        health: 70,
        damage: 25,
        xpValue: 20,
        color: "blue"
    },

    boss: {
        width: 150,
        height: 150,
        speed: 50,
        health: 10000,
        damage: 200,
        xpValue: 3,
        color: "orange"
    }
}

const enemyTypeOrder = ["smallFast", "normal", "tank"];
const enemyPhaseDuration = 60;

export function resetEnemies() {
    enemies.length = 0;
    enemySpawnTimer = 0;
    enemySpawnInterval = 2;
    bossSpawned = false;
    enemySpawnAccelerationTimer = 0;
    bossModeEnemyTimer = 0;
}

function getCurrentEnemyType(elapsedTime, mode) {
    if (mode === "classic") {
        const currentPhase = Math.floor(elapsedTime / enemyPhaseDuration);

        return enemyTypeOrder[currentPhase];
    } else if (mode === "bossFight") {
        const randomIndex = Math.floor(Math.random() * enemyTypeOrder.length);
        
        return enemyTypeOrder[randomIndex];
    }
}

function spawnEnemy(canvas, elapsedTime, mode) {
    const typeName = getCurrentEnemyType(elapsedTime, mode);
    const type = enemyTypes[typeName];

    if (!type) return;

    let x;
    let y;

    const side = Math.floor(Math.random() * 4);
    const spawnOffset = 60;

    if (side === 0) {
        x = Math.random() * canvas.width;
        y = -spawnOffset;
    } else if (side === 1) {
        x = canvas.width + spawnOffset;
        y = Math.random() * canvas.height;
    } else if (side === 2) {
        x = Math.random() * canvas.width;
        y = canvas.height + spawnOffset;
    } else {
        x = -spawnOffset;
        y = Math.random() * canvas.height;
    }

    enemies.push({
        x: x,
        y: y,

        width: type.width,
        height: type.height,
        speed: type.speed,
        health: type.health,
        damage: type.damage,
        xpValue: type.xpValue,
        color: type.color,
        typeName: typeName,
        damageFlashTimer: 0,
        damageFlashDuration: 0.08,
    });
}

function spawnBoss(canvas) {
    const type = enemyTypes.boss;

    enemies.push({
        x: canvas.width / 2,
        y: -100,

        width: type.width,
        height: type.height,
        speed: type.speed,
        health: type.health,
        damage: type.damage,
        xpValue: type.xpValue,
        color: type.color,
        typeName: "boss",
        damageFlashTimer: 0,
        damageFlashDuration: 0.08,

        dashCooldown: 10,
        dashCooldownTimer: 2,
        dashChargeTime: 2,
        dashChargeTimer: 0,
        dashDuration: 0.5,
        dashTimer: 0,
        dashSpeed: 1500,
        dashDirectionX: 0,
        dashDirectionY: 0,
        dashState: "onCooldown"
    });
}

export function updateEnemySpawn(canvas, elapsedTime, deltaTime, mode) {
    if (mode === "bossFight") {
        if (!bossSpawned) {
            spawnBoss(canvas);
            bossSpawned = true;
        }

        spawnBossFightEnemies(canvas, elapsedTime, deltaTime);
        return;
    }

    if (mode === "classic" && elapsedTime >= BOSS_SPAWN_TIME) {
        if (!bossSpawned) {
            spawnBoss(canvas);
            bossSpawned = true;
            bossModeEnemyTimer = 0;
        }

        spawnBossFightEnemies(canvas, elapsedTime, deltaTime);
        return;
    }

    enemySpawnTimer += deltaTime;
    enemySpawnAccelerationTimer += deltaTime;

    if (enemySpawnAccelerationTimer >= enemySpawnAccelerationInterval) {
        enemySpawnInterval = Math.max(minimumSpawnInterval, enemySpawnInterval - enemySpawnAcceleration);
        enemySpawnAccelerationTimer = 0;
    }

    if (enemySpawnTimer >= enemySpawnInterval) {
        spawnEnemy(canvas, elapsedTime, mode);
        enemySpawnTimer = 0;
    }
}

function spawnBossFightEnemies(canvas, elapsedTime, deltaTime) {
    bossModeEnemyTimer += deltaTime;

    if (bossModeEnemyTimer >= bossModeSpawnInterval) {
        spawnEnemy(canvas, elapsedTime, "bossFight");
        bossModeEnemyTimer = 0;
    }
}

export function updateEnemies(player, deltaTime) {
    moveEnemiesTowardsPlayer(player, deltaTime);
    updateEnemyDamageFlash(deltaTime);
    damagePlayerIfColliding(player, deltaTime);

    separateEnemiesFromPlayer(player);
    separateEnemiesFromEachOther();
}

function moveEnemiesTowardsPlayer(player, deltaTime) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        if (enemy.typeName === "boss") {
            moveBoss(enemy, player, deltaTime);
        } else {
            moveEnemy(enemy, player, deltaTime);
        }
    }
}

function moveEnemy(enemy, player, deltaTime) {
    const distanceX = player.x - enemy.x;
    const distanceY = player.y - enemy.y;

    const direction = normalizeVector(distanceX, distanceY);

    enemy.x += direction.x * enemy.speed * deltaTime;
    enemy.y += direction.y * enemy.speed * deltaTime;
}

function moveBoss(boss, player, deltaTime) {
    if (boss.dashState === "onCooldown") {
        moveEnemy(boss, player, deltaTime);
        
        boss.dashCooldownTimer -= deltaTime;

        if (boss.dashCooldownTimer <= 0) {
            startBossDashCharge(boss, player);
        }
    } else if (boss.dashState === "charging") {
        boss.dashChargeTimer -= deltaTime;

        if (boss.dashChargeTimer <= 0) {
            boss.dashState = "dashing";
            boss.dashTimer = boss.dashDuration;
        }
    } else if (boss.dashState === "dashing") {
        boss.x += boss.dashDirectionX * boss.dashSpeed * deltaTime;
        boss.y += boss.dashDirectionY * boss.dashSpeed * deltaTime;

        boss.dashTimer -= deltaTime;

        if (boss.dashTimer <= 0) {
            boss.dashState = "onCooldown";
            boss.dashCooldownTimer = boss.dashCooldown;
        }
    }
}

function startBossDashCharge(boss, player) {
    const distanceX = player.x - boss.x;
    const distanceY = player.y - boss.y;

    const direction = normalizeVector(distanceX, distanceY);

    boss.dashDirectionX = direction.x;
    boss.dashDirectionY = direction.y;
    boss.dashChargeTimer = boss.dashChargeTime;
    boss.dashState = "charging";
}

function updateEnemyDamageFlash(deltaTime) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        if (enemy.damageFlashTimer > 0) {
            enemy.damageFlashTimer -= deltaTime;
        }

        if (enemy.damageFlashTimer < 0) {
            enemy.damageFlashTimer = 0;
        }
    }
}

function damagePlayerIfColliding(player, deltaTime) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        if (isColliding(player, enemy)) {
            const armorReduction = player.armor;
            const finalDamage = enemy.damage * (1 - armorReduction);

            player.health -= finalDamage * deltaTime;
            player.damageFlashTimer = player.damageFlashDuration;
            
            break;
        }
    }
}

function separateEnemiesFromPlayer(player){
    const playerCenter = getCenter(player);
    const playerRadius = getRadius(player);

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        const enemyCenter = getCenter(enemy);
        const enemyRadius = getRadius(enemy);

        let distanceX = enemyCenter.x - playerCenter.x;
        let distanceY = enemyCenter.y - playerCenter.y;

        let distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

        const minimumDistance = playerRadius + enemyRadius;

        if (distance < minimumDistance) {
            if (distance === 0){
                distanceX = 1;
                distanceY = 0;
                distance = 1;
            }

            const overlap = minimumDistance - distance;

            const pushX = (distanceX / distance) * overlap;
            const pushY = (distanceY / distance) * overlap;

            enemy.x += pushX;
            enemy.y += pushY;
        }
    }
}

function separateEnemiesFromEachOther() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            const enemyA = enemies[i];
            const enemyB = enemies[j];

            const centerA = getCenter(enemyA);
            const centerB = getCenter(enemyB);

            const radiusA = getRadius(enemyA);
            const radiusB = getRadius(enemyB);

            let distanceX = centerB.x - centerA.x;
            let distanceY = centerB.y - centerA.y;

            let distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

            const minimumDistance = radiusA + radiusB;

            if (distance < minimumDistance) {
                if (distance === 0) {
                    distanceX = 1;
                    distanceY = 0;
                    distance = 1;
                }

                const overlap = minimumDistance - distance;

                const pushX = (distanceX / distance) * (overlap / 2);
                const pushY = (distanceY / distance) * (overlap / 2);

                enemyA.x -= pushX;
                enemyA.y -= pushY;

                enemyB.x += pushX;
                enemyB.y += pushY;
            }
        }
    }
}

export function drawEnemies(ctx) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        if (enemy.damageFlashTimer > 0) {
            ctx.fillStyle = "white";
        } else if (enemy.typeName === "boss" && enemy.dashState === "charging") {
            ctx.fillStyle = "red";
        } else if (enemy.typeName === "boss" && enemy.dashState === "dashing") {
            ctx.fillStyle = "yellow";
        } else {
            ctx.fillStyle = enemy.color;
        }

        ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
    }
}