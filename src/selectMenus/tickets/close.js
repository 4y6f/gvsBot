const discordTranscripts = require('discord-html-transcripts-v2');
const { MessageFlags } = require('discord.js');
const { createPlainTextComponents, componentsV2Flags } = require('../../utils/generateCV2');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');
const { sleep } = require('../../utils/sleep');

module.exports = {
    name: 'ticketclose',

    async execute(interaction) {
        const allowedRoles = [settings.roles.directive, settings.roles.moderator];

        if (!hasPermission(interaction.member, allowedRoles)) {
            return interaction.reply(permissionReply());
        }

        const channel = interaction.channel;

        if (!channel.name.startsWith('claimed-')) {
            return interaction.reply('You need to claim this ticket before you can close it.');
        }

        try {
            const messages = interaction.channel.messages.get();
            const channel = interaction.channel();

            const attachment = await discordTranscripts.generateFromMessages(messages, channel, {
                saveImages: true
            })

            const logChannel = interaction.guild.channels.cache.get(settings.tickets.ticketLogChannel);

            await logChannel.send({
                files: [attachment],
            });

        } catch (err) {
            console.log('error while generating transcript', err);
            return await interaction.reply('I couldn\'t generate a transcript.')
        }

        const channelDeleteMsg = createPlainTextComponents('Deleting channel in ten seconds...');
        await sleep(10000);
        await channel.delete();
    }
}