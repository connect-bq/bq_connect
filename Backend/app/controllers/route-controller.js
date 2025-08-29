const Route = require('../models/route-model');

// Get all Routes
const getRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.status(200).json(routes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get a Route by ID
const getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.json(route);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Create a new Route
const createRoute = async (req, res) => {
    try {
        const newRoute = new Route(req.body);
        await newRoute.save();
        res.status(201).json(newRoute);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

// Update a Route
const updateRoute = async (req, res) => {
    try {
        const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedRoute) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.json(updatedRoute);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

// Delete a Route
const deleteRoute = async (req, res) => {
    try {
        const deletedRoute = await Route.findByIdAndDelete(req.params.id);
        if (!deletedRoute) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Add an alert to a Route
const addAlertToRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        route.alerts.push(req.body);
        await route.save();
        res.status(201).json(route);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

// Remove an alert from a Route
const removeAlertFromRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        route.alerts = route.alerts.filter(
            (alert) => alert._id.toString() !== req.params.alertId
        );
        await route.save();
        res.json(route);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRoutes,
    getRouteById,
    createRoute,
    updateRoute,
    deleteRoute,
    addAlertToRoute,
    removeAlertFromRoute,
};