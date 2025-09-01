const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Route = require("../models/route-model.js");
const routeController = require("../controllers/route-controller.js");
let mongoServer;

// Helper function to create a mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Helper function to create a mock request object
const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

// Set up a temporary in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Tear down the server after all tests are complete
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear the database after each test to ensure they are independent
afterEach(async () => {
  await Route.deleteMany({});
});

describe("Route Controller Comprehensive Tests", () => {
  // --- Standard CRUD Operations ---
  describe("Basic CRUD Operations", () => {
    it("1. should successfully create a new route and return a 201 status", async () => {
      const req = mockRequest({
        name: "Route 1",
        initial_point: {
          name: "A",
          coordinates: { latitude: 1, longitude: 1 },
        },
        end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
        distance: 10,
        estimated_time: 10,
        estimated_cost: 1000,
      });
      const res = mockResponse();
      await routeController.createRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Route 1" })
      );
    });

    it("2. should return a 400 for a create request with missing required fields", async () => {
      const req = mockRequest({ name: "Incomplete Route" });
      const res = mockResponse();
      await routeController.createRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });

    it("3. should return a 409 for a create request with a duplicate name", async () => {
      await Route.create({
        name: "Duplicate Name",
        initial_point: {
          name: "A",
          coordinates: { latitude: 1, longitude: 1 },
        },
        end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
        distance: 1,
        estimated_time: 1,
        estimated_cost: 1,
      });
      const req = mockRequest({
        name: "Duplicate Name",
        initial_point: {
          name: "C",
          coordinates: { latitude: 3, longitude: 3 },
        },
        end_point: { name: "D", coordinates: { latitude: 4, longitude: 4 } },
        distance: 2,
        estimated_time: 2,
        estimated_cost: 2,
      });
      const res = mockResponse();
      await routeController.createRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("4. should successfully get all routes and return a 200 status", async () => {
      await Route.create({
        name: "Route 2",
        initial_point: {
          name: "C",
          coordinates: { latitude: 3, longitude: 3 },
        },
        end_point: { name: "D", coordinates: { latitude: 4, longitude: 4 } },
        distance: 2,
        estimated_time: 2,
        estimated_cost: 2,
      });
      const req = mockRequest();
      const res = mockResponse();
      await routeController.getRoutes(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].length).toBe(1);
    });

    it("5. should return a specific route by ID with a 200 status", async () => {
      const newRoute = await Route.create({
        name: "Find Me",
        initial_point: {
          name: "E",
          coordinates: { latitude: 5, longitude: 5 },
        },
        end_point: { name: "F", coordinates: { latitude: 6, longitude: 6 } },
        distance: 3,
        estimated_time: 3,
        estimated_cost: 3,
      });
      const req = mockRequest({}, { id: newRoute._id });
      const res = mockResponse();
      await routeController.getRouteById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Find Me" })
      );
    });

    it("6. should return a 404 for a GET request with a non-existent ID", async () => {
      const req = mockRequest({}, { id: new mongoose.Types.ObjectId() });
      const res = mockResponse();
      await routeController.getRouteById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("7. should update a route and return a 200 status", async () => {
      const routeToUpdate = await Route.create({
        name: "Update Me",
        initial_point: {
          name: "G",
          coordinates: { latitude: 7, longitude: 7 },
        },
        end_point: { name: "H", coordinates: { latitude: 8, longitude: 8 } },
        distance: 4,
        estimated_time: 4,
        estimated_cost: 4,
      });
      const req = mockRequest(
        { name: "Updated Route" },
        { id: routeToUpdate._id }
      );
      const res = mockResponse();
      await routeController.updateRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Updated Route" })
      );
    });

    it("8. should delete a route and return a 204 status", async () => {
      const routeToDelete = await Route.create({
        name: "Delete Me",
        initial_point: {
          name: "I",
          coordinates: { latitude: 9, longitude: 9 },
        },
        end_point: { name: "J", coordinates: { latitude: 10, longitude: 10 } },
        distance: 5,
        estimated_time: 5,
        estimated_cost: 5,
      });
      const req = mockRequest({}, { id: routeToDelete._id });
      const res = mockResponse();
      await routeController.deleteRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      const deletedRoute = await Route.findById(routeToDelete._id);
      expect(deletedRoute).toBeNull();
    });

    it("should add a point to an existing route", async () => {
      const route = await Route.create({
        name: "Route with Points",
        initial_point: {
          name: "K",
          coordinates: { latitude: 11, longitude: 11 },
        },
        end_point: { name: "L", coordinates: { latitude: 12, longitude: 12 } },
        distance: 6,
        estimated_time: 6,
        estimated_cost: 6,
      });
      const pointData = { name: "Midpoint", coordinates: { latitude: 11.5, longitude: 11.5 } };
      const req = mockRequest(pointData, { id: route._id });
      const res = mockResponse();
      await routeController.addPointToRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: route._id,
        }));
      const updatedRoute = await Route.findById(route._id);
      expect(updatedRoute.path.length).toBe(1);
      expect(updatedRoute.path[0].name).toBe("Midpoint");
    });

    it("should delete a point to an existing route", async () => {
      const route = await Route.create({
        name: "Route with Points",
        initial_point: {
          name: "K",
          coordinates: { latitude: 11, longitude: 11 },
        },
        end_point: { name: "L", coordinates: { latitude: 12, longitude: 12 } },
        distance: 6,
        estimated_time: 6,
        estimated_cost: 6,
      });
      const pointData = { name: "Midpoint", coordinates: { latitude: 11.5, longitude: 11.5 } };
      const req = mockRequest(pointData, { id: route._id });
      const res = mockResponse();
      await routeController.addPointToRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: route._id,
        }));
      const updatedRoute = await Route.findById(route._id);
      expect(updatedRoute.path.length).toBe(1);
      expect(updatedRoute.path[0].name).toBe("Midpoint");

      const pointId = updatedRoute.path[0]._id;
      const deleteReq = mockRequest({}, { id: route._id, pointId: pointId });
      const deleteRes = mockResponse();

      await routeController.removePointFromRoute(deleteReq, deleteRes);
      expect(deleteRes.status).toHaveBeenCalledWith(200);
      expect(deleteRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: route._id,
        }));
    });
  });


  // --- Tests for Alerts Management ---
  describe("Alerts Management", () => {
    let testRoute;
    beforeEach(async () => {
      // Create a base route for alert tests
      testRoute = await Route.create({
        name: "Route with Alerts",
        initial_point: {
          name: "X",
          coordinates: { latitude: 0, longitude: 0 },
        },
        end_point: { name: "Y", coordinates: { latitude: 1, longitude: 1 } },
        distance: 10,
        estimated_time: 10,
        estimated_cost: 1000,
        alerts: [],
      });
    });

    it("9. should add an alert to an existing route and return a 201 status", async () => {
      const alertData = {
        type: "Traffic",
        severity: "Medium",
        username: "userA",
      };
      const req = mockRequest(alertData, { id: testRoute._id });
      const res = mockResponse();
      await routeController.addAlertToRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: testRoute._id,
          alerts: expect.arrayContaining([
            expect.objectContaining({ type: "Traffic" }),
          ]),
        })
      );
      const updatedRoute = await Route.findById(testRoute._id);
      expect(updatedRoute.alerts.length).toBe(1);
    });

    it("10. should return a 404 if adding an alert to a non-existent route", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const alertData = {
        type: "Traffic",
        severity: "Medium",
        username: "userA",
      };
      const req = mockRequest(alertData, { id: nonExistentId });
      const res = mockResponse();
      await routeController.addAlertToRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Route not found" })
      );
    });

    it("11. should return a 400 if adding an alert with missing required fields", async () => {
      const alertData = { type: "Traffic", username: "userA" }; // Missing severity
      const req = mockRequest(alertData, { id: testRoute._id });
      const res = mockResponse();
      await routeController.addAlertToRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("severity") })
      );
    });

    it("12. should remove an alert from an existing route and return a 200 status", async () => {
      // Add and save the alert first so it gets a valid _id
      const alertToAdd = {
        type: "Traffic",
        severity: "Medium",
        username: "userA",
      };
      testRoute.alerts.push(alertToAdd);
      await testRoute.save();

      const alertId = testRoute.alerts[0]._id;

      const req = mockRequest(
        {},
        { id: testRoute._id, alertId: alertId.toString() }
      );
      const res = mockResponse();
      await routeController.removeAlertFromRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: testRoute._id,
          alerts: [], // Expect alerts array to be empty
        })
      );
      const updatedRoute = await Route.findById(testRoute._id);
      expect(updatedRoute.alerts.length).toBe(0);
    });

    it("13. should return a 404 if removing an alert from a non-existent route", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const alertId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { id: nonExistentId, alertId: alertId });
      const res = mockResponse();
      await routeController.removeAlertFromRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Route not found" })
      );
    });

    it("14. should return a 404 if removing a non-existent alert from an existing route", async () => {
      const alertToAdd = {
        type: "Traffic",
        severity: "Medium",
        username: "userA",
      };
      testRoute.alerts.push(alertToAdd);
      await testRoute.save();

      const nonExistentAlertId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        {},
        { id: testRoute._id, alertId: nonExistentAlertId }
      );
      const res = mockResponse();
      await routeController.removeAlertFromRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Alert not found in this route" })
      );
      const updatedRoute = await Route.findById(testRoute._id);
      expect(updatedRoute.alerts.length).toBe(1);
    });
  });
});
