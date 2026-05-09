export const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

const consumableKeys = {
    space: false,
    escape: false,
    one: false,
    two: false,
    three: false
};

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "w" || key === "arrowup") keys.up = true;
    if (key === "s" || key === "arrowdown") keys.down = true;
    if (key === "a" || key === "arrowleft") keys.left = true;
    if (key === "d" || key === "arrowright") keys.right = true;

    if (!event.repeat) {
        if (event.code === "Space") consumableKeys.space = true;
        if (event.key === "Escape") consumableKeys.escape = true;
        if (event.key === "1") consumableKeys.one = true;
        if (event.key === "2") consumableKeys.two = true;
        if (event.key === "3") consumableKeys.three = true;
    }
});

document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (key === "w" || key === "arrowup") keys.up = false;
    if (key === "s" || key === "arrowdown") keys.down = false;
    if (key === "a" || key === "arrowleft") keys.left = false;
    if (key === "d" || key === "arrowright") keys.right = false;
});

export function consumeKey(key) {
    if (consumableKeys[key]) {
        consumableKeys[key] = false;
        return true;
    }

    return false;
}