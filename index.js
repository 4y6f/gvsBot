const { sleep } = require('./src/utils/sleep.js');
const mongo = require('./src/database/connect.js');
const { client } = require('./src/index.js');

let discordClient;

(async () => {
    try {
        console.log('[EVENT]   starting.....');

        const deployCommands = require('./src/registerCommands');
        await deployCommands();
    } catch (err) {
        console.error('[ERROR]   error while starting:', err);
    }
})();

process.on('SIGINT', async () => {
    const discordClient = client;

    console.log('[SIGINT]   attempting graceful disconnect.....');
    await sleep(300);
    await mongo.disconnect();
    try {
        await discordClient.destroy();
        console.log('[LOG]   destroyed client');
    } catch (err) {
        console.error('[ERROR]   could not destroy client');
    }
    await process.exit();
})

process.on('SIGTERM', async () => {
    const discordClient = client;

    console.log('[SIGTERM]   attempting graceful disconnect.....');
    await sleep(300);
    await mongo.disconnect();
    try {
        await discordClient.destroy();
        console.log('[LOG]   destroyed client');
    } catch (err) {
        console.error('[ERROR]   could not destroy client');
    }
    await process.exit();
})