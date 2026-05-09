const { MessageFlags } = require('discord.js');
const { createBrandedComponents, createPlainTextComponents, componentsV2Flags, componentsV2EphemeralFlags } = require('../../utils/generateCV2');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');

module.exports = {
    name: 'ticketunclaim',

    async execute(interaction) {
        const allowedRoles = [settings.roles.directive, settings.roles.moderator];

        if (!hasPermission(interaction.member, allowedRoles)) {
            return await interaction.reply(permissionReply());
        }

        const channel = interaction.channel;

        if (channel.name.startsWith('unclaimed-')) {
            return await interaction.reply({ content: 'This ticket hasn\'t been claimed yet!'});
        }

        const unclaimer = interaction.member;

        const unclaimMessage = createPlainTextComponents(`Ticket unclaimed by ${unclaimer}`);

        try {
            const currentName = channel.name;
            const newName = currentName.replace('claimed-', 'unclaimed-');

            channel.setName(newName);
        } catch (err) {
            console.log('error while renaming claimed ticket', err);
        }

        await interaction.reply({ flags: componentsV2Flags, components: unclaimMessage });
    }
}