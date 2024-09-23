const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
        unique: true
    },
    title: String,
    subtitle: String,
    mainContent: String,
    ctaText: String
});

module.exports = mongoose.model('Content', contentSchema);