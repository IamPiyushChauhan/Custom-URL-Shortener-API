const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    deviceType: {
        type: String,
        required: true
    },
    osType: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        enum: ['acquisition', 'activation', 'retention', 'unknown'],
        default: 'unknown'
    },
    creatorEmail: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
});

module.exports = mongoose.model('Analytic', analyticsSchema);