const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 20 },
    dailyScans: { type: Number, default: 0 },
    lastScanDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User ', userSchema);