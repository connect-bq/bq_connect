  const mongoose = require("mongoose");

  // Esquema para los puntos de la ruta
  const pointSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    { _id: false }
  );

  module.exports = pointSchema;
