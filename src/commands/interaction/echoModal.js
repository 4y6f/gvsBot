const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, MessageFlags } = require('discord.js');
const settings = require('../../config/settings');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');

module.exports = {
    data: new SlashCommandBuilder().setName('echo').setDescription('echo').addSubcommand((sub) => sub.setName('modal').setDescription('echo with modal')),

    async execute(interaction) {
        const allowedRoles = [settings.roles.botOwner];

        if (!hasPermission(interaction.member, allowedRoles)) {
            await interaction.reply(permissionReply());
        }

        const modal = new ModalBuilder()
            .setCustomId('echoUserInput')
            .setTitle('echo');

        const textInput = new TextInputBuilder()
            .setCustomId('echoInput')
            .setLabel('text input')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('what do i say yo')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(textInput);

        modal.addComponents(actionRow);
        
        await interaction.showModal(modal)
    }
}