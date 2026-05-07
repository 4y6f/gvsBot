const { entersState, VoiceConnectionStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder, ChannelType } = require('discord.js');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const path = require('node:path');

module.exports = {
    name: 'playsts',

    async execute(message) {
        const channel = message.member?.voice.channel;

        if (!channel || channel.type !== ChannelType.GuildStageVoice) return message.reply('make sure you\'re in the right channel type for this command to work successfully.');

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

            await message.guild.members.me.voice.setSuppressed(false);
        } catch (err) {
            console.error('[ERROR]   error while elevating stage permissions', err);
        }

        const player = createAudioPlayer();
        const resource = createAudioResource(path.join(__dirname, '../../audioAssets/audio.mp3'));
        player.play(resource);
        connection.subscribe(player);
    }
}