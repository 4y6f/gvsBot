const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { createPlainTextComponents, createBrandedComponents, componentsV2Flags, componentsV2EphemeralFlags } = require('../../utils/generateCV2');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('session')
        .setDescription('session commands')
        .addSubcommand((sub) =>
            sub
            .setName('start')
            .setDescription('Start a session.')
        )
        .addSubcommand((sub) =>
            sub
            .setName('low')
            .setDescription('Send the session low message.')
        )
        .addSubcommand((sub) =>
            sub
            .setName('end')
            .setDescription('End the session.')
        )
        .addSubcommand((sub) => 
            sub
            .setName('vote')
            .setDescription('Start a session vote.')
            .addIntegerOption((option) =>
                option
                .setName('votes')
                .setDescription('number of votes required')
                .setMinValue(3)
                .setMaxValue(10)
            )
        ),

        async execute(interaction) {
            await interaction.deferReply({ flags: componentsV2EphemeralFlags });

            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'start') {
                const ssuContainer = createBrandedComponents({
                    title: 'Session Start',
                    description: [
                        `${interaction.member} has started a session! Join now with the information provided below!`,
                        '',
                        `**Server Name:** ${settings.sessions.servername}`,
                        `**Server Code:** ${settings.sessions.servercode}`,
                        `**Server Owner:** ${settings.sessions.serverowner}`
                    ].join('\n')
                })

                await interaction.channel.send({ flags: componentsV2Flags, components: ssuContainer });
                
                const replyMessage = createPlainTextComponents('Session started!');

                return await interaction.editReply({ flags: componentsV2EphemeralFlags, components: replyMessage });
            }
            else if (subcommand === 'low') {
                const sloContainer = createBrandedComponents({
                    title: 'Session Low',
                    description: [
                        `${interaction.member} has marked this session as low! Join in-game now and help us get full!`,
                        '',
                        `**Server Name:** ${settings.sessions.servername}`,
                        `**Server Code:** ${settings.sessions.servercode}`,
                        `**Server Owner:** ${settings.sessions.serverowner}`
                    ].join('\n'),
                    includeBanner: false
                })

                await interaction.channel.send({ flags: componentsV2Flags, components: sloContainer })

                const replyMessage = createPlainTextComponents('Session marked as low!');

                return await interaction.editReply({ flags: componentsV2EphemeralFlags, components: replyMessage });
            }
            else if (subcommand === 'end') {
                const ssdContainer = createBrandedComponents({
                    title: 'Session Shutdown',
                    description: [
                        `${interaction.member} has shut down this session. Thanks for roleplaying with us!`,
                        '',
                        `Another session will likely be hosted soon. Keep an eye on the session channel for updates.`
                    ].join('\n'),
                    includeBanner: false
                })

                const replyMessage = createPlainTextComponents('Session ended successfully!');

                await interaction.channel.send({ flags: componentsV2Flags, components: ssdContainer });
                await interaction.editReply({ flags: componentsV2EphemeralFlags, components: replyMessage });

                try {
                    const erlcApiKey = settings.erlcApi.apikey;
                    const response = await fetch(`${settings.erlcApi.apiBaseLink}/server/command`, {
                        method: 'POST',
                        headers: {
                            'server-key': `${erlcApiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'command': ':shutdown'
                        })
                    })

                    if ([422, 400, 403, 500].includes(response.status)) {
                        return;
                    }

                } catch (err) {
                    console.log('error shutting down server: ', err);
                }
            }
            else if (subcommand === 'vote') {
                const voteBtn = new ButtonBuilder().setLabel('Vote').setCustomId('sessionvotebtn').setStyle(ButtonStyle.Secondary);
                const votersBtn = new ButtonBuilder().setLabel('Voters: /0').setCustomId('sessionvotersbtn').setStyle(ButtonStyle.Secondary).setDisabled(true);

                const voteBtnActionRow = new ActionRowBuilder().addComponents(voteBtn, votersBtn);

                const voteContainer = createBrandedComponents({
                    title: 'Session Vote',
                    description: `${interaction.member} has started a session vote. If you would like to start a session, vote using the button below.`,
                    actionRows: [voteBtnActionRow],
                });
                const replyMsg = createPlainTextComponents('Session vote started successfuly.');

                await interaction.channel.send({ flags: componentsV2Flags, components: voteContainer });
                await interaction.editReply({ flags: componentsV2EphemeralFlags, components: replyMsg });
            }

        }
}