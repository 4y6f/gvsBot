require('dotenv')
.config();

const fs = require('node:fs');
const path = require('node:path');

const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config/settings');

module.exports = async function deployCommands () {
    try {
        if (!clientId || !guildId) {
            throw new Error('Missing clientId or guildId in config/settings.js');
        }

        const commands = [];
        const commandsPath = path.join(__dirname, 'commands/interaction');

        if (!fs.existsSync(commandsPath)) {
            throw new Error('Commands directory not found');
        }

        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter(file => file.endsWith('.js'));

        if (commandFiles.length === 0) {
            console.warn('No command files found in commands directory');
        }

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if (!command.data) {
                console.warn(`skipping command ${file} (no data found!)`);
                continue;
            }

            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(token);

        console.log(`pushing ${commands.length} commands...`);

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

        console.log(`successfully pushed ${commands.length} commands!`);
            
    } catch (error) {
        console.error('failed to deploy commands:', error);
        throw error;
    }
};
