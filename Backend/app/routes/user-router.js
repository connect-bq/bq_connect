const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to create a new user
router.post('/', userController.createUser);

// Route to get all users
router.get('/', userController.getUsers);

// Route to get a specific user by ID
router.get('/:id', userController.getUserById);

// Route to update a user by ID
router.put('/:id', userController.updateUser);

// Route to delete a user by ID
router.delete('/:id', userController.deleteUser);

router.post('/:id/routes', userController.addRouteToUser);

// Route to remove a route from a user's list
router.delete('/:id/routes/:routeId', userController.removeRouteFromUser);

module.exports = router;