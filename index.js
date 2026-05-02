(async () => {
    try {
        console.log('starting.....');

        const deployCommands = require('./src/registerCommands');
        await deployCommands();

        require('./src/index.js');
    } catch (err) {
        console.error('error while starting:', err);
    }
})();