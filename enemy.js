export const enemies = [];

let enemySpawnTimer = 0;
let enemySpawnInterval = 180;

const enemyTypes = {
    type1: {
        width: 20,
        height: 20,
        speed: 0.75,
        health: 5,
        damage: 0.5,
        color: "red"
    },

    type2: {
        width: 40,
        height: 40,
        speed: 0.25,
        health: 25,
        damage: 1.25,
        color: "green"
    },

    type3: {
        width: 30,
        height: 30,
        speed: 0.5,
        health: 15,
        damage: 0.75,
        color: "purple"
    }
}

function getRandomEnemyType(){
    const typeNames = Object.keys(enemyTypes);
    const randomIndex = Math.floor(Math.random() * typeNames.length);

    return typeNames[randomIndex];
}

function spawnEnemy(canvas) {
    const typeName = getRandomEnemyType();
    const type = enemyTypes[typeName];

    let x;
    let y;

    const side = Math.floor(Math.random() * 4);

    if (side === 0) {
        x = Math.random() * canvas.width;
        y = -size;
    } else if (side === 1) {
        x = canvas.width + size;
        y = Math.random() * canvas.height;
    } else if (side === 2) {
        x = Math.random() * canvas.width;
        y = canvas.height + size;
    } else {
        x = -size;
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
        color: type.color,
        typeName: typeName
    });
}

export function updateEnemySpawn(canvas) {
    enemySpawnTimer++;

    if (enemySpawnTimer >= enemySpawnInterval) {
        spawnEnemy(canvas);
        enemySpawnTimer = 0;
    }
}

export function updateEnemies(player) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        const enemyCenterX = enemy.x + (enemy.width / 2);
        const enemyCenterY = enemy.y + (enemy.height / 2);

        const playerCenterX = player.x + (player.width / 2);
        const playerCenterY = player.y + (player.height / 2);

        const distanceX = playerCenterX - enemyCenterX;
        const distanceY = playerCenterY - enemyCenterY;

        const distance = Math.sqrt(
            (distanceX * distanceX) + 
            (distanceY * distanceY)
        );

        if (distance > 0) {
            enemy.x += (distanceX / distance) * enemy.speed;
            enemy.y += (distanceY / distance) * enemy.speed;
        }
    }
}

export function drawEnemies(ctx) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}