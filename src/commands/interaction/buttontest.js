const { ActionRowBuilder, SlashCommandBuilder, MessageFlags, ButtonBuilder, ButtonStyle } = require('discord.js');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');

module.exports = {
    data: new SlashCommandBuilder().setName('button').setDescription('button').addSubcommand((sub) => sub.setName('test').setDescription('testing handlers ability with buttons')),

    async execute(interaction) {
        await interaction.deferReply()

        const allowedRoles = [settings.roles.botOwner];

        if (!hasPermission(interaction.member, allowedRoles)) {
            interaction.editReply(permissionReply());
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('dosomething')
                .setLabel('click me')
                .setStyle(ButtonStyle.Secondary),
        );

        await interaction.editReply({
            content: 'Administrator Panel',
            components: [row]
        })
    }
}
