const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addRouteToUserHistory,
  removeRouteFromUserHistory,
  addFavoriteRouteToUser,
  removeFavoriteRouteFromUser,
} = require("../controllers/user-controller");

const router = express.Router();

// User routes
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/history/:id", addRouteToUserHistory);
router.delete("/history/:id", removeRouteFromUserHistory);
router.post("/favorites/:id", addFavoriteRouteToUser);
router.delete("/favorites/:id", removeFavoriteRouteFromUser);

module.exports = router;
