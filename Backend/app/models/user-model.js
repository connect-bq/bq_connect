const { routeSchema } = require("./route-model");

const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    identity_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 15,
      match: /^[0-9]+$/,
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    phone: {
      type: String,
      required: true,
      match: /^\+?\d{1,3}?[-\s]?(\d{1,4}[-\s]?){1,4}\d{2,4}$/,
    },
    age: { type: Number, required: true, min: 13, max: 120 },
    favorites_routes: { type: [routeSchema], default: [] },
    routes_history: { type: [routeSchema], default: [] },
  },
  { timestamps: true }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
