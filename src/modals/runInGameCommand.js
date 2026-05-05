const { EmbedBuilder, MessageFlags } = require('discord.js');
const settings = require('../config/settings');

module.exports = {
    name: 'runInGameCommand',

    async execute(interaction, client) {
        const commandInput = interaction.fields.getTextInputValue('commandInput');

        const responseEmbed = new EmbedBuilder()
            .setColor(settings.embedColor)

        const erlcApiKey = settings.erlcApi.apikey;

        try {
            await interaction.reply({ content: 'attempting to run command...', flags: MessageFlags.Ephemeral });

            const response = await fetch(`${settings.erlcApi.apiBaseLink}/server/command`, {
                method: 'POST',
                headers: {
                    'server-key': `${erlcApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'command': String(commandInput)
                })
            });

            if (response.status === 422) {
                return await interaction.editReply('there are currently no players in the server. the command did not execute. code: 422');
            }
            else if (response.status === 400) {
                return await interaction.editReply('the server deemed this attempt as a bad request. try again? code: 400 (BAD REQUEST!!)');
            }
            else if (response.status === 403) {
                return await interaction.editReply('im not authorized to perform this command. check the api key? code: 403 (UNAUTHORIZED!!)');
            }
            else if (response.status === 500) {
                return await interaction.editReply('there was an issue communicating with Roblox, the command did not execute. code: 500')
            }
            
            const data = await response.json();

            await interaction.editReply({ content: 'the command completed successfully.' })
        } catch (err) {
            console.log('there was error', err);
        }
    }
}