const settings = require('../config/settings');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`logging in as ${client.user.tag}`);
        client.user.setPresence({
            activities: [
                {
                    name: 'duo make stuff work',
                    type: ActivityType.Watching,
                }
            ],
            status: "online",
        });

        const guild = client.guilds.cache.get(settings.guildId) ?? await client.guilds.fetch(settings.guildId).catch(() => null);
    }
};