const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');

module.exports = {
    name: 'purge',

    async execute(message, client, args) {
        const allowedRoles = [settings.roles.botOwner, settings.roles.directive, settings.roles.serverOwner, settings.roles.moderator];

        if (!hasPermission(message.member, allowedRoles)) {
            return message.reply(permissionReply());
        } else {
            const deleteCount = parseInt(args[0], 10);

            if (!deleteCount || deleteCount < 1 || deleteCount > 100) {
                return message.reply('please provide a number of messages to delete between 1 and 100');
            }

            try {
                await message.channel.bulkDelete(deleteCount);
                return message.reply(`successfully deleted ${deleteCount} messages`).then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });
            } catch (err) {
                console.error('purge command error', err)
            }
        }
    }
};