const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require("./config/settings");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.GuildMember]
});

client.commands = {
    prefix: new Collection(),
    interaction: new Collection(),
};

client.buttons = new Collection();
client.modals = new Collection();

function loadFiles(dir) {
    const absoluteDir = path.join(__dirname, dir);
    const results = [];

    if (!fs.existsSync(absoluteDir)) return results;

    const items = fs.readdirSync(absoluteDir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(absoluteDir, item.name);

        if (item.isDirectory()) {
            results.push(...loadFiles(path.join(dir, item.name)));
        } else if (item.name.endsWith('.js')) {
            results.push(fullPath);
        }
    }

    return results;
}

for (const file of loadFiles('commands')) {
    const command = require(file);

    if (command?.data?.name) {
        client.commands.interaction.set(command.data.name, command);
    } else if (command?.name) {
        client.commands.prefix.set(command.name, command);
    }
}

for (const file of loadFiles('events')) {
    const event = require(file);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

for (const file of loadFiles('buttons')) {
    const button = require(file);

    if (!button?.name) continue;

    client.buttons.set(button.name, button);
}

for (const file of loadFiles('modals')) {
    const modal = require(file);

    if (!modal?.name) continue;

    client.modals.set(modal.name, modal);
}

client.login(token);