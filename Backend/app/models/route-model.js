const mongoose = require('mongoose');

// Schema for Coordinates
const coordinateSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
}, { _id: false });

// Schema for Stops (Initial, End, and Path)
const stopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: { type: coordinateSchema, required: true },
}, { _id: false });

// Schema for Alert Reports
const reportSchema = new mongoose.Schema({
    reason: { type: String, required: true },
    username: { type: String, required: true },
}, { _id: false });

// Schema for Alerts
const alertSchema = new mongoose.Schema({
    type: { type: String, required: true },
    severity: { type: String, required: true },
    username: { type: String, required: true },
    reports: { type: [reportSchema], default: [] },
}, { _id: false });

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