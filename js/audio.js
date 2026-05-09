const sounds = {
    fire: new Audio("assets/sounds/fire.mp3"),
    bossDash: new Audio("assets/sounds/boss-dash.mp3"),
    levelUp: new Audio("assets/sounds/level-up.mp3"),
    win: new Audio("assets/sounds/win.mp3"),
    gameOver: new Audio("assets/sounds/game-over.mp3")
};

sounds.fire.volume = 0.1;
sounds.bossDash.volume = 0.6;
sounds.levelUp.volume = 0.5;
sounds.win.volume = 0.7;
sounds.gameOver.volume = 0.7;

export function playSound(soundName) {
    const sound = sounds[soundName];

    if (!sound) return;

    const soundCopy = sound.cloneNode();
    soundCopy.volume = sound.volume;

    soundCopy.play().catch(() => {});
}