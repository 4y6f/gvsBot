const settings = require('../config/settings');
const { ActivityType } = require('discord.js');
const mongo = require('../database/connect');
const { sleep } = require('../utils/sleep');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`[LOG]   logging in as ${client.user.tag}`);
        await mongo.connect();
        client.user.setPresence({
            activities: [
                {
                    name: 'the server grow',
                    type: ActivityType.Watching,
                }
            ],
            status: "online",
        });
        await sleep(3000);
        console.log('[LOG]   ready');


        const guild = client.guilds.cache.get(settings.guildId) ?? await client.guilds.fetch(settings.guildId).catch(() => null);
    }
};