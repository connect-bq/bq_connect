const mongoose = require("mongoose");
const coordinateSchema = new mongoose.Schema({
  latitude: { 
    type: Number, 
    required: true,
    min: -90, // Add a minimum value validator
    max: 90  // Add a maximum value validator
  },
  longitude: { 
    type: Number, 
    required: true,
    min: -180, // Add a minimum value validator
    max: 180 // Add a maximum value validator
  },
}, { _id: false });

module.exports = coordinateSchema;