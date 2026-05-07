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
        x: object.x + object.width / 2,
        y: object.y + object.height / 2,
    }
}

export function getRadius(object){
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