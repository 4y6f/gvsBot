const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    time
} = require('discord.js');

const axios = require('axios');
const settings = require('../config/settings');

const SERVER_KEY = settings.erlcApi.apikey;
const ERLC_BASE_URL = settings.erlcApi.apiBaseLink;

const CHANNEL_ID = '1477110025955577988';
const MESSAGE_ID = '1508543534154776778';

module.exports = async (client) => {

    function getServerStatusButton(isOnline) {

        return new ButtonBuilder()
            .setCustomId('server_status_button')
            .setLabel(isOnline ? 'Server Online' : 'Server Offline')
            .setStyle(isOnline ? ButtonStyle.Success : ButtonStyle.Danger)
            .setDisabled(true);
    }

    function getSessionRoleButton() {

        return new ButtonBuilder()
            .setCustomId('sessionrole')
            .setLabel('Session Ping')
            .setEmoji('<:notification:1508536750388150312>')
            .setStyle(ButtonStyle.Secondary);
    }

    async function fetchServerData() {

        try {

            const [playersResponse, queueResponse] = await Promise.all([
                axios.get(
                    `${ERLC_BASE_URL}/server/players`,
                    {
                        headers: {
                            'Server-key': SERVER_KEY
                        },
                        timeout: 10000
                    }
                ),

                axios.get(
                    `${ERLC_BASE_URL}/server/queue`,
                    {
                        headers: {
                            'Server-key': SERVER_KEY
                        },
                        timeout: 10000
                    }
                )
            ]);

            const players = Array.isArray(playersResponse.data)
                ? playersResponse.data
                : [];

            const queue = Array.isArray(queueResponse.data)
                ? queueResponse.data
                : [];

            const staffCount = players.filter(player =>
                [
                    'Server Administrator',
                    'Server Moderator',
                    'Server Co Owner',
                    'Server Owner'
                ].includes(player.Permission)
            ).length;

            const totalPlayers = players.length
            return {
                online: totalPlayers > 0,
                totalPlayers,
                staffCount,
                queueCount: queue.length
            };

        } catch (error) {
            return {
                online: false,
                totalPlayers: 0,
                staffCount: 0,
                queueCount: 0
            };
        }
    }

    async function updateStatus() {

        try {

            const channel = await client.channels.fetch(CHANNEL_ID);

            if (!channel) {
                return console.log('Status channel not found');
            }

            const message = await channel.messages.fetch(MESSAGE_ID);

            if (!message) {
                return console.log('Status message not found');
            }

            const data = await fetchServerData();

            const embed1 = new EmbedBuilder()
                .setColor(settings.embedColor)
                .setImage(settings.bannerImages.general);

            const embed2 = new EmbedBuilder()
                .setTitle('Session Information')
                .setDescription(
                    '> Our sessions are hosted at different times depending on host availability.'
                )
                .setColor(settings.embedColor)
                .setImage(settings.footerImages.general);

            const embed3 = new EmbedBuilder()
                .setTitle('In-Game Status')
                .setColor(data.online ? settings.embedColor : settings.embedColor)
                .setDescription(
                    `**Last updated:** ${time(Math.floor(Date.now() / 1000), 'R')}`
                )
                .setImage(settings.footerImages.general)
                .addFields(
                    {
                        name: 'Players',
                        value: `\`\`\`${data.totalPlayers}/40\`\`\``,
                        inline: true
                    },
                    {
                        name: 'Staff Online',
                        value: `\`\`\`${data.staffCount}\`\`\``,
                        inline: true
                    },
                    {
                        name: 'In Queue',
                        value: `\`\`\`${data.queueCount}\`\`\``,
                        inline: true
                    }
                );

            const row = new ActionRowBuilder()
                .addComponents(
                    getSessionRoleButton(),
                    getServerStatusButton(data.online)
                );

            await message.edit({
                embeds: [embed1, embed2, embed3],
                components: [row]
            });

        } catch (error) {

            console.error('Live status update failed:', error);
        }
    }

    await updateStatus();

    setInterval(updateStatus, 45000);
};