require('dotenv').config();

const settings = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    bannerImages: {
        sessions: 'https://media.discordapp.net/attachments/1303196770205171712/1438008060558839841/REF7.png?ex=69f6189e&is=69f4c71e&hm=c0fdca2e9b1084ed70baedd1683609b3271f3ae266948abf7ed48d0d8d233e00&=&format=webp&quality=lossless&width=2576&height=858',
        general: 'https://media.discordapp.net/attachments/1303196770205171712/1438008060558839841/REF7.png?ex=69f6189e&is=69f4c71e&hm=c0fdca2e9b1084ed70baedd1683609b3271f3ae266948abf7ed48d0d8d233e00&=&format=webp&quality=lossless&width=2576&height=858',
    },
    footerImages: {
            general: 'https://media.discordapp.net/attachments/1303196770205171712/1438008060558839841/REF7.png?ex=69f6189e&is=69f4c71e&hm=c0fdca2e9b1084ed70baedd1683609b3271f3ae266948abf7ed48d0d8d233e00&=&format=webp&quality=lossless&width=2576&height=858',
    },
    roles: {
        botOwner: '1477822244372873318',
        serverOwner: '1477107500296835082',
        directive: '1477731886175617075',
        
        employee: '1477190938374963263',
    }
    
};

if (!settings.token || !settings.clientId) {
    throw new Error('You need to set your discord bot token and your client id.\nCreate an .env file with the folliwing:\n\nTOKEN=your_bot_token\nCLIENT_ID=your_client_id');
}

module.exports = settings;