export function createPlayer(canvas) {
    return {
        x: (canvas.width / 2) - 20,
        y: (canvas.height / 2) - 20,
        width: 40,
        height: 40,
        speed: 1,
        health: 100,
        damage: 10
    };
}

export function updatePlayer(player, keys, canvas) {
    if (keys.up) player.y -= player.speed;
    if (keys.down) player.y += player.speed;
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;

    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

export function drawPlayer(ctx, player) {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}