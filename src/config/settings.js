require('dotenv').config();

const settings = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    prefix: 'g!',
    embedColor: '#1c1c1c',
    erlcApi: {
        apiBaseLink: 'https://api.policeroleplay.community/v1',
        apikey: process.env.erlcapikey,
    },
    database: {
        mongodburi: process.env.MONGO_URI,
    },
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

if (!settings.token || !settings.clientId || !settings.guildId) {
    throw new Error('Make sure all of the following settings are set, they are required to run!\n- Bot Token\n- Client ID\n- Guild ID');
}

module.exports = settings;