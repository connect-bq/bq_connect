const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/user-model");
const { createUser, getUsers } = require("../controllers/user-controller");

let mongoServer;

beforeAll(async () => {
  // Set up in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  // Stop the in-memory MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear the database after each test
  await User.deleteMany();
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller", () => {
  // Test for createUser
  it("should create a user and return 201", async () => {
    const req = {
      body: {
        identity_number: "123456789",
        username: "Willman",
        password: "1234",
        email: "willman@test.com",
        phone: "123-456-7890",
        age: 20,
      },
    };
    const res = mockResponse();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        identity_number: "123456789",
        username: "Willman",
        password: "1234",
        email: "willman@test.com",
        phone: "123-456-7890",
        age: 20,
      })
    );
  });

    // Test for getUsers
    //TODO: Fix this test
  it("should return an array of users", async () => {
    await User.create({ name: "Ana", email: "ana@test.com", age: 25 });

    const req = {};
    const res = mockResponse();

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: "Ana", email: "ana@test.com" }),
      ])
    );
  });
});
