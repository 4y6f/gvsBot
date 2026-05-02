const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const settings = require('../../config/settings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('debug cmds')
        .addSubcommand((sub) =>
            sub
                .setName('ping')
                .setDescription('Check my latency.')
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'ping') {
            const pingEmbed = new EmbedBuilder()
                .setTitle('Pong!')
                .setDescription(`\`\`\`My latency is ${interaction.client.ws.ping}ms\`\`\``)
                .setColor(settings.embedColor);

            await interaction.editReply({ embeds: [pingEmbed] });
        } else {
            await interaction.editReply("I couldn't find the subcommand you tried to use. Try again?")
        }

    }
}