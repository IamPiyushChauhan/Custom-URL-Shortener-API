const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    customAlias: {
        type: String,
        unique: true,
        sparse: true
    },
    topic: {
        type: String,
        enum: ['acquisition', 'activation', 'retention', 'unknown'],
        default: 'unknown'
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('URL', urlSchema);