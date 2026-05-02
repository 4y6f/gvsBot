const settings = require('../../config/settings');
const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const moderationCase = require('../../models/moderationCase');
const generateCaseID = require('../../utils/generateModerationCaseID');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moderation')
        .setDescription('Moderation commands')
        .addSubcommand((sub) =>
            sub
            .setName('warning')
            .setDescription('Issue a warning to a user')
            .addUserOption(option => option.setName('target').setDescription('The user to warn').setRequired(true))
            .addStringOption((option) => option.setName('reason').setDescription('What are you warning this user for?').setRequired(true))
        )
        .addSubcommand((sub) =>
            sub
            .setName('timeout')
            .setDescription('Timeout a user')
            .addUserOption((option) => option.setName('target').setDescription('The user to be timed out').setRequired(true))
            .addStringOption((option) => option.setName('reason').setDescription('What are you timing out this user for?').setRequired(true))
            .addStringOption((option) => 
                option
                .setName('duration')
                .setDescription('Duration of the timeout in minutes (max 24 hours)')
                .setRequired(true)
                .addChoices(
                    {
                        name: '10 minutes',
                        value: '10',
                    },
                    {
                        name: '30 minutes',
                        value: '30',
                    },
                    {
                        name: '1 hour',
                        value: '60',
                    },
                    {
                        name: '12 hours',
                        value: '720',
                    },
                    {
                        name: '24 hours',
                        value: '1440',
                    }
            )))
        .addSubcommand((sub) => 
            sub
            .setName('kick')
            .setDescription('Kick a user from the server')
            .addUserOption((option) => option.setName('target').setDescription('The user to kick').setRequired(true))
            .addStringOption((option) => option.setName('reason').setDescription('Why are you kicking this user?').setRequired(true))
        )
        .addSubcommand((sub) => 
            sub
            .setName('ban')
            .setDescription('Ban a user from the server')
            .addUserOption((option) => option.setName('target').setDescription('The user to ban').setRequired(true))
            .addStringOption((option) => option.setName('reason').setDescription('Why are you banning this user?').setRequired(true))
        ),

    async execute(interaction) {
        const logChannel = interaction.guild.channels.cache.get(settings.channels.moderationLogs);
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const allowedRoles = [settings.roles.botOwner, settings.roles.directive, settings.roles.serverOwner, settings.roles.moderator];

        if (!hasPermission(interaction.member, allowedRoles)) {
            return interaction.editReply(permissionReply());
        }

        const subcommand = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        if (subcommand === 'warning') {

            const logChannelEmbed = new EmbedBuilder()
                .setTitle('User Warned')
                .setDescription(`${targetUser.tag} has been warned for the following reason:\n\n${reason}`)
                .setColor(settings.embedColor)
                .setImage(settings.footerImages.general)
                .setFooter({ text: `Moderator: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            log = await logChannel.send({ embeds: [logChannelEmbed] });
            databaseLog = await moderationCase.create({
                caseId: generateCaseID(),
                guildId: interaction.guild.id,
                userId: targetUser.id,
                moderatorId: interaction.user.id,
                type: 'warning',
                reason: reason,
            });

            const warningEmbed = new EmbedBuilder()
                .setTitle('Moderation Warning')
                .setDescription(`You have been warned in ${interaction.guild.name} for the following reason:\n\n${reason}`)
                .setColor(settings.embedColor)
                .setImage(settings.footerImages.general)
                .setFooter({ text: `Moderator: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            try {
                await targetUser.send({ embeds: [warningEmbed] });
            } catch (err) {
                return interaction.editReply(`The warning was issued to ${targetUser.tag} for ${reason}, but I was unable to send them a DM.`); // dm fail
            }
            return interaction.editReply(`You have issued a warning to ${targetUser.tag} for ${reason}`);
        }

        else if (subcommand === 'timeout') {

           // const logChannelEmbed = new EmbedBuilder().setTitle('User Timed Out').setDescription(`${targetUser.tag} has been timed out for the following reason:\n\n${reason}`).setColor(settings.embedColor).setImage(settings.footerImages.general).setFooter({ text: `Moderator: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
           // const timeoutEmbed = new EmbedBuilder().setTitle('Moderation Timeout').setDescription(`You have been timed out in ${interaction.guild.name} for the following reason:\n\n${reason}`).setColor(settings.embedColor).setImage(settings.footerImages.general).setFooter({ text: `Moderator: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
           // const duration = interaction.options.getString('duration');
           // const durationMs = parseInt(duration) * 60 * 1000;

            
          //  try { i lowk dont know how to timeout gng
          //      await targetUser.timeout(durationMs, reason);
          //      await logChannel.send({ embeds: [logChannelEmbed] }).then(async () => {
          //          try {
          //              await targetUser.send({ embeds: [timeoutEmbed] });
//
          //          } catch (err) {
           //             return interaction.editReply(`The timeout was issued to ${targetUser.tag} for ${reason}, but I was unable to send them a DM.`); // dm fail
          //          }
              //  });
               // await interaction.editReply(`You have timed out ${targetUser.tag} for ${reason} for a duration of ${duration} minutes.`);
          //  } catch (err) {
          //      return interaction.editReply(`There was an error while executing this command:\n\n` + err.message);
                await interaction.editReply(`This command is currently unavailable while we squash some bugs. :(`);
            }
        

        else if (subcommand === 'kick') {
            const logChannelEmbed = new EmbedBuilder().setTitle('User Kicked').setDescription(`${targetUser.tag} has been kicked for the following reason:\n\n${reason}`).setColor(settings.embedColor).setImage(settings.footerImages.general).setFooter({ text: `Moderator: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            const kickEmbed = new EmbedBuilder().setTitle('Moderation Kick').setDescription(`You have been kicked from ${interaction.guild.name} for the following reason:\n\n${reason}`).setColor(settings.embedColor).setImage(settings.footerImages.general).setFooter({ text: `Moderator: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });


            try {
                await interaction.guild.members.kick(targetUser.id, reason);
                await logChannel.send({ embeds: [logChannelEmbed] })
                await moderationCase.create({
                    caseId: generateCaseID(),
                    guildId: interaction.guild.id,
                    userId: targetUser.id,
                    moderatorId: interaction.user.id,
                    type: 'kick',
                    reason: reason,
                }).then(async () => {

                    try {
                        await targetUser.send({ embeds: [kickEmbed] });
                    } catch (err) {
                        return interaction.editReply(`The kick was issued to ${targetUser.tag} for ${reason}, but I was unable to send them a DM.`); // dm fail
                    }
                });

                await interaction.editReply(`You have kicked ${targetUser.tag} for ${reason}.`);
            } catch (err) {
                return interaction.editReply(`There was an error while executing this command:\n\n` + err.message);
            }
        }

        else if (subcommand === 'ban') {
            const logChannelEmbed = new EmbedBuilder().setTitle('User Banned').setDescription(`${targetUser.tag} has been banned for the following reason:\n\n${reason}`).setColor(settings.embedColor).setImage(settings.footerImages.general).setFooter({ text: `Moderator: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            const banEmbed = new EmbedBuilder().setTitle('Moderation Ban').setDescription(`You have been banned from ${interaction.guild.name} for the following reason:\n\n${reason}`).setColor(settings.embedColor).setImage(settings.footerImages.general).setFooter({ text: `Moderator: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            databaseLog = await moderationCase.create({
                caseId: generateCaseID(),
                guildId: interaction.guild.id,
                userId: targetUser.id,
                moderatorId: interaction.user.id,
                type: 'ban',
                reason: reason,
            })

            try {
                await interaction.guild.members.ban(targetUser.id, { reason });
                await logChannel.send({ embeds: [logChannelEmbed] }).then(async () => {
                    try {
                        await targetUser.send({ embeds: [banEmbed] });
                    } catch (err) {
                        return interaction.editReply(`The ban was issued to ${targetUser.tag} for ${reason}, but I was unable to send them a DM.`); // dm fail
                    }
                });

                await interaction.editReply(`You have banned ${targetUser.tag} for ${reason}.`);
            } catch (err) {
                return interaction.editReply(`There was an error while executing this command:\n\n` + err.message);
            }
        }

        else {
            return interaction.editReply("I couldn't find the command you tried to use. Try again?");
        }
    }
};