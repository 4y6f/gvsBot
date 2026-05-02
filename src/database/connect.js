const mongoose = require('mongoose');
const settings = require('../config/settings');

module.exports = async () => {
    try {
        await mongoose.connect(settings.database.mongodburi);

        console.log('connected to mongodb');
    } catch (err) {
        console.error('mongoose error:' + err);
    }
}