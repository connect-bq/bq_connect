const mongoose = require('mongoose');
const stopSchema = require('./stop-model');
const alertSchema = require('./alert-model');

// Main Route Schema
const routeSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    initial_point: { type: stopSchema, required: true },
    end_point: { type: stopSchema, required: true },
    path: { type: [stopSchema], default: [] },
    distance: { type: Number, required: true },
    estimated_time: { type: Number, required: true },
    estimated_cost: { type: Number, required: true },
    alerts: { type: [alertSchema], default: [] },
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;