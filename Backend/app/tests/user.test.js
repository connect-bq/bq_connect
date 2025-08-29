const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/user-model");

let mongoServer;

beforeAll(async () => {
  // Set up in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  // Close the connection and stop the server
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear the database after each test
  await User.deleteMany();
});

describe("User Model", () => {
  it("should create a user", async () => {
    const user = new User({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.identity_number).toBe("123456789");
    expect(savedUser.username).toBe("Willman");
    expect(savedUser.password).toBe("1234");
    expect(savedUser.email).toBe("willman@test.com");
    expect(savedUser.phone).toBe("123-456-7890");
    expect(savedUser.age).toBe(20);
  });

  it("should not save a user without required fields", async () => {
    const user = new User({});
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
  });

  it("should not save a user with an invalid identity number", async () => {
    const user = new User({
      identity_number: "abc123",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
    expect(error.errors.identity_number).toBeDefined();
  });

  it("should not save a user with an invalid email", async () => {
    const user = new User({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "invalid-email",
      phone: "123-456-7890",
      age: 20,
    });
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
    expect(error.errors.email).toBeDefined();
  });

  it("should not save a user with an age less than 13", async () => {
    const user = new User({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 12,
    });
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
    expect(error.errors.age).toBeDefined();
  });

  it("should not save a user with a duplicate identity number", async () => {
    const user1 = new User({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });
    await user1.save();

    const user2 = new User({
      identity_number: "123456789",
      username: "AnotherUser",
      password: "5678",
      email: "willman2@test.com",
      phone: "987-654-3210",
      age: 25,
    });
    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe("MongoServerError");
    expect(error.code).toBe(11000);
  });

  it("should not save a user with a duplicate email", async () => {
    const user1 = new User({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });
    await user1.save();

    const user2 = new User({
      identity_number: "987654321",
      username: "AnotherUser",
      password: "5678",
      email: "willman@test.com",
      phone: "987-654-3210",
      age: 25,
    });
    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe("MongoServerError");
    expect(error.code).toBe(11000);
  });
  it("should not save a user with an invalid phone number", async () => {
    const user = new User({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "invalid-phone",
      age: 20,
    });
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
    expect(error.errors.phone).toBeDefined();
  });
});
