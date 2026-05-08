export const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

const pressedKeys = {
    space: false,
    escape: false,
    one: false,
    two: false,
    three: false
};

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (event.key === "w") keys.up = true;
    if (event.key === "s") keys.down = true;
    if (event.key === "a") keys.left = true;
    if (event.key === "d") keys.right = true;

    if (!event.repeat) {
        if (event.code === "Space") pressedKeys.space = true;
        if (event.key === "Escape") pressedKeys.escape = true;
        if (event.key === "1") pressedKeys.one = true;
        if (event.key === "2") pressedKeys.two = true;
        if (event.key === "3") pressedKeys.three = true;
    }
});

document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (event.key === "w") keys.up = false;
    if (event.key === "s") keys.down = false;
    if (event.key === "a") keys.left = false;
    if (event.key === "d") keys.right = false;
});

export function consumeKey(key) {
    if (pressedKeys[key]) {
        pressedKeys[key] = false;
        return true;
    }

    return false;
}