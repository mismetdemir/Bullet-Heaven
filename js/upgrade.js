import { shuffleArray } from "./utils.js";

export const upgradeDefinitions = {
    maxHealth: {
        key: "maxHealth",
        name: "Max Health",
        symbol: "H",
        color: "#ea1717",
        description: "Increase maximum health"
    },

    armor: {
        key: "armor",
        name: "Armor",
        symbol: "A",
        color: "#94a3b8",
        description: "Reduce incoming damage"
    },

    regen: {
        key: "regen",
        name: "Regen",
        symbol: "R",
        color: "#1ce164",
        description: "Increase health regen"
    },

    speed: {
        key: "speed",
        name: "Speed",
        symbol: "S",
        color: "#facc15",
        description: "Move faster"
    },

    bulletSpeed: {
        key: "bulletSpeed",
        name: "Bullet Speed",
        symbol: "B",
        color: "#87cbe9",
        description: "Bullets travel faster"
    },

    growth: {
        key: "growth",
        name: "Growth",
        symbol: "G",
        color: "#8e2ee9",
        description: "Gain more XP"
    },

    firingSpeed: {
        key: "firingSpeed",
        name: "Firing Speed",
        symbol: "F",
        color: "#e96a7d",
        description: "Use weapon faster"
    },

    damage: {
        key: "damage",
        name: "Damage",
        symbol: "D",
        color: "#f97316",
        description: "Increase bullet damage"
    },

    magnet: {
        key: "magnet",
        name: "Magnet",
        symbol: "M",
        color: "#0f1ae8",

    }
};

export function getUpgradeOptions(player) {
    let upgradePool;

    if (player.selectedUpgrades.length >= player.maxUpgradeSlots) {
        upgradePool = [...player.selectedUpgrades];
    } else {
        upgradePool = Object.keys(upgradeDefinitions);
    }

    const shuffled = shuffleArray(upgradePool);
    return shuffled.slice(0, 3);
}

export function applyUpgrade(player, upgradeKey) {
    const alreadySelected = player.selectedUpgrades.includes(upgradeKey);

    if (!alreadySelected) {
        if (player.selectedUpgrades.length >= player.maxUpgradeSlots) {
            return false;
        }

        player.selectedUpgrades.push(upgradeKey);
        player.upgradeLevels[upgradeKey] = 0;
    }

    player.upgradeLevels[upgradeKey]++;

    if (upgradeKey === "maxHealth") {
        player.maxHealth *= 1.1;
    } else if (upgradeKey === "armor") {
        player.armor += 0.05;
        if (player.armor >= 1) {
            player.armor = 1;
        } 
    } else if (upgradeKey === "regen") {
        player.regen *= 1.1;
    } else if (upgradeKey === "speed") {
        player.speed *= 1.1;
    } else if (upgradeKey === "bulletSpeed") {
        player.bulletSpeed *= 1.15;
    } else if (upgradeKey === "growth") {
        player.growth += 0.15;
    } else if (upgradeKey === "firingSpeed") {
        player.fireInterval *= 0.9;
    } else if (upgradeKey === "damage") {
        player.damage += 4;
    } else if (upgradeKey === "magnet") {
        player.magnet += 1.1;
    }

    return true;
}