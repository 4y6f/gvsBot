const settings = require("../config/settings")

module.exports = {
    name: 'sessionrole',
    async execute(interaction) {
        const role = settings.sessions.sessionrole;
        const member = interaction.member;

        try {
            if (member.roles.cache.has(role)) {
                await member.roles.remove(role);
                return await interaction.reply({ content: 'You have removed the session role from yourself.', flags: 64 });
            } else {
                await member.roles.add(role);
                return await interaction.reply({ content: 'You have added the session role to yourself.', flags: 64 });
            }
        } catch (error) {
            console.log('error while toggling the session role ', error);
        }
    }
}