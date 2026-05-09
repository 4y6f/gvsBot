const { createTranscript, ExportReturnType } = require('discord-transcript-v2');
const { AttachmentBuilder, MessageFlags } = require('discord.js');
const { createPlainTextComponents, componentsV2Flags } = require('../../utils/generateCV2');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');
const { sleep } = require('../../utils/sleep');

module.exports = {
    name: 'ticketclose',

    async execute(interaction, client) {
        const allowedRoles = [settings.roles.directive, settings.roles.moderator];

        if (!hasPermission(interaction.member, allowedRoles)) {
            return interaction.reply(permissionReply());
        }

        const channel = interaction.channel;

        if (!channel.name.startsWith('claimed-')) {
            return interaction.reply('You need to claim this ticket before you can close it.');
        }
        try {
            const logChannelID = settings.tickets.ticketLogChannel;
            const logChannel = await interaction.guild.channels.fetch(logChannelID);

            const html = await createTranscript(channel, {
                returnType: ExportReturnType.Attachment,
                filename: 'transcript.html',
                saveImages: true,
                poweredBy: true,
                footerText: 'ER:LC Government Systems',
            });

            await logChannel.send({ files: [html] });
        } catch (err) {
            console.log('error while generating transcript', err);
            return await interaction.reply({ content: 'I couldn\'t generate a transcript.', flags: MessageFlags.Ephemeral })
        }

        const channelDeleteMsg = createPlainTextComponents(`This ticket has been closed by ${interaction.member} and will delete in ten seconds...`);
        await interaction.reply({ flags: componentsV2Flags, components: channelDeleteMsg })
        await sleep(10000);
        await channel.delete();
    }
}