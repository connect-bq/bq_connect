const User = require("../models/user-model");

// Get all Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create User method
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Add Route to User History
const addRouteToUserHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const route = req.body.route;
    if (!route) {
      console.error("Route is required");
      return res.status(400).json({ message: "Route is required" });
    }

    user.routes_history.push(req.body.route);
    await user.save();

    res.status(201).json(user.routes_history);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Remove Route from User
const removeRouteFromUserHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.body.route) {
      console.error("Route is required");
      return res.status(400).json({ message: "Route is required" });
    }

    if (!user.routes_history.includes(req.body.route)) {
      console.error("Route not in history");
      return res.status(404).json({ message: "Route not in history" });
    }

    user.routes_history = user.routes_history.filter(
      (route) => route !== req.body.route
    );
    await user.save();

    res.json(user.routes_history);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Add Route to User History
const addFavoriteRouteToUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const route = req.body.route;
    if (!route) {
      console.error("Route is required");
      return res.status(400).json({ message: "Route is required" });
    }

    if (user.favorites_routes.includes(route)) {
      console.error("Route already in favorites");
      return res.status(400).json({ message: "Route already in favorites" });
    }

    user.favorites_routes.push(req.body.route);
    await user.save();

    res.status(201).json(user.favorites_routes);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Remove Route from User
const removeFavoriteRouteFromUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.body.route) {
      console.error("Route is required");
      return res.status(400).json({ message: "Route is required" });
    }

    if (!user.favorites_routes.includes(req.body.route)) {
      console.error("Route not in favorites");
      return res.status(404).json({ message: "Route not in favorites" });
    }

    user.favorites_routes = user.favorites_routes.filter(
      (route) => route !== req.body.route
    );
    await user.save();

    res.json(user.favorites_routes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addRouteToUserHistory,
  removeRouteFromUserHistory,
  addFavoriteRouteToUser,
  removeFavoriteRouteFromUser,
};