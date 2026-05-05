const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ModalBuilder, ActionRowBuilder } = require('discord.js');
const { filter } = require('curse-filter')
const settings = require('../../config/settings');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('feedback cmds')
    .addSubcommand((sub) =>
        sub
        .setName('submit')
        .setDescription('submit feedback to our server')
        .addIntegerOption((option) =>
            option
            .setName('rating')
            .setDescription('rate the server 1-5')
            .setMinValue(1)
            .setMaxValue(5)
            .setRequired(true)
        )
        .addStringOption((option) =>
            option
            .setName('feedback')
            .setDescription('explain why you left the review you did')
            .setRequired(true)
        )
        .addStringOption((option) =>
            option
            .setName('anonymous')
            .setDescription('do you want to post this anonymously? (default is no)')
            .addChoices(
                {
                    name: 'yes',
                    value: 'yes',
                },
                {
                    name: 'no',
                    value: 'no',
                }
            )
            .setRequired(false)
        )
    ),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'submit') {
            const feedbackResponse = interaction.options.getString('feedback');
            const feedbackRating = interaction.options.getInteger('rating');
            const anonymousStatus = interaction.options.getString('anonymous');

            const feedbackChannelID = settings.channels.feedback;
            const feedbackChannel = interaction.guild.channels.cache.get(feedbackChannelID);

            const reviewer = 
                anonymousStatus === 'yes'
                ? 'Anonymous'
                : interaction.user.toString()

            const filteredFeedback = await filter(feedbackResponse, { placeholder: 'X'})
            const filteredFeedbackTxt = String(filteredFeedback)

            const feedbackEmbed = new EmbedBuilder()
            .setTitle('Server Feedback')
            .setDescription("New feedback for the server has been submitted.")
            .addFields(
                {
                    name: 'Rating',
                    value: `${feedbackRating}/5`,
                    inline: true
                },
                {
                    name: 'Reviewer',
                    value: reviewer,
                    inline: true
                },
                {
                    name: 'Feedback',
                    value: filteredFeedbackTxt,
                    inline: false
                }
            )
            .setImage(settings.footerImages.general)

            await feedbackChannel.send({ embeds: [feedbackEmbed] })

            await interaction.editReply(`Your feedback was submitted.`);
        }
    }
}