const Controller = require('../controllers/order');
const express = require('express');
const router = express.Router();

router.get('/', Controller.getAllOrders)
router.get('/:id', Controller.getOrderById)
router.get('/customer/:id', Controller.getOrdersByUserId)

module.exports = router;