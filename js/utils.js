export function normalizeVector(x, y) {
    const length = Math.sqrt(x * x + y * y);

    if (length === 0) return {x: 0, y: 0};

    return {x: x / length, y: y / length};
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function getCenter(object){
    return{
        x: object.x,
        y: object.y
    }
}

export function getRadius(object){
    if (object.hitboxRadius !== undefined) {
        return object.hitboxRadius
    }
    return Math.max(object.width, object.height) / 2;
}

export function getDistance(a, b) {
    const distanceX = a.x - b.x;
    const distanceY = a.y - b.y;

    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}

export function isColliding(a, b) {
    const distance = getDistance(a, b);
    const radiusA = getRadius(a);
    const radiusB = getRadius(b);
    
    return distance < radiusA + radiusB;
}

export function shuffleArray(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const temporary = copy[i];
        copy[i] = copy[randomIndex];
        copy[randomIndex] = temporary;
    }

    return copy;
}

export function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, y);
}

export function formatTime(elapsedTime) {
    const totalSeconds = Math.floor(elapsedTime);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}