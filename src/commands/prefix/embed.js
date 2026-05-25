const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'embed',
    async execute(message) {
        await message.delete();
        let embed = new EmbedBuilder()
            .setTitle('embed')
            .setDescription('example embed');

        return await message.channel.send({
            embeds: [embed]
        })
    }
}