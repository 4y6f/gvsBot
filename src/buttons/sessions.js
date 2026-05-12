const { MessageFlags } = require('discord.js');
const { votersArray } = require('../localdata/data');
module.exports = {
    name: 'sessionvotebtn',
    async execute(interaction) {
        const array = votersArray;

        if (!votersArray.includes(interaction.user.id)) {
            array.push(interaction.user.id);
            await interaction.reply({ content: "You've voted for the session.", flags: MessageFlags.Ephemeral });
        }
    }
}