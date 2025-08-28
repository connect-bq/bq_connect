require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/database");

describe("MongoDB Connection", () => {
  // Connect to the database before running tests
  beforeAll(async () => {
    await connectDB();
  });

  // Test 1: Check if Mongoose is connected
  it("should connect to MongoDB", async () => {
     // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    expect(mongoose.connection.readyState).toBe(1); 
  });

  // Close the connection after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
