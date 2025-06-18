const Controller = require('../controllers/order');
const express = require('express');
const verifyToken = require('../middlewares/auth');
const router = express.Router();

router.get('/', Controller.getAllOrders);
router.get('/provider', verifyToken, Controller.getProviderOrders);
router.get('/customer/', verifyToken, Controller.getOrdersByUserId);
router.get('/:id', Controller.getOrderById);
router.put('/:orderId/status', verifyToken, Controller.updateOrderStatus);
router.post('/', verifyToken, Controller.createInstantOrder);

module.exports = router;