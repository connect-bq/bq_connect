const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    identity_number: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    favorites_routes: { type: [String], default: [] },
    routes_history: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;