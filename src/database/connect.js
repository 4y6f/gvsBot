const mongoose = require('mongoose');
const settings = require('../config/settings');

module.exports = { connect, disconnect };


async function connect() {
    try {
        await mongoose.connect(settings.database.mongodburi);
        console.log('[LOG]   connected to mongodb');
    } catch (err) {
        console.error('[ERROR]   mongoose error:' + err);
    }
}

async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log('[LOG]   gracefully disconnected from mongodb');
    } catch (err) {
        console.log('[ERROR] error while gracefully disconnecting from mongodb', err);
    }
}