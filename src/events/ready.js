const settings = require('../config/settings');
const { ActivityType } = require('discord.js');
const mongo = require('../database/connect');
const { sleep } = require('../utils/sleep');
const sessionTask = require('../tasks/erlcInfo');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        const guild = client.guilds.cache.get(settings.guildId) ?? await client.guilds.fetch(settings.guildId).catch(() => null);
        
        console.log(`[LOG]   logging in as ${client.user.tag}`);

        await sleep(3000);
        console.log('[LOG]   ready');

        await mongo.connect();
        await sleep(500);
        await sessionTask(client);
        await sleep(500);
        client.user.setPresence({
            activities: [
                {
                    name: `Watching over ${guild.memberCount} members.`,
                    type: ActivityType.Watching,
                }
            ],
            status: "online",
        });
    }
};