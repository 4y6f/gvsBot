const {
    entersState,
    VoiceConnectionStatus,
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    NoSubscriberBehavior,
} = require('@discordjs/voice');

const { ChannelType } = require('discord.js');
const path = require('node:path');

const { hasPermission, permissionMessage } = require('../../utils/permissionChecker');
const { sleep } = require('../../utils/sleep');
const settings = require('../../config/settings');

module.exports = {
    name: 'playsts',

    async execute(message) {
        try {
            const allowedRoles = [settings.roles.directive];

            if (!hasPermission(message.member, allowedRoles)) {
                return message.reply(permissionMessage());
            }

            const channel = message.member?.voice?.channel;

            if (!channel || channel.type !== ChannelType.GuildStageVoice) {
                const replyMsg = await message.reply(
                    'make sure you\'re in the right channel type for this command to work successfully.'
                );

                await sleep(3000);

                return replyMsg.delete().catch(() => {});
            }

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false,
            });

            try {
                await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

                if (message.guild.members.me.voice.suppress) {
                    await message.guild.members.me.voice.setSuppressed(false);
                }
            } catch (err) {
                console.error('[ERROR]   error while elevating stage permissions', err);

                connection.destroy();

                return message.reply(
                    'failed to connect to the stage channel successfully.'
                );
            }

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });

            const resource = createAudioResource(
                path.join(__dirname, '../../audioAssets/audio.mp3')
            );

            connection.subscribe(player);
            player.play(resource);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });

            player.on('error', (err) => {
                console.error('[ERROR]   audio player error', err);

                connection.destroy();
            });

        } catch (err) {
            console.error('[ERROR]   command failed', err);
        }
    }
};