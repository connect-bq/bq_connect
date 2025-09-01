const mongoose = require('mongoose');
const coordinateSchema = require('./coordinate-model');

// Schema for Stops (Initial, End, and Path)
const stopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: { type: coordinateSchema, required: true },
}, { _id: false });

module.exports = stopSchema;