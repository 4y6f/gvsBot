const {
    SlashCommandBuilder,
    EmbedBuilder,
    MessageFlags
} = require('discord.js');

const Case = require('../../models/moderationCase');
const settings = require('../../config/settings');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('case')
        .setDescription('case system')

        .addSubcommand(sub =>
            sub
                .setName('view')
                .setDescription('View a case by ID')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('Case ID')
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName('user')
                .setDescription('View a user\'s case history')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('User')
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName('recent')
                .setDescription('View recent cases')
        )

        .addSubcommand(sub =>
            sub
                .setName('edit')
                .setDescription('Edit a case')
                .addStringOption(option =>
                    option.setName('id').setDescription('Case ID').setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason').setDescription('New reason')
                )
                .addStringOption(option =>
                    option.setName('type').setDescription('New type')
                        .addChoices(
                            { name: 'Warning', value: 'warning' },
                            { name: 'Kick', value: 'kick' },
                            { name: 'Ban', value: 'ban' },
                            { name: 'Timeout', value: 'timeout' }
                        )
                )
        )

        .addSubcommand(sub =>
            sub
                .setName('delete')
                .setDescription('Delete a case')
                .addStringOption(option =>
                    option.setName('id').setDescription('Case ID').setRequired(true)
                )
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const allowedRoles = [
            settings.roles.moderator,
            settings.roles.directive,
            settings.roles.serverOwner,
            settings.roles.botOwner
        ];

        if (!hasPermission(interaction.member, allowedRoles)) {
            return interaction.editReply(permissionReply());
        }

        const sub = interaction.options.getSubcommand();

        try {
            if (sub === 'view') {
                const caseId = interaction.options.getString('id');

                const c = await Case.findOne({
                    caseId,
                    guildId: interaction.guild.id
                });

                if (!c) return interaction.editReply('case not found.');

                const embed = new EmbedBuilder()
                    .setTitle(`Case ${c.caseId}`)
                    .setColor(settings.embedColor)
                    .addFields(
                        { name: 'Type', value: c.type, inline: true },
                        { name: 'User', value: `<@${c.userId}>`, inline: true },
                        { name: 'Moderator', value: `<@${c.moderatorId}>`, inline: true },
                        { name: 'Reason', value: c.reason || 'None' },
                        { name: 'Date', value: new Date(c.createdAt).toLocaleString() }
                    );

                return interaction.editReply({ embeds: [embed] });
            }

            if (sub === 'user') {
                const target = interaction.options.getUser('target');

                const cases = await Case.find({
                    guildId: interaction.guild.id,
                    userId: target.id
                }).sort({ createdAt: -1 });

                if (!cases.length) return interaction.editReply('no cases found.');

                const embed = new EmbedBuilder()
                    .setTitle(`Cases for ${target.tag}`)
                    .setColor(settings.embedColor)
                    .setDescription(
                        cases.slice(0, 10).map(c =>
                            `**${c.caseId}** | ${c.type.toUpperCase()}\n` +
                            `${c.reason}\n` +
                            `<t:${Math.floor(c.createdAt / 1000)}:R>`
                        ).join('\n\n')
                    )
                    .setFooter({
                        text: `Total: ${cases.length} (showing latest 10)`
                    });

                return interaction.editReply({ embeds: [embed] });
            }

            if (sub === 'recent') {
                const cases = await Case.find({
                    guildId: interaction.guild.id
                })
                    .sort({ createdAt: -1 })
                    .limit(10);

                if (!cases.length) return interaction.editReply('no cases found.');

                const embed = new EmbedBuilder()
                    .setTitle('Recent Cases')
                    .setColor(settings.embedColor)
                    .setDescription(
                        cases.map(c =>
                            `**${c.caseId}** | ${c.type.toUpperCase()}\n` +
                            `User: <@${c.userId}> | Mod: <@${c.moderatorId}>\n` +
                            `${c.reason}\n` +
                            `<t:${Math.floor(c.createdAt / 1000)}:R>`
                        ).join('\n\n')
                    );

                return interaction.editReply({ embeds: [embed] });
            }

            if (sub === 'edit') {
                const caseId = interaction.options.getString('id');
                const reason = interaction.options.getString('reason');
                const type = interaction.options.getString('type');

                const c = await Case.findOne({
                    caseId,
                    guildId: interaction.guild.id
                });

                if (!c) return interaction.editReply('case not found.');

                if (reason) c.reason = reason;
                if (type) c.type = type;

                await c.save();

                const embed = new EmbedBuilder()
                    .setTitle(`Case Updated`)
                    .setColor(settings.embedColor)
                    .setDescription(`Case **${c.caseId}** has been updated.`);

                return interaction.editReply({ embeds: [embed] });
            }

            if (sub === 'delete') {
                const caseId = interaction.options.getString('id');

                const c = await Case.findOne({
                    caseId,
                    guildId: interaction.guild.id
                });

                if (!c) return interaction.editReply('case not found.');

                await Case.deleteOne({
                    caseId,
                    guildId: interaction.guild.id
                });

                const embed = new EmbedBuilder()
                    .setTitle('Case Deleted')
                    .setColor(settings.embedColor)
                    .setDescription(`Case **${caseId}** has been removed.`);

                return interaction.editReply({ embeds: [embed] });
            }

        } catch (err) {
            console.error(err);
            return interaction.editReply('error retrieving case data.');
        }
    }
};