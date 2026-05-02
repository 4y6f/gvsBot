require('dotenv').config();

const settings = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    embedColor: '#1c1c1c',
    bannerImages: {
        sessions: 'https://placehold.co/900x300.png',
        general: 'https://placehold.co/900x300.png',
    },
    footerImages: {
            general: 'https://placehold.co/900x30.png',
    },
    roles: {
        botOwner: '1477822244372873318',
        serverOwner: '1477107500296835082',
        directive: '1477731886175617075',
        moderator: '1477730895841595616',
        employee: '1477190938374963263',
    },
    channels: {
        moderationLogs: '1477113325467861123',
        feedback: '1500181105029156956',
    }
    
};

if (!settings.token || !settings.clientId) {
    throw new Error('You need to set your discord bot token and your client id.\nCreate an .env file with the folliwing:\n\nTOKEN=your_bot_token\nCLIENT_ID=your_client_id');
}

module.exports = settings;