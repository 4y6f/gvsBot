const settings = require('../config/settings');

module.exports = {
    name: 'messageCreate',

    async execute(message, client) {
        if (message.author.bot) return;

        const prefix = settings.prefix;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const name = args.shift().toLowerCase();

        const command = client.commands.prefix.get(name) || client.commands.prefix.find(cmd => cmd.aliases && cmd.aliases.includes(name));
        if (!command) return;

        try {
            await command.execute(message, client, args);
        } catch (err) {
            console.error(err);
        }
    }
};