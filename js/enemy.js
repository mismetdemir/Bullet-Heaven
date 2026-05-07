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

function getCenter(object){
    return{
        x: object.x + object.width / 2,
        y: object.y + object.height / 2,
    }
}

function getRadius(object){
    return Math.max(object.width, object.height) / 2;
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
        y = -type.height;
    } else if (side === 1) {
        x = canvas.width + type.width;
        y = Math.random() * canvas.height;
    } else if (side === 2) {
        x = Math.random() * canvas.width;
        y = canvas.height + type.height;
    } else {
        x = -type.width;
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
    const playerCenter = getCenter(player);

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const enemyCenter = getCenter(enemy);

        const distanceX = playerCenter.x - enemyCenter.x;
        const distanceY = playerCenter.y - enemyCenter.y;

        const distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

        if (distance > 0) {
            enemy.x += (distanceX / distance) * enemy.speed;
            enemy.y += (distanceY / distance) * enemy.speed;
        }
    }
    
    separateEnemiesFromPlayer(player);
    separateEnemiesFromEachOther();
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

        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}