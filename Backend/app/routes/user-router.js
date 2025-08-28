const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addRouteToHistory,
  removeRouteFromHistory,
  addRouteToFavorites,
  removeRouteFromFavorites,
} = require("../controllers/user-controller");

const router = express.Router();

// User routes
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/history/:id", addRouteToHistory);
router.delete("/history/:id", removeRouteFromHistory);
router.post("/favorites/:id", addRouteToFavorites);
router.delete("/favorites/:id", removeRouteFromFavorites);

module.exports = router;
