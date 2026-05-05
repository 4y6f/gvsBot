const { EmbedBuilder } = require('discord.js');
const settings = require('../config/settings');

module.exports = {
    name: 'echoUserInput',

    async execute(interaction, client) {

        const userInput = interaction.fields.getTextInputValue('echoInput');

        const echoEmbed = new EmbedBuilder()
            .setColor(settings.embedColor)
            .setDescription(userInput)
            .setImage(settings.footerImages.general);

            await interaction.reply({ embeds: [echoEmbed] });
    }
}