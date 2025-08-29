// Import Mongoose and other models
const mongoose = require("mongoose");
const StopSchema = require("./stop-model"); // Schema for stops
const AlertSchema = require("./alert-model"); // Schema for alerts

// Define the schema for routes
const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Route name is required."], // Ensure name is provided
    unique: true, // Route name must be unique
    trim: true, // 1. Trim spaces around the name
  },
  initial_point: {
    type: StopSchema,
    required: [true, "Initial point is required."], // Ensure initial point is provided
  },
  end_point: {
    type: StopSchema,
    required: [true, "End point is required."], // Ensure end point is provided
  },
  distance: {
    type: Number,
    required: [true, "Distance is required."], // Ensure distance is provided
    min: [0, "Distance cannot be negative."], // 2. Add validation for non-negative distance
  },
  estimated_time: {
    type: Number,
    required: [true, "Estimated time is required."], // Ensure estimated time is provided
    min: [0, "Estimated time cannot be negative."], // 3. Add validation for non-negative time
  },
  estimated_cost: {
    type: Number,
    required: [true, "Estimated cost is required."], // Ensure estimated cost is provided
    min: [0, "Estimated cost cannot be negative."], // 4. Add validation for non-negative cost
  },
  path: {
    type: [StopSchema],
    default: [], // Default value is an empty array
  },
  alerts: {
    type: [AlertSchema],
    default: [], // Default value is an empty array
  },
});

// Create and export the Route model based on the schema
const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
