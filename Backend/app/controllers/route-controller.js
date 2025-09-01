const Route = require("../models/route-model");

// Get all routes
const getRoutes = async (req, res) => {
  try {
    // Find all routes in the database.
    const routes = await Route.find();
    // Respond with a 200 OK status and the list of routes.
    res.status(200).json(routes);
  } catch (error) {
    // Log the error message for debugging purposes.
    console.error(error.message);
    // Respond with a 500 Server Error status.
    res.status(500).json({ error: "Server error" });
  }
};

// Get a route by ID
const getRouteById = async (req, res) => {
  try {
    // Find a route by the ID provided in the request parameters.
    const route = await Route.findById(req.params.id);
    // If no route is found, send a 404 Not Found response.
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    // Respond with a 200 OK status and the found route.
    res.status(200).json(route);
  } catch (error) {
    // Check if the error is due to an invalid ObjectId format.
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid Route ID" });
    }
    // Log other types of errors and send a 500 Server Error response.
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new route
const createRoute = async (req, res) => {
  try {
    // Create a new Route instance with data from the request body.
    const newRoute = new Route(req.body);
    // Save the new route to the database.
    await newRoute.save();
    // Respond with a 201 Created status and the new route object.
    res.status(201).json(newRoute);
  } catch (error) {
    // Handle Mongoose validation errors (e.g., missing required fields).
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    // Handle duplicate key errors (e.g., a route with the same name already exists).
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Duplicate key error: A route with this name already exists.",
      });
    }
    // Log other server errors.
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a route
const updateRoute = async (req, res) => {
  try {
    // Find the route by ID and update it. `new: true` returns the updated document, and `runValidators: true` applies schema validation.
    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    // If the route to update is not found, return a 404 Not Found.
    if (!updatedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }
    // Respond with a 200 OK status and the updated route.
    res.status(200).json(updatedRoute);
  } catch (error) {
    // Handle invalid ObjectId format.
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid Route ID" });
    }
    // Handle validation errors from the schema.
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    // Handle duplicate key errors.
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Duplicate key error: A route with this name already exists.",
      });
    }
    // Log and handle other server errors.
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a route
const deleteRoute = async (req, res) => {
  try {
    // Find and delete the route by its ID.
    const deletedRoute = await Route.findByIdAndDelete(req.params.id);
    // If the route is not found, return a 404 Not Found.
    if (!deletedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }
    // Respond with a 204 No Content status, as the resource no longer exists.
    res.status(204).send();
  } catch (error) {
    // Handle invalid ObjectId format.
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid Route ID" });
    }
    // Log and handle other server errors.
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const addPointToRoute = async (req, res) => {
  try {
    // Find the route by its ID.
    const route = await Route.findById(req.params.id);
    // If the route doesn't exist, return a 404 Not Found.
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    // Push the new point data from the request body into the path array.
    route.path.push(req.body);
    // Save the updated route document to the database.
    await route.save();
    // Respond with a 201 Created status and the updated route.
    res.status(201).json(route);
  } catch (error) {
    // Handle invalid route ID format.
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid Route ID" });
    }
    // Handle validation errors for the point sub-document.
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    // Log and handle other server errors.
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const removePointFromRoute = async (req, res) => {
  try {
    // Find the route by its ID.
    const route = await Route.findById(req.params.id);
    // If the route doesn't exist, return a 404 Not Found.
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Find the index of the point to be removed within the route's path array.
    const pointIndex = route.path.findIndex(
      (point) => point._id === req.params.pointId
    );
    // If the point is not found, return a 404 Not Found.
    if (pointIndex === -1) {
      return res.status(404).json({ message: "Point not found in this route" });
    }
    // Use splice() to remove the point at the found index.
    route.path.splice(pointIndex, 1);
    // Save the updated route document.
    await route.save();
    // Respond with a 200 OK status and the updated route.
    res.status(200).json(route);
  } catch (error) {
    // Handle invalid Route ID or Point ID format.
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid Route ID or Point ID" });
    }
    // Log and handle other server errors.
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Add an alert to a route
const addAlertToRoute = async (req, res) => {
  try {
    // Find the route by its ID.
    const route = await Route.findById(req.params.id);
    // If the route doesn't exist, return a 404 Not Found.
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    // Push the new alert data from the request body into the alerts array.
    route.alerts.push(req.body);
    // Save the updated route document to the database.
    await route.save();
    // Respond with a 201 Created status and the updated route.
    res.status(201).json(route);
  } catch (error) {
    // Handle invalid route ID format.
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid Route ID" });
    }
    // Handle validation errors for the alert sub-document.
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    // Log and handle other server errors.
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Remove an alert from a route
const removeAlertFromRoute = async (req, res) => {
  try {
    // Find the route by its ID.
    const route = await Route.findById(req.params.id);
    // If the route doesn't exist, return a 404 Not Found.
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    // Find the index of the alert to be removed within the route's alerts array.
    const alertIndex = route.alerts.findIndex(
      (alert) => alert._id.toString() === req.params.alertId
    );
    // If the alert is not found, return a 404 Not Found.
    if (alertIndex === -1) {
      return res.status(404).json({ message: "Alert not found in this route" });
    }
    // Use splice() to remove the alert at the found index.
    route.alerts.splice(alertIndex, 1);
    // Save the updated route document.
    await route.save();
    // Respond with a 200 OK status and the updated route.
    res.status(200).json(route);
  } catch (error) {
    // Handle invalid Route ID or Alert ID format.
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid Route ID or Alert ID" });
    }
    // Log and handle other server errors.
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Export all controller functions.
module.exports = {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  addPointToRoute,
  removePointFromRoute,
  addAlertToRoute,
  removeAlertFromRoute,
};
