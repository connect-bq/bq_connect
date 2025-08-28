const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.post('/', routeController.createRoute);

router.get('/', routeController.getRoutes);

router.get('/:id', routeController.getRouteById);

module.exports = router;