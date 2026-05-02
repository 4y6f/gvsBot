const { hasPermission, permissionEmbed } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');

module.exports = {
    name: 'echo',
    aliases: ['say', 'repeat', 'alert'],

    async execute(message, client, args) {
        const allowedRoles = [settings.roles.botOwner, settings.roles.serverOwner, settings.roles.directive]

        if (!hasPermission(message.member, allowedRoles)) {
            return message.reply(permissionEmbed());
        }

        const content = args.join(' ');

        if (!content) {
            return message.reply('please provide something for me to echo.');
        }

        await message.delete().catch(() => {});

        message.channel.send(content);
    }
}