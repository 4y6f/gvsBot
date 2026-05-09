const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const settings = require('../../config/settings');
const { createPlainTextComponents, componentsV2Flags } = require('../../utils/generateCV2');

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
            const pingReply = createPlainTextComponents(`Pong! My latency is ${interaction.client.ws.ping}ms.`)
            await interaction.editReply({ components: pingReply, flags: componentsV2Flags })
        } else {
            await interaction.editReply("I couldn't find the subcommand you tried to use. Try again?")
        }

    }
}