const mongoose = require("mongoose");
const pointSchema = require("./point-model");
const alertSchema = require("./alert-model");


// Esquema principal para las rutas
const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    initial_point: {
      type: pointSchema,
      required: true,
    },
    end_point: {
      type: pointSchema,
      required: true,
    },
    path: { type: [pointSchema], default: [] },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    estimated_time: {
      type: Number,
      required: true,
      min: 0,
    },
    estimated_cost: {
      type: Number,
      required: true,
      min: 0,
      max: 999999999,
    },
    alerts: { type: [alertSchema], default: [] },
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route, routeSchema;