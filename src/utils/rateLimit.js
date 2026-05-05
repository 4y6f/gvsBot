const { Collection, MessageFlags } = require('discord.js');
const cooldowns = new Collection();

function isOnCooldown(userId, commandName, seconds = 5) {
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = seconds * 1000;

    if (timestamps.has(userId)) {
        const expirationTime = timestamps.get(userId) + cooldownAmount;
        if (now < expirationTime) return true;
    }

    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownAmount);
    return false;
}

function getCooldownTime(userId, commandName, seconds) {
    const timestamps = cooldowns.get(commandName);
    if (!timestamps || !timestamps.has(userId)) return "0.0";
    
    const expirationTime = timestamps.get(userId) + (seconds * 1000);
    const timeLeft = (expirationTime - Date.now()) / 1000;
    return timeLeft > 0 ? timeLeft.toFixed(1) : "0.0";
}

function rateLimitReply(userId, commandName, seconds) {
    const timeLeft = getCooldownTime(userId, commandName, seconds);
    return {
        content: `Slow down! Please wait before running this command again.`,
        flags: MessageFlags.Ephemeral,
    };
}

module.exports = {
    isOnCooldown,
    rateLimitReply
};
