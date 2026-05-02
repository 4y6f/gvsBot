const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const settings = require('../../config/settings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('replies with pong!'),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const pingEmbed = new EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`\`\`\`My latency is ${interaction.client.ws.ping}ms\`\`\``)
            .setColor(settings.embedColor);

        await interaction.editReply({ embeds: [pingEmbed] });
    }
}