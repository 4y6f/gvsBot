const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');

module.exports = {
    name: 'sync',

    async execute(message, client) {
        const allowedRoles = [settings.roles.botOwner];

        if (!hasPermission(message.member, allowedRoles)) {
            return message.reply(permissionReply());
        }

        try {
            await client.application.commands.set([]);

            const commands = client.commands.interaction;
            const data = commands.map(cmd => cmd.data.toJSON());

            await client.application.commands.set(data);

            return message.reply('it worked');
        } catch (err) {
            console.error('Sync failed:', err);
            return message.reply('sync failed!!!11!');
        }
    }
};