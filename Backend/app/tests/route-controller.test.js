const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Route = require("../models/route-model");
const routeController = require("../controllers/route-controller");

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
const mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query });

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
        name: "Route 1", initial_point: { name: "A", coordinates: { latitude: 1, longitude: 1 } }, end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
        distance: 10, estimated_time: 10, estimated_cost: 1000
      });
      const res = mockResponse();
      await routeController.createRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: "Route 1" }));
    });

    it("2. should return a 400 for a create request with missing required fields", async () => {
      const req = mockRequest({ name: "Incomplete Route" });
      const res = mockResponse();
      await routeController.createRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it("3. should return a 409 for a create request with a duplicate name", async () => {
      await Route.create({ name: "Duplicate Name", initial_point: { name: "A", coordinates: { latitude: 1, longitude: 1 } }, end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } }, distance: 1, estimated_time: 1, estimated_cost: 1 });
      const req = mockRequest({ name: "Duplicate Name", initial_point: { name: "C", coordinates: { latitude: 3, longitude: 3 } }, end_point: { name: "D", coordinates: { latitude: 4, longitude: 4 } }, distance: 2, estimated_time: 2, estimated_cost: 2 });
      const res = mockResponse();
      await routeController.createRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("4. should successfully get all routes and return a 200 status", async () => {
      await Route.create({ name: "Route 2", initial_point: { name: "C", coordinates: { latitude: 3, longitude: 3 } }, end_point: { name: "D", coordinates: { latitude: 4, longitude: 4 } }, distance: 2, estimated_time: 2, estimated_cost: 2 });
      const req = mockRequest();
      const res = mockResponse();
      await routeController.getRoutes(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].length).toBe(1);
    });

    it("5. should return a specific route by ID with a 200 status", async () => {
      const newRoute = await Route.create({ name: "Find Me", initial_point: { name: "E", coordinates: { latitude: 5, longitude: 5 } }, end_point: { name: "F", coordinates: { latitude: 6, longitude: 6 } }, distance: 3, estimated_time: 3, estimated_cost: 3 });
      const req = mockRequest({}, { id: newRoute._id });
      const res = mockResponse();
      await routeController.getRouteById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: "Find Me" }));
    });

    it("6. should return a 404 for a GET request with a non-existent ID", async () => {
      const req = mockRequest({}, { id: new mongoose.Types.ObjectId() });
      const res = mockResponse();
      await routeController.getRouteById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("7. should update a route and return a 200 status", async () => {
      const routeToUpdate = await Route.create({ name: "Update Me", initial_point: { name: "G", coordinates: { latitude: 7, longitude: 7 } }, end_point: { name: "H", coordinates: { latitude: 8, longitude: 8 } }, distance: 4, estimated_time: 4, estimated_cost: 4 });
      const req = mockRequest({ name: "Updated Route" }, { id: routeToUpdate._id });
      const res = mockResponse();
      await routeController.updateRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: "Updated Route" }));
    });

    it("8. should delete a route and return a 204 status", async () => {
      const routeToDelete = await Route.create({ name: "Delete Me", initial_point: { name: "I", coordinates: { latitude: 9, longitude: 9 } }, end_point: { name: "J", coordinates: { latitude: 10, longitude: 10 } }, distance: 5, estimated_time: 5, estimated_cost: 5 });
      const req = mockRequest({}, { id: routeToDelete._id });
      const res = mockResponse();
      await routeController.deleteRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      const deletedRoute = await Route.findById(routeToDelete._id);
      expect(deletedRoute).toBeNull();
    });
  });

  // --- Tests for Alerts Management ---
  describe("Alerts Management", () => {
    let testRoute;
    beforeEach(async () => {
      // Create a base route for alert tests
      testRoute = await Route.create({
        name: "Route with Alerts", initial_point: { name: "X", coordinates: { latitude: 0, longitude: 0 } }, end_point: { name: "Y", coordinates: { latitude: 1, longitude: 1 } },
        distance: 10, estimated_time: 10, estimated_cost: 1000, alerts: []
      });
    });

    it("9. should add an alert to an existing route and return a 201 status", async () => {
      const alertData = { type: "Traffic", severity: "Medium", username: "userA" };
      const req = mockRequest(alertData, { id: testRoute._id });
      const res = mockResponse();
      await routeController.addAlertToRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: testRoute._id,
        alerts: expect.arrayContaining([expect.objectContaining({ type: "Traffic" })])
      }));
      const updatedRoute = await Route.findById(testRoute._id);
      expect(updatedRoute.alerts.length).toBe(1);
    });

    it("10. should return a 404 if adding an alert to a non-existent route", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const alertData = { type: "Traffic", severity: "Medium", username: "userA" };
      const req = mockRequest(alertData, { id: nonExistentId });
      const res = mockResponse();
      await routeController.addAlertToRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Route not found" }));
    });

    it("11. should return a 400 if adding an alert with missing required fields", async () => {
      const alertData = { type: "Traffic", username: "userA" }; // Missing severity
      const req = mockRequest(alertData, { id: testRoute._id });
      const res = mockResponse();
      await routeController.addAlertToRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("severity") }));
    });

    it("12. should remove an alert from an existing route and return a 200 status", async () => {
      // Add and save the alert first so it gets a valid _id
      const alertToAdd = { type: "Traffic", severity: "Medium", username: "userA" };
      testRoute.alerts.push(alertToAdd);
      await testRoute.save();
      const alertId = testRoute.alerts[0]._id;

      const req = mockRequest({}, { id: testRoute._id, alertId: alertId.toString() });
      const res = mockResponse();
      await routeController.removeAlertFromRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: testRoute._id,
        alerts: [] // Expect alerts array to be empty
      }));
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
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Route not found" }));
    });

    it("14. should return a 404 if removing a non-existent alert from an existing route", async () => {
      const alertToAdd = { type: "Traffic", severity: "Medium", username: "userA" };
      testRoute.alerts.push(alertToAdd);
      await testRoute.save();
      
      const nonExistentAlertId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { id: testRoute._id, alertId: nonExistentAlertId });
      const res = mockResponse();
      await routeController.removeAlertFromRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Alert not found in this route" }));
      const updatedRoute = await Route.findById(testRoute._id);
      expect(updatedRoute.alerts.length).toBe(1);
    });
  });

  // --- Tests for Special Queries and Validations ---
  describe("Special Queries and Validations", () => {
    
    it("15. should return a 400 when estimated_cost is over 999,999,999", async () => {
      const req = mockRequest({
        name: "High Cost Route", initial_point: { name: "A", coordinates: { latitude: 1, longitude: 1 } }, end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } },
        distance: 10, estimated_time: 10, estimated_cost: 1000000000
      });
      const res = mockResponse();
      await routeController.createRoute(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      // Your code returns a Spanish message, so the test expects a Spanish string.
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("El costo no puede ser mayor a 999.999.999.") }));
    });

    it("16. should find and return routes that match a search by points", async () => {
      await Route.create({ name: "Searched Route", initial_point: { name: "A", coordinates: { latitude: 10, longitude: 20 } }, end_point: { name: "B", coordinates: { latitude: 30, longitude: 40 } }, distance: 1, estimated_time: 1, estimated_cost: 1 });
      const req = mockRequest({}, {}, { startLat: 10, startLon: 20, endLat: 30, endLon: 40 });
      const res = mockResponse();
      await routeController.searchRoutes(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: "Searched Route" })]));
    });

    it("17. should return an empty array if no routes match the search points", async () => {
      await Route.create({ name: "Unmatched Route", initial_point: { name: "A", coordinates: { latitude: 10, longitude: 20 } }, end_point: { name: "B", coordinates: { latitude: 30, longitude: 40 } }, distance: 1, estimated_time: 1, estimated_cost: 1 });
      const req = mockRequest({}, {}, { startLat: 50, startLon: 60, endLat: 70, endLon: 80 });
      const res = mockResponse();
      await routeController.searchRoutes(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it("18. should return a 400 if search parameters are missing for point search", async () => {
      const req = mockRequest({}, {}, { startLat: 10 });
      const res = mockResponse();
      await routeController.searchRoutes(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("Missing search parameters") }));
    });

    it("19. should find routes within a specified distance range", async () => {
      await Route.create({ name: "Short Route", initial_point: { name: "A", coordinates: { latitude: 1, longitude: 1 } }, end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } }, distance: 5, estimated_time: 1, estimated_cost: 1 });
      await Route.create({ name: "Medium Route", initial_point: { name: "C", coordinates: { latitude: 3, longitude: 3 } }, end_point: { name: "D", coordinates: { latitude: 4, longitude: 4 } }, distance: 15, estimated_time: 1, estimated_cost: 1 });
      await Route.create({ name: "Long Route", initial_point: { name: "E", coordinates: { latitude: 5, longitude: 5 } }, end_point: { name: "F", coordinates: { latitude: 6, longitude: 6 } }, distance: 25, estimated_time: 1, estimated_cost: 1 });
      
      const req = mockRequest({}, {}, { minDistance: 10, maxDistance: 20 });
      const res = mockResponse();
      await routeController.searchRoutesByDistance(req, res); 
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: "Medium Route" })]));
      expect(res.json.mock.calls[0][0].length).toBe(1);
    });

    it("20. should return a 400 if search by distance parameters are missing", async () => {
      const req = mockRequest({}, {}, { minDistance: 10 });
      const res = mockResponse();
      await routeController.searchRoutesByDistance(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("Missing search parameters") }));
    });

    it("21. should find routes that meet both cost and time criteria", async () => {
      await Route.create({ name: "Cheap & Fast", initial_point: { name: "A", coordinates: { latitude: 1, longitude: 1 } }, end_point: { name: "B", coordinates: { latitude: 2, longitude: 2 } }, distance: 1, estimated_time: 10, estimated_cost: 5000 });
      await Route.create({ name: "Expensive & Slow", initial_point: { name: "C", coordinates: { latitude: 3, longitude: 3 } }, end_point: { name: "D", coordinates: { latitude: 4, longitude: 4 } }, distance: 1, estimated_time: 30, estimated_cost: 15000 });
      
      const req = mockRequest({}, {}, { maxTime: 20, maxCost: 10000 });
      const res = mockResponse();
      await routeController.searchRoutesByCriteria(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: "Cheap & Fast" })]));
      expect(res.json.mock.calls[0][0].length).toBe(1);
    });

    it("22. should return a 400 if search by criteria parameters are missing", async () => {
      const req = mockRequest({}, {}, { maxTime: 20 });
      const res = mockResponse();
      await routeController.searchRoutesByCriteria(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining("Missing search parameters") }));
    });
  });
});