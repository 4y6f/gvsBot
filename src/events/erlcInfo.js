const { Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, time } = require('discord.js');
const axios = require('axios');

const SERVER_KEY = process.env.erlcapikey; // api key, you can change this to // const SERVER_KEY = process.env.erlcapi
const targetChannelId = '1477110025955577988'; // where it should send
const ERLC_BASE_URL = 'https://api.policeroleplay.community/v1';

const settings = require('../config/settings');

let liveMessageId = null;
let liveIntervalId = null;
let isSessionOnline = false;
let liveMessageReference = null;

const SESSION_ROLE_ID = '1477135282636722196'; // the session ping role

module.exports = {
    name: Events.MessageCreate,

    allowedRoleIds: [
        '1477731886175617075', // role of person who can use cmd
    ],

    getLiveMessageId: () => liveMessageId,
    getIsSessionOnline: () => isSessionOnline,
    getLiveMessageReference: () => liveMessageReference,
    getSessionRoleId: () => SESSION_ROLE_ID,
    getTargetChannelId: () => targetChannelId,

    getServerStatusButton: (sessionOnline) => {
        return new ButtonBuilder()
            .setCustomId('server_status_button')
            .setLabel(sessionOnline ? 'Server Online' : 'Server Offline')
            .setStyle(sessionOnline ? ButtonStyle.Success : ButtonStyle.Danger)
            .setDisabled(true);
    },

    getSessionRoleButton: () => {
        return new ButtonBuilder()
            .setCustomId('toggle_session_role')
            .setLabel(' ')
            .setEmoji('<:Check:1409419092389007393>')
            .setStyle(ButtonStyle.Secondary);
    },

    async updateSessionStatusAndMessage(client, status) {
        isSessionOnline = status;

        const targetChannel = client.channels.cache.get(targetChannelId);
        if (!targetChannel || !liveMessageId) {
            console.warn('updateSessionStatusAndMessage: Target channel or liveMessageId not found. Skipping update.');
            return;
        }

        try {
            if (!liveMessageReference || liveMessageReference.id !== liveMessageId) {
                liveMessageReference = await targetChannel.messages.fetch(liveMessageId);
            }

            const currentEmbeds = liveMessageReference.embeds.map(e => EmbedBuilder.from(e));

            const inGameStatusEmbedIndex = currentEmbeds.findIndex(embed => embed.data.title === 'In-Game Status');
            if (inGameStatusEmbedIndex !== -1) {
                const lastUpdateTime = Date.now();
                const playersField = currentEmbeds[inGameStatusEmbedIndex].data.fields.find(field => field.name === 'Players');
                const staffField = currentEmbeds[inGameStatusEmbedIndex].data.fields.find(field => field.name === 'Staff Online');
                const queueField = currentEmbeds[inGameStatusEmbedIndex].data.fields.find(field => field.name === 'In Queue');

                const currentPlayers = playersField ? playersField.value.match(/\d+/)?.[0] || 'N/A' : 'N/A';
                const currentStaff = staffField ? staffField.value.match(/\d+/)?.[0] || 'N/A' : 'N/A';
                const currentQueue = queueField ? queueField.value.match(/\d+/)?.[0] || 'N/A' : 'N/A';

                const updatedEmbed3 = new EmbedBuilder()
                    .setTitle('In-Game Status')
                    .setColor('#2b2d31')
                    .setDescription(`**Last updated:** ${time(Math.floor(lastUpdateTime / 1000), 'R')}`)
                    .setImage('https://media.discordapp.net/attachments/1413491936123420732/1413635454972203018/EmbedFooter_2.png?ex=68bea05c&is=68bd4edc&hm=598a734630dfcd1424796466fe8ee63b99c9de7d38d326855858441fc524d042&=&format=webp&quality=lossless&width=1214&height=51')
                    .addFields(
                        { name: 'Players', value: `\`\`\`${currentPlayers}/40\`\`\``, inline: true },
                        { name: 'Staff Online', value: `\`\`\`${currentStaff}\`\`\``, inline: true },
                        { name: 'In Queue', value: `\`\`\`${currentQueue}\`\`\``, inline: true },
                    );
                currentEmbeds[inGameStatusEmbedIndex] = updatedEmbed3;
            }

            const newActionRow = new ActionRowBuilder()
                .addComponents(
                    this.getSessionRoleButton(),
                    this.getServerStatusButton(isSessionOnline)
                );

            await liveMessageReference.edit({
                embeds: currentEmbeds,
                components: [newActionRow],
            });
        } catch (error) {
            console.error('Error updating live status message button:', error);
            if (error.code === 10008) {
                console.warn('Live message deleted or inaccessible. Resetting liveMessageId and interval.');
                liveMessageId = null;
                liveMessageReference = null;
                if (liveIntervalId) {
                    clearInterval(liveIntervalId);
                    liveIntervalId = null;
                }
            }
            return;
        }
    },

    async execute(message) {
        const client = message.client;

        if (message.content === '-live') {
            if (message.author.bot) return;
            if (!message.guild) return;

            const memberRoles = message.member.roles.cache;
            if (!memberRoles.some(role => this.allowedRoleIds.includes(role.id))) {
                return await message.reply({
                    content: 'You do not have permission to use this command.',
                    ephemeral: true
                });
            }

            await message.channel.send('Attempting to post live session status...');

            try {
                const playerResponse = await axios.get(`${ERLC_BASE_URL}/server/players`, {
                    headers: { 'Server-key': SERVER_KEY }
                });

                const players = playerResponse.data;
                const totalPlayers = players.length;
                const staffPlayers = players.filter(player =>
                    ['Server Administrator', 'Server Moderator', 'Server Co Owner', 'Server Owner'].includes(player.Permission)
                );
                const staffCount = staffPlayers.length;
                const queueCount = playerResponse.data.queueCount ?? '0';
                let lastUpdateTime = Date.now();

                const embed1 = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setImage(settings.bannerImages.sessions);

                const embed2 = new EmbedBuilder()
                    .setTitle('Session Information')
                    .setDescription('> Our sessions are hosted at all different times depending on when our session hosters are available. See the live server status below: player count, queue, and staff online and more!')
                    .setColor('#2b2d31')
                    .setImage('https://media.discordapp.net/attachments/1227430092347674778/1253964015789539420/invis_Line.png');

                const embed3 = new EmbedBuilder()
                    .setTitle('In-Game Status')
                    .setColor('#2b2d31')
                    .setDescription(`**Last updated:** ${time(Math.floor(lastUpdateTime / 1000), 'R')}`)
                    .setImage(settings.footerImages.general)
                    .addFields(
                        { name: 'Players', value: `\`\`\`${totalPlayers}/40\`\`\``, inline: true },
                        { name: 'Staff Online', value: `\`\`\`${staffCount}\`\`\``, inline: true },
                        { name: 'In Queue', value: `\`\`\`${queueCount}\`\`\``, inline: true },
                    );

                const initialActionRow = new ActionRowBuilder()
                    .addComponents(this.getSessionRoleButton(), this.getServerStatusButton(isSessionOnline));

                const targetChannel = await client.channels.fetch(targetChannelId);
                if (targetChannel) {
                    if (liveIntervalId) {
                        clearInterval(liveIntervalId);
                    }

                    let sentMessage;
                    if (liveMessageId) {
                        try {
                            sentMessage = await targetChannel.messages.fetch(liveMessageId);
                            await sentMessage.edit({
                                embeds: [embed1, embed2, embed3],
                                components: [initialActionRow],
                            });
                        } catch (fetchError) {
                            console.warn('Existing liveMessageId found but message could not be fetched. Creating new message.');
                            liveMessageId = null;
                        }
                    }

                    if (!sentMessage) {
                        sentMessage = await targetChannel.send({
                            embeds: [embed1, embed2, embed3],
                            components: [initialActionRow],
                        });
                        liveMessageId = sentMessage.id;
                    }

                    liveMessageReference = sentMessage;

                    liveIntervalId = setInterval(async () => {
                        try {
                            const updatedResponse = await axios.get(`${ERLC_BASE_URL}/server/players`, {
                                headers: { 'Server-key': SERVER_KEY }
                            });

                            const updatedPlayers = updatedResponse.data;
                            const updatedTotalPlayers = updatedPlayers.length;
                            const updatedStaffCount = updatedPlayers.filter(player =>
                                ['Server Administrator', 'Server Moderator', 'Server Co Owner', 'Server Owner'].includes(player.Permission)
                            ).length;
                            const updatedQueueCount = updatedResponse.data.queueCount ?? '0';

                            lastUpdateTime = Date.now();

                            const updatedEmbed3 = new EmbedBuilder()
                                .setTitle('In-Game Status')
                                .setColor('#2b2d31')
                                .setDescription(`**Last updated:** ${time(Math.floor(lastUpdateTime / 1000), 'R')}`)
                                .setImage('https://media.discordapp.net/attachments/1413491936123420732/1413635454972203018/EmbedFooter_2.png?ex=68bea05c&is=68bd4edc&hm=598a734630dfcd1424796466fe8ee63b99c9de7d38d326855858441fc524d042&=&format=webp&quality=lossless&width=1214&height=51')
                                .addFields(
                                    { name: 'Players', value: `\`\`\`${updatedTotalPlayers}/40\`\`\``, inline: true },
                                    { name: 'Staff Online', value: `\`\`\`${updatedStaffCount}\`\`\``, inline: true },
                                    { name: 'In Queue', value: `\`\`\`${updatedQueueCount}\`\`\``, inline: true },
                                );

                            const updatedActionRow = new ActionRowBuilder()
                                .addComponents(this.getSessionRoleButton(), this.getServerStatusButton(isSessionOnline));

                            if (liveMessageReference && liveMessageReference.editable) {
                                await liveMessageReference.edit({
                                    embeds: [embed1, embed2, updatedEmbed3],
                                    components: [updatedActionRow],
                                });
                            } else {
                                console.warn('Live message reference lost or not editable. Stopping interval.');
                                clearInterval(liveIntervalId);
                                liveIntervalId = null;
                                liveMessageId = null;
                                liveMessageReference = null;
                            }

                        } catch (error) {
                            console.error('Error in live status update interval:', error);
                            if (error.code === 10008) {
                                console.warn('Live message in interval deleted or inaccessible. Resetting liveMessageId and interval.');
                                clearInterval(liveIntervalId);
                                liveIntervalId = null;
                                liveMessageId = null;
                                liveMessageReference = null;
                            }
                        }
                    }, 30000);

                    await message.channel.send(`Live status updates initiated in <#${targetChannelId}>. Message ID: ${liveMessageId}`);
                } else {
                    await message.channel.send(`Error: Target channel <#${targetChannelId}> not found.`);
                }

            } catch (error) {
                console.error('Error in -live command execution:', error);
                if (axios.isAxiosError(error) && error.response) {
                    await message.channel.send(`An API error occurred: ${error.response.data.message || error.message}. Please check your server key.`);
                } else {
                    await message.channel.send('An unexpected error occurred while fetching live status. Please try again later.');
                }
            }
        }
    },
};