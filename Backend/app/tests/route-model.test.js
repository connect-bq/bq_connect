// Import necessary libraries and modules
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Route = require("../models/route-model");
const routeController = require("../controllers/route-controller"); // Make sure this path is correct to your controller.

let mongoServer;

// Setup the in-memory database before running the tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

// Disconnect and stop the in-memory database after all tests
afterAll(async () => {
  await mongoose.disconnect();

  await mongoServer.stop();
});

// Clear the Route collection after each test to ensure clean state
afterEach(async () => {
  await Route.deleteMany({});
});

describe("Route Controller Tests (without Supertest)", () => {
  it("Should create a new route and return a 201 status with the created object", async () => {
    // Mock request body with a valid route data
    const mockRequest = {
      body: {
        name: "Test Route",
        initial_point: {
          name: "Point A",
          coordinates: { latitude: 10, longitude: -74 },
        },
        end_point: {
          name: "Point B",
          coordinates: { latitude: 11, longitude: -75 },
        },
        distance: 5.5,
        estimated_time: 25,
        estimated_cost: 8500,
      },
    };

    // Mock response object to capture the response
    const mockResponse = {
      status: jest.fn(() => mockResponse), // Mock the 'status' method
      json: jest.fn(), // Mock the 'json' method
    };

    // Call the controller's createRoute method with the mock request and response
    await routeController.createRoute(mockRequest, mockResponse);

    // Assertions to check if the correct status code and data were returned
    expect(mockResponse.status).toHaveBeenCalledWith(201); // Ensure 201 status code (Created)
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test Route", // Ensure the created object has the expected name
      })
    );
  });

  it("Should return a 400 status if required fields are missing", async () => {
    // Mock request with missing required fields
    const mockRequest = {
      body: {
        name: "Incomplete Route", // Only name is provided
      },
    };

    // Mock response object to capture the response
    const mockResponse = {
      status: jest.fn(() => mockResponse), // Mock the 'status' method
      json: jest.fn(), // Mock the 'json' method
    };

    // Call the controller's createRoute method with the mock request and response
    await routeController.createRoute(mockRequest, mockResponse);

    // Assertions to check if the correct error status and message were returned
    expect(mockResponse.status).toHaveBeenCalledWith(400); // Ensure 400 status code (Bad Request)
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String), // Ensure an error message is returned
      })
    );
  });

  it("Should return an array of routes with a 200 status", async () => {
    // Create a route in the database before making the request
    await Route.create({
      name: "Route 1",
      initial_point: { name: "A", coordinates: { latitude: 1, longitude: 1 } },
      end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
      distance: 1,
      estimated_time: 5,
      estimated_cost: 1000,
    });

    // Mock an empty request (no body needed for GET request)
    const mockRequest = {};

    // Mock response object to capture the response
    const mockResponse = {
      status: jest.fn(() => mockResponse), // Mock the 'status' method
      json: jest.fn(), // Mock the 'json' method
    };

    // Call the controller's getRoutes method with the mock request and response
    await routeController.getRoutes(mockRequest, mockResponse);

    // Assertions to check if the correct status code and data were returned
    expect(mockResponse.status).toHaveBeenCalledWith(200); // Ensure 200 status code (OK)
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: "Route 1" }), // Ensure the response contains the created route
      ])
    );
  });
});
