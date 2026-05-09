const { MessageFlags } = require('discord.js');
const { createPlainTextComponents, componentsV2Flags } = require('../../utils/generateCV2');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');

module.exports = {
    name: 'ticketescalate',

    async execute(interaction) {
        const allowedRoles = [settings.roles.directive, settings.roles.moderator];

        if (!hasPermission(interaction.member, allowedRoles)) {
            return await interaction.reply(permissionReply());
        }

        const channel = interaction.channel;
        const description = interaction.channel.topic;

        if (description.startsWith('es-')) {
            return interaction.reply({ content: 'This ticket has already been escalated.', flags: MessageFlags.Ephemeral });
        }

        const directiveRoleId = settings.roles.directive;
        const escalateMessage = createPlainTextComponents(`This ticket has been escalated to <@&${directiveRoleId}> by ${interaction.member}.`)

        try {
            const currentDescription = description;
            const newDescription = currentDescription.replace('nes-', 'es-');

            await channel.edit({ topic: newDescription });
        } catch (err) {
            console.log('error changing channel topic with escalation:', err);
        }

        await interaction.reply({ flags: componentsV2Flags, components: escalateMessage });
    }
}