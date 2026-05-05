const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const { isOnCooldown, rateLimitReply } = require('../../utils/rateLimit');
const settings = require('../../config/settings');

module.exports = {
    data: new SlashCommandBuilder().setName('run').setDescription('runcmd').addSubcommandGroup((group) => group.setName('erlc').setDescription('erlcrun').addSubcommand((sub) => sub.setName('command').setDescription('run an erlc command'))),

    async execute(interaction) {
        const allowedRoles = [settings.roles.botOwner, settings.roles.directive];

        if (!hasPermission(interaction.member, allowedRoles)) {
            return await interaction.reply(permissionReply());
        }

        else if (isOnCooldown(interaction.user.id, interaction.commandName, 30)) {
            return await interaction.reply(rateLimitReply(interaction.user.id, interaction.commandName));
        }

        const commandModal = new ModalBuilder()
            .setCustomId('runInGameCommand')
            .setTitle('Run');

         const textInput = new TextInputBuilder()
            .setCustomId('commandInput')
            .setLabel('command')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('what command should be run ingame?')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(textInput);

        commandModal.addComponents(actionRow);

        await interaction.showModal(commandModal);
    }
}