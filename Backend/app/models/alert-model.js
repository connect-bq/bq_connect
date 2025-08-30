const mongoose = require("mongoose");
const reportSchema = require("./report-model");

// Schema for Alerts
const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    severity: { type: String, required: true },
    username: { type: String, required: true },
    reports: { type: [reportSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = alertSchema;
