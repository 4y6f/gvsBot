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
            // Step 1: Wipe all previous application commands
            await client.application.commands.set([]);

            // Step 2: Prepare current command data for sync
            const commands = client.commands.interaction;
            const data = commands.map(cmd => cmd.data.toJSON());

            // Step 3: Resync the current commands
            await client.application.commands.set(data);

            return message.reply('Application commands successfully synced.');
        } catch (err) {
            console.error('Sync failed:', err);
            return message.reply('Sync failed. Please check the console for errors.');
        }
    }
};