const { createBrandedComponents, createPlainTextComponents, componentsV2EphemeralFlags, componentsV2Flags } = require('../utils/generateCV2');
const { hasPermission, permissionReply } = require('../utils/permissionChecker');
const { ActionRowBuilder, ActionRow, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const settings = require('../config/settings');

module.exports = {
    name: 'supportticketreasonmodal',

    async execute(interaction) {
        const reportInput = interaction.fields.getTextInputValue('ticketReportModalInput');
        const reasonInput = interaction.fields.getTextInputValue('ticketReasonModalInput');

        const components = createPlainTextComponents('Please wait while your ticket is created...');
        await interaction.reply({ flags: componentsV2EphemeralFlags, components });

        let newTicketChannelMessage;
        try {
            newTicketChannelMessage = await interaction.guild.channels.create({
                name: `unclaimed-${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: 'nes-Support ticket',
                reason: `Created ticket channel for ${interaction.user.tag}`,
                parent: settings.tickets.categoryId,
                rateLimitPerUser: 3,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [
                            PermissionFlagsBits.ViewChannel
                        ]
                    },
                    {
                        id: settings.roles.moderator,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.AttachFiles
                        ]
                    },
                    {
                        id: settings.roles.directive,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.ManageMessages,
                            PermissionFlagsBits.BypassSlowmode
                        ]
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.AttachFiles
                        ]
                    }
                ]
            });
        } catch (err) {
            console.log('[ERROR]   error creating ticket channel', err);
        }

        const ticketSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticketmanagement')
            .setPlaceholder('Ticket Management')
            .setOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Claim')
                    .setDescription('Claim this ticket.')
                    .setValue('ticketclaim'),
                
                new StringSelectMenuOptionBuilder()
                    .setLabel('Unclaim')
                    .setDescription('Unclaim this ticket.')
                    .setValue('ticketunclaim'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Escalate')
                    .setDescription('Escalate this ticket.')
                    .setValue('ticketescalate'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Close')
                    .setDescription('Close this ticket.')
                    .setValue('ticketclose')
            );

        const ticketActionRow = new ActionRowBuilder().addComponents(ticketSelectMenu);

        const components2 = createBrandedComponents({
            title: 'Ticket Panel',
            description: 'Manage the ticket with the dropdown below.',
            actionRows: [ticketActionRow]
        });

        await newTicketChannelMessage.send({ flags: componentsV2Flags, components: components2 });
    }
};