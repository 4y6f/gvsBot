const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');
const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { execute } = require('./moderations');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('utility')
        .setDescription('Utility commands')
        .addSubcommandGroup((group) =>
            group
                .setName('info')
                .setDescription('info subcommands')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('source')
                        .setDescription('View my source code on GitHub.')
                )
        )
        .addSubcommandGroup((group) =>
            group
                .setName('server')
                .setDescription('Server related utility commands')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('membercount')
                        .setDescription('Get the member count of the server')
                )
                .addSubcommand((subcommand) => 
                    subcommand
                        .setName('info')
                        .setDescription('Get information about the server')
                        )
                .addSubcommand((subcommand) => 
                    subcommand
                        .setName('icon')
                        .setDescription('Get the server icon')
                )
            )

                .addSubcommandGroup((group) =>
            group
                .setName('user')
                .setDescription('User related utility commands')
                .addSubcommand((subcommand) => 
                    subcommand
                        .setName('avatar')
                        .setDescription('Get the avatar of a user')
                        .addUserOption((option) => 
                            option
                                .setName('target')
                                .setDescription('The user to get the avatar of')
                                .setRequired(true))
                        .addStringOption((option) =>
                            option
                                .setName('server')
                                .setDescription("Do you want this user's server or global avatar?")
                                .addChoices(
                                    { name: 'Server Avatar', value: 'server' },
                                    { name: 'Global Avatar', value: 'global' },
                                )
                                .setRequired(true))
                            
                        )
                ),

        async execute(interaction, client) {
            const subcommand = interaction.options.getSubcommand();
            const targetUser = interaction.options.getUser('target');
            const avatarType = interaction.options.getString('server');

            if (subcommand === 'source') {
                return interaction.reply({ content: 'You can find my source code here: <https://github.com/4y6f/gvsBot>', flags: MessageFlags.Ephemeral });
            }

            else if (subcommand === 'avatar') {
                const user = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

                if (avatarType === 'server') {
                    const avatarUrl = user && user.avatar ? `https://cdn.discordapp.com/guilds/${interaction.guild.id}/users/${targetUser.id}/avatars/${user.avatar}.png?size=1024` : targetUser.displayAvatarURL({ size: 1024 });
                    return interaction.reply({ content: `${targetUser.tag}'s server avatar: ${avatarUrl}`, flags: MessageFlags.Ephemeral });
                }
                else if (avatarType === 'global') {
                    const avatarUrl = targetUser.displayAvatarURL({ size: 1024 });
                    return interaction.reply({ content: `${targetUser.tag}'s global avatar: ${avatarUrl}`, flags: MessageFlags.Ephemeral });
                } else {
                    return interaction.reply({ content: 'Invalid avatar type specified. Please choose either "server" or "global".', flags: MessageFlags.Ephemeral });
                }
            }

            else if (subcommand === 'info') {
                const { name, memberCount, createdAt, ownerId } = interaction.guild;
                const owner = await interaction.guild.members.fetch(ownerId).catch(() => null);

                const infoEmbed = new EmbedBuilder()
                    .setTitle(`${name}`)
                    .setDescription('We were created to provide a realistic roleplay experience for government systems for all players to enjoy. We strive to create a welcoming and inclusive community.')
                    .addFields(
                        { name: 'Member Count', value: `${memberCount}`, inline: true },
                        { name: 'Created At', value: `${createdAt.toDateString()}`, inline: true },
                        { name: 'Owner', value: owner ? owner.user.tag : 'Unknown', inline: true },
                    )
                    .setColor(settings.embedColor)
                    .setThumbnail(interaction.guild.iconURL({ size: 1024 }));
                return interaction.reply({ embeds: [infoEmbed], flags: MessageFlags.Ephemeral });
            }

            else if (subcommand === 'membercount') {
                const memberCount = interaction.guild.memberCount;
                return interaction.reply({ content: `We currently have ${memberCount} members.`, flags: MessageFlags.Ephemeral });
            }

            else if (subcommand === 'icon') {
                const iconUrl = interaction.guild.iconURL({ size: 1024 });

                if (iconUrl) {
                    return interaction.reply({ content: `Server icon: ${iconUrl}`, flags: MessageFlags.Ephemeral });
                } else {
                    return interaction.reply({ content: "I couldn't find this server's icon. Are you sure it has one?", flags: MessageFlags.Ephemeral });
                }
            }
        }
        
};