const mongoose = require("mongoose");

// Esquema para las alertas (sub-documento)
const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Traffic", "Accident", "Closure", "Hazard", "Other"],
    required: [true, "El tipo de alerta es obligatorio."],
  },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: [true, "La severidad de la alerta es obligatoria."],
  },
  description: {
    type: String,
    trim: true,
  },
  reported_at: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio."],
  },
});

// Esquema para los puntos de la ruta
const pointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del punto es obligatorio."],
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  { _id: false }
);

// Esquema principal para las rutas
const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la ruta es obligatorio."],
      unique: true,
      trim: true,
    },
    initial_point: {
      type: pointSchema,
      required: [true, "El punto de inicio es obligatorio."],
    },
    end_point: {
      type: pointSchema,
      required: [true, "El punto final es obligatorio."],
    },
    distance: {
      type: Number,
      required: [true, "La distancia es obligatoria."],
      min: [0, "La distancia no puede ser negativa."],
    },
    estimated_time: {
      type: Number,
      required: [true, "El tiempo estimado es obligatorio."],
      min: [0, "El tiempo estimado no puede ser negativo."],
    },
    estimated_cost: {
      type: Number,
      required: [true, "El costo estimado es obligatorio."],
      min: [0, "El costo estimado no puede ser negativo."],
      max: [999999999, "El costo no puede ser mayor a 999.999.999."],
    },
    alerts: [alertSchema], // Un array de sub-documentos de alerta
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;