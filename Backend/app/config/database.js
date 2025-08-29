require("dotenv").config({quiet: true});
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Export the connectDB function
module.exports = connectDB;
