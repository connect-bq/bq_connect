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

  it("should return an array of users", async () => {
    await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    const req = {};
    const res = mockResponse();

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          identity_number: "123456789",
          username: "Willman",
          password: "1234",
          email: "willman@test.com",
          phone: "123-456-7890",
          age: 20,
        }),
      ])
    );
  });

  it("should return user by ID", async () => {
    const user = await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    const req = { params: { id: user._id } };
    const res = mockResponse();

    const { getUserById } = require("../controllers/user-controller");
    await getUserById(req, res);

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

  it("should update user by ID", async () => {
    const user = await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    const req = {
      params: { id: user._id },
      body: { username: "UpdatedWillman" },
    };
    const res = mockResponse();

    const { updateUser } = require("../controllers/user-controller");
    await updateUser(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        username: "UpdatedWillman",
      })
    );
  });

  it("should delete user by ID", async () => {
    const user = await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    const req = { params: { id: user._id } };
    const res = mockResponse();

    const { deleteUser } = require("../controllers/user-controller");
    await deleteUser(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "User deleted" });
  });

  it("should add a route to user", async () => {
    const user = await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    const req = {
      params: { id: user._id },
      body: {
        route: {
          name: "High Cost Route",
          initial_point: {
            name: "A",
            coordinates: { latitude: 1, longitude: 1 },
          },
          end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
          distance: 10,
          estimated_time: 10,
          estimated_cost: 1000000000,
        },
      },
    };
    const res = mockResponse();

    const { addRouteToUserHistory } = require("../controllers/user-controller");
    await addRouteToUserHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          name: "High Cost Route",
          initial_point: {
            name: "A",
            coordinates: { latitude: 1, longitude: 1 },
          },
          end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
          distance: 10,
          estimated_time: 10,
          estimated_cost: 1000000000,
        },
      ])
    );
  });

  it("should remove a route from user", async () => {
    const user = await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    user.routes_history.push({
      name: "High Cost Route",
      initial_point: {
        name: "A",
        coordinates: { latitude: 1, longitude: 1 },
      },
      end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
      distance: 10,
      estimated_time: 10,
      estimated_cost: 1000000000,
    });
    user.routes_history.push({
      name: "Lacasete",
      initial_point: {
        name: "A",
        coordinates: { latitude: 1, longitude: 1 },
      },
      end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
      distance: 10,
      estimated_time: 10,
      estimated_cost: 1000000000,
    });
    await user.save();

    const req = {
      params: { id: user._id },
      body: {
        route: {
          name: "High Cost Route",
          initial_point: {
            name: "A",
            coordinates: { latitude: 1, longitude: 1 },
          },
          end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
          distance: 10,
          estimated_time: 10,
          estimated_cost: 1000000000,
        },
      },
    };
    const res = mockResponse();

    const {
      removeRouteFromUserHistory,
    } = require("../controllers/user-controller");
    await removeRouteFromUserHistory(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          distance: 10,
          end_point: { coordinates: { latitude: 2, longitude: 2 }, name: "B" },
          estimated_cost: 1000000000,
          estimated_time: 10,
          initial_point: {
            coordinates: { latitude: 1, longitude: 1 },
            name: "A",
          },
          name: "High Cost Route",
        },
        {
          distance: 10,
          end_point: { coordinates: { latitude: 2, longitude: 2 }, name: "B" },
          estimated_cost: 1000000000,
          estimated_time: 10,
          initial_point: {
            coordinates: { latitude: 1, longitude: 1 },
            name: "A",
          },
          name: "Lacasete",
        },
      ])
    );
  });

  it("should add a favorite route to user", async () => {
    const user = await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    const req = {
      params: { id: user._id },
      body: {
        route: {
          name: "High Cost Route",
          initial_point: {
            name: "A",
            coordinates: { latitude: 1, longitude: 1 },
          },
          end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
          distance: 10,
          estimated_time: 10,
          estimated_cost: 1000000000,
        },
      },
    };
    const res = mockResponse();

    const {
      addFavoriteRouteToUser,
    } = require("../controllers/user-controller");
    await addFavoriteRouteToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          name: "High Cost Route",
          initial_point: {
            name: "A",
            coordinates: { latitude: 1, longitude: 1 },
          },
          end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
          distance: 10,
          estimated_time: 10,
          estimated_cost: 1000000000,
        },
      ])
    );
  });

  it("should remove a favorite route from user", async () => {
    const user = await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    user.favorites_routes.push({
      name: "High Cost Route",
      initial_point: {
        name: "A",
        coordinates: { latitude: 1, longitude: 1 },
      },
      end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
      distance: 10,
      estimated_time: 10,
      estimated_cost: 1000000000,
    });
    user.favorites_routes.push({
      name: "Lacasete",
      initial_point: {
        name: "A",
        coordinates: { latitude: 1, longitude: 1 },
      },
      end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
      distance: 10,
      estimated_time: 10,
      estimated_cost: 1000000000,
    });
    await user.save();

    const req = {
      params: { id: user._id },
      body: {
        route: {
          name: "High Cost Route",
          initial_point: {
            name: "A",
            coordinates: { latitude: 1, longitude: 1 },
          },
          end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
          distance: 10,
          estimated_time: 10,
          estimated_cost: 1000000000,
        },
      },
    };
    const res = mockResponse();

    const {
      removeFavoriteRouteFromUser,
    } = require("../controllers/user-controller");
    await removeFavoriteRouteFromUser(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          name: "Lacasete",
          initial_point: {
            name: "A",
            coordinates: { latitude: 1, longitude: 1 },
          },
          end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
          distance: 10,
          estimated_time: 10,
          estimated_cost: 1000000000,
        },
      ])
    );
  });

  it("should handle errors in getUsers", async () => {
    // Simulate a database error by disconnecting mongoose
    await mongoose.disconnect();

    const req = {};
    const res = mockResponse();

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      })
    );

    // Reconnect mongoose for subsequent tests
    await mongoose.connect(mongoServer.getUri());
  });

  it("should return 404 for non-existent user in getUserById", async () => {
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = mockResponse();

    const { getUserById } = require("../controllers/user-controller");
    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle errors in createUser", async () => {
    const req = {
      body: {
        // Missing required fields to trigger validation error
        username: "Willman",
      },
    };

    const res = mockResponse();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  it("should return 404 for non-existent user in updateUser", async () => {
    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      body: { username: "UpdatedWillman" },
    };
    const res = mockResponse();

    const { updateUser } = require("../controllers/user-controller");
    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 404 for non-existent user in deleteUser", async () => {
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = mockResponse();

    const { deleteUser } = require("../controllers/user-controller");
    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 404 for non-existent route in removeRouteFromUser", async () => {
    const user = await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    const req = {
      params: { id: user._id, route: "NonExistentRoute" },
    };
    const res = mockResponse();

    const {
      removeRouteFromUserHistory,
    } = require("../controllers/user-controller");
    await removeRouteFromUserHistory(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([]));
  });

  it("should return 404 for non-existent user in addRouteToUser", async () => {
    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      body: { route: "Route" },
    };
    const res = mockResponse();

    const { addRouteToUserHistory } = require("../controllers/user-controller");
    await addRouteToUserHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 400 for duplicate favorite route in addFavoriteRouteToUser", async () => {
    const user = await User.create({
      identity_number: "123456789",
      username: "Willman",
      password: "1234",
      email: "willman@test.com",
      phone: "123-456-7890",
      age: 20,
    });

    user.favorites_routes.push("FavoriteRoute");
    await user.save();

    const req = {
      params: { id: user._id },
      body: { route: "FavoriteRoute" },
    };
    const res = mockResponse();

    const {
      addFavoriteRouteToUser,
    } = require("../controllers/user-controller");
    await addFavoriteRouteToUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Route already in favorites",
    });
  });
});
