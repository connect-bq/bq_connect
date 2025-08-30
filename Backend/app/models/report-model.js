const mongoose = require('mongoose');

// Schema for Alert Reports
const reportSchema = new mongoose.Schema({
    reason: { type: String, required: true },
    username: { type: String, required: true },
}, { _id: false });

module.exports = reportSchema;