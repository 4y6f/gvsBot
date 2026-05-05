const { ActionRowBuilder, SlashCommandBuilder, MessageFlags, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('button').setDescription('button').addSubcommand((sub) => sub.setName('test').setDescription('testing handlers ability with buttons')),

    async execute(interaction) {
        await interaction.deferReply()

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('test')
                .setLabel('click me')
                .setStyle(ButtonStyle.Secondary),
        );
        
        await interaction.editReply({
            content: 'here is button menu sir',
            components: [row]
        })
    }
}
