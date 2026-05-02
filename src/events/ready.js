const settings = require('../config/settings');
const { ActivityType } = require('discord.js');
const connectToMongoDB = require('../database/connect');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`logging in as ${client.user.tag}`);
        await connectToMongoDB();
        client.user.setPresence({
            activities: [
                {
                    name: 'the server grow',
                    type: ActivityType.Watching,
                }
            ],
            status: "online",
        });

        const guild = client.guilds.cache.get(settings.guildId) ?? await client.guilds.fetch(settings.guildId).catch(() => null);
    }
};