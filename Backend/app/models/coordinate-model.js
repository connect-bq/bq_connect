const mongoose = require('mongoose');

// Schema for Coordinates
const coordinateSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
}, { _id: false });

module.exports = coordinateSchema;