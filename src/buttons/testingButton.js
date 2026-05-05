const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'test',

    async execute(interaction) {
        await interaction.reply({
            content: 'hi',
            flags: MessageFlags.Ephemeral
        })
    }
}