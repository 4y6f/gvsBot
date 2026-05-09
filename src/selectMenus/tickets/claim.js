const { MessageFlags } = require('discord.js');
const { createBrandedComponents, createPlainTextComponents, componentsV2Flags, componentsV2EphemeralFlags } = require('../../utils/generateCV2');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');

module.exports = {
    name: 'ticketclaim',

    async execute(interaction) {
        const allowedRoles = [settings.roles.directive, settings.roles.moderator];

        if (!hasPermission(interaction.member, allowedRoles)) {
            return await interaction.reply(permissionReply());
        }
        
        const channel = interaction.channel;
        
        if (channel.name.startsWith('claimed-')) {
            return await interaction.reply({ content: 'This ticket is already claimed!', flags: MessageFlags.Ephemeral })
        }

        const claimer = interaction.member;

        const claimMessage = createPlainTextComponents(`Ticket claimed by ${claimer}`);

        try {
            const currentName = channel.name;
            const newName = currentName.replace('unclaimed-', 'claimed-');

            channel.setName(newName);
        } catch (err) {
            console.log('error renaming unclaimed ticket', err);
        }

        await interaction.reply({ flags: componentsV2Flags, components: claimMessage });
    }
}