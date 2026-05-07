export function normalizeVector(x, y) {
    const length = Math.sqrt(x * x + y * y);

    if (length === 0) return {x: 0, y: 0};

    return {x: x / length, y: y / length};
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}