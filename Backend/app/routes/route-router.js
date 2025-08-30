// Import express and create a router instance
const express = require('express');
const router = express.Router();

// Import the route controller to handle the logic
const routeController = require('../controllers/routeController');

// Route to create a new route (POST request)
router.post('/', routeController.createRoute);

// Route to get all routes (GET request)
router.get('/', routeController.getRoutes);

// Route to get a specific route by ID (GET request with dynamic parameter)
router.get('/:id', routeController.getRouteById);

// Export the router to use it in other parts of the application
module.exports = router;