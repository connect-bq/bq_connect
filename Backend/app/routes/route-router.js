const express = require("express");
const {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  addAlertToRoute,
  removeAlertFromRoute,
  searchRoutes,
  searchRoutesByDistance,
  searchRoutesByCriteria,
} = require("../controllers/route-controller");

const router = express.Router();

// Route to create a new route (POST request)
router.post("/", createRoute);

// Route to get all routes (GET request)
router.get("/", getRoutes);

// Route to get a specific route by ID (GET request with dynamic parameter)
router.get("/:id", getRouteById);

// Route to update a specific route by ID (PUT request with dynamic parameter)
router.put("/:id", updateRoute);

// Route to delete a specific route by ID (DELETE request with dynamic parameter)
router.delete("/:id", deleteRoute);

// Route to add an alert to a specific route by ID (POST request with dynamic parameter)
router.post("/:id/alerts", addAlertToRoute);

// Route to remove an alert from a specific route by ID (DELETE request with dynamic parameters)
router.delete("/:id/alerts/:alertId", removeAlertFromRoute);


// Export the router to use it in other parts of the application
module.exports = router;
