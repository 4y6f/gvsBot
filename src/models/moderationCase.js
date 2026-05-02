const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseId: {
        type: String,
        required: true,
        unique: true
    },

    guildId: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    moderatorId: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ['warning', 'timeout', 'kick', 'ban'],
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        default: null // only use this arg fir timeout
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('moderationCase', caseSchema);